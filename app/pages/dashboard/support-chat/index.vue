<script setup lang="ts">
import { ref, shallowRef, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { io, type Socket } from 'socket.io-client'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useI18n } from '~/composables/useI18n'
import { useSupportChatService } from '~/services/support-chat.service'
import type { AdminSupportChat, SupportMessage } from '~/types/support-chat'
import ConversationPanel from '~/components/support-chat/ConversationPanel.vue'
import { useAudioNotification } from '~/composables/useAudioNotification'

definePageMeta({
  middleware: ['auth', 'admin-or-operator'],
  layout: 'dashboard',
})

const { t } = useI18n()
const { user: currentUser } = useAuth()
const { getApiUrl } = useApi()
const token = useCookie<string | null>('auth_token')
const chatService = useSupportChatService()

// ── State ──────────────────────────────────────────────────────────────
const chats = ref<AdminSupportChat[]>([])
const selectedChat = ref<AdminSupportChat | null>(null)
const activeMessages = ref<SupportMessage[]>([])
const replyText = ref('')
const searchQuery = ref('')
const isLoadingChats = ref(false)
const isLoadingMessages = ref(false)
const isSending = ref(false)
const hasMore = ref(false)
const nextCursor = ref<string | null>(null)
const isConnected = ref(false)

// ── References ─────────────────────────────────────────────────────────
const conversationPanelRef = ref<InstanceType<typeof ConversationPanel> | null>(null)
const socket = shallowRef<Socket | null>(null)

const scrollToBottom = async (smooth = false) => {
  await conversationPanelRef.value?.scrollToBottom(smooth)
}

// ── Upward Scroll Composable ───────────────────────────────────────────
async function loadOlderMessages() {
  if (!selectedChat.value?.id || !hasMore.value) return

  try {
    const response = await chatService.getAdminMessages(
      selectedChat.value.id,
      nextCursor.value,
      15,
    )
    if (response.messages?.length) {
      const existingIds = new Set(activeMessages.value.map((m) => m.id))
      const freshMessages = response.messages.filter((m) => !existingIds.has(m.id))
      activeMessages.value = [...freshMessages, ...activeMessages.value]
    }
    hasMore.value = response.hasMore
    nextCursor.value = response.nextCursor
  } catch (error) {
    console.error('Failed to load older messages:', error)
  }
}

const { playNotification } = useAudioNotification()

// ── Helpers ────────────────────────────────────────────────────────────
function getCustomerDisplayName(chatItem: AdminSupportChat): string {
  const u = chatItem.user
  if (!u) return 'Customer'
  const full = [u.firstName, u.lastName].filter(Boolean).join(' ')
  return full || u.email || 'Customer'
}

function getCustomerInitials(chatItem: AdminSupportChat): string {
  const u = chatItem.user
  if (u?.firstName || u?.lastName) {
    return `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase()
  }
  return (u?.email?.[0] || 'C').toUpperCase()
}

function formatTime(isoString?: string): string {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

function getSnippet(chatItem: AdminSupportChat): string {
  const last = chatItem.lastMessage || chatItem.messages?.[0]
  if (!last) return t('chat.noMessages')
  const prefix = last.senderType === 'SUPPORTER' ? t('chat.you') : ''
  return `${prefix}${last.text}`
}

// ── Filtered Chats ─────────────────────────────────────────────────────
const filteredChats = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return chats.value

  return chats.value.filter((c) => {
    const name = getCustomerDisplayName(c).toLowerCase()
    const email = (c.user?.email || '').toLowerCase()
    const code = (c.user?.code || '').toLowerCase()
    return name.includes(query) || email.includes(query) || code.includes(query)
  })
})

// ── Fetch Chats ────────────────────────────────────────────────────────
async function fetchChats() {
  isLoadingChats.value = true
  try {
    const res = await chatService.getAdminChats()
    chats.value = (res || []).map((c) => ({
      ...c,
      unreadCount: c.unreadCount || 0,
      lastMessage: c.messages?.[0] || null,
    }))
  } catch (error) {
    console.error('Failed to load admin chats:', error)
  } finally {
    isLoadingChats.value = false
  }
}

// ── Select Chat ────────────────────────────────────────────────────────
async function selectChat(chatItem: AdminSupportChat) {
  selectedChat.value = chatItem
  chatItem.unreadCount = 0
  activeMessages.value = []
  hasMore.value = false
  nextCursor.value = null
  isLoadingMessages.value = true

  // Emit socket event and call REST service to mark messages as read
  if (socket.value?.connected) {
    socket.value.emit('mark_messages_read', { chatId: chatItem.id })
  }
  chatService.markMessagesAsRead(chatItem.id).catch((err) => {
    console.error('Failed to mark messages as read:', err)
  })

  try {
    const response = await chatService.getAdminMessages(chatItem.id, null, 15)
    activeMessages.value = response.messages || []
    activeMessages.value.forEach((m) => {
      if (m.senderType === 'CUSTOMER') {
        m.isRead = true
      }
    })
    hasMore.value = response.hasMore
    nextCursor.value = response.nextCursor
  } catch (error) {
    console.error('Failed to load chat messages:', error)
  } finally {
    isLoadingMessages.value = false
    await nextTick()
    await scrollToBottom()
  }
}

// ── Send Supporter Reply ───────────────────────────────────────────────
function sendReply() {
  const text = replyText.value.trim()
  if (!text || !selectedChat.value || isSending.value) return

  const customerId = selectedChat.value.userId
  const chatId = selectedChat.value.id
  replyText.value = ''
  isSending.value = true

  // Optimistic message
  const optimisticId = `temp-${Date.now()}`
  const optimisticMessage: SupportMessage = {
    id: optimisticId,
    chatId,
    senderId: currentUser.value?.id || '',
    senderType: 'SUPPORTER',
    text,
    isRead: true,
    createdAt: new Date().toISOString(),
  }

  activeMessages.value.push(optimisticMessage)
  selectedChat.value.lastMessage = optimisticMessage
  selectedChat.value.updatedAt = optimisticMessage.createdAt

  // Move selected chat to top of list
  const idx = chats.value.findIndex((c) => c.id === chatId)
  if (idx > 0) {
    const [moved] = chats.value.splice(idx, 1)
    chats.value.unshift(moved)
  }

  scrollToBottom(true)

  if (socket.value && socket.value.connected) {
    socket.value.emit(
      'send_supporter_reply',
      { customerId, text },
      (savedMessage: SupportMessage) => {
        isSending.value = false
        if (savedMessage && savedMessage.id) {
          const optIdx = activeMessages.value.findIndex((m) => m.id === optimisticId)
          if (optIdx !== -1) {
            activeMessages.value[optIdx] = savedMessage
          }
          if (selectedChat.value) {
            selectedChat.value.lastMessage = savedMessage
          }
        }
      },
    )
  } else {
    isSending.value = false
  }
}

// ── Socket Connection ──────────────────────────────────────────────────
function setupSocket() {
  if (socket.value?.connected) return

  const apiUrl = getApiUrl() || 'http://localhost:3000'
  const socketUrl = `${apiUrl}/support-chat`

  const s = io(socketUrl, {
    auth: { token: token.value || '' },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  })

  socket.value = s

  s.on('connect', () => {
    isConnected.value = true
  })

  s.on('disconnect', () => {
    isConnected.value = false
  })

  // Customer message received
  s.on(
    'new_customer_message',
    (payload: SupportMessage & { customerId: string }) => {
      playNotification();
    
      // Find matching thread in left sidebar
      let chatIndex = chats.value.findIndex(
        (c) => c.id === payload.chatId || c.userId === payload.customerId,
      )

      if (chatIndex !== -1) {
        const targetChat = chats.value[chatIndex]!;
        targetChat.lastMessage = payload
        targetChat.updatedAt = payload.createdAt || new Date().toISOString()

        if (selectedChat.value?.id !== targetChat.id) {
          targetChat.unreadCount = (targetChat.unreadCount || 0) + 1
        }

        // Bump to top
        chats.value.splice(chatIndex, 1)
        chats.value.unshift(targetChat)
      } else {
        fetchChats()
      }

      // If active conversation matches, append message
      if (
        selectedChat.value &&
        (selectedChat.value.id === payload.chatId ||
          selectedChat.value.userId === payload.customerId)
      ) {
        if (!activeMessages.value.some((m) => m.id === payload.id)) {
          activeMessages.value.push(payload)
        }
        scrollToBottom(true)

        // Supporter is actively viewing this chat, mark it as read immediately
        if (chats.value[0]) {
          chats.value[0].unreadCount = 0
        }
        if (socket.value?.connected) {
          socket.value.emit('mark_messages_read', { chatId: selectedChat.value.id })
        }
        chatService.markMessagesAsRead(selectedChat.value.id).catch((err) => {
          console.error('Failed to mark incoming message as read:', err)
        })
      }
    },
  )

  // Customer has read supporter messages
  s.on(
    'messages_read',
    (payload: { chatId: string; readerRole?: string }) => {
      if (selectedChat.value && selectedChat.value.id === payload.chatId) {
        activeMessages.value.forEach((m) => {
          if (m.senderType === 'SUPPORTER') {
            m.isRead = true
          }
        })
      }
    },
  )

  // Another supporter replied
  s.on(
    'supporter_replied',
    (payload: SupportMessage & { customerId: string }) => {
      const chatItem = chats.value.find(
        (c) => c.id === payload.chatId || c.userId === payload.customerId,
      )
      if (chatItem) {
        chatItem.lastMessage = payload
        chatItem.updatedAt = payload.createdAt || new Date().toISOString()
      }

      if (
        selectedChat.value &&
        (selectedChat.value.id === payload.chatId ||
          selectedChat.value.userId === payload.customerId)
      ) {
        if (
          !activeMessages.value.some(
            (m) =>
              m.id === payload.id ||
              (m.text === payload.text && m.senderType === 'SUPPORTER'),
          )
        ) {
          activeMessages.value.push(payload)
          scrollToBottom(true)
        }
      }
    },
  )

  // Message deleted by a supporter
  s.on('message:deleted', ({ messageId }: { messageId: string }) => {
    activeMessages.value = activeMessages.value.filter((m) => m.id !== messageId)
  })

  // Entire chat deleted
  s.on('chat:deleted', ({ chatId }: { chatId: string }) => {
    if (selectedChat.value?.id === chatId) {
      selectedChat.value = null
      activeMessages.value = []
    }
    chats.value = chats.value.filter((c) => c.id !== chatId)
  })
}

function disconnectSocket() {
  if (socket.value) {
    socket.value.disconnect()
    socket.value = null
    isConnected.value = false
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────
onMounted(() => {
  fetchChats()
  setupSocket()
})

onUnmounted(() => {
  disconnectSocket()
})

// ── Deletion Handlers (from ConversationPanel emits) ───────────────────
function onMessageDeleted(messageId: string) {
  activeMessages.value = activeMessages.value.filter((m) => m.id !== messageId)
}

function onChatDeleted(chatId: string) {
  if (selectedChat.value?.id === chatId) {
    selectedChat.value = null
    activeMessages.value = []
  }
  chats.value = chats.value.filter((c) => c.id !== chatId)
}
</script>

<template>
  <div class="h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
    <!-- Main Split Layout -->
    <div class="flex-1 flex min-h-0 overflow-hidden">
      <!-- ── Left Sidebar (Thread List) ────────────────────────────────── -->
      <aside
        :class="[
          'flex flex-col border-r border-slate-200/80 bg-slate-50/50 transition-all duration-300',
          // Desktop: fixed ~320px width
          'sm:w-[320px] sm:min-w-[320px] sm:flex',
          // Mobile: full width if no chat is active, hidden when viewing conversation
          selectedChat ? 'hidden sm:flex' : 'w-full flex',
        ]"
      >
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-slate-200/80 bg-white">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <h2 class="font-extrabold text-base text-slate-900 tracking-tight">
                {{ t('dashboardNav.supportChat') || 'Support Inquiries' }}
              </h2>
              <span
                v-if="chats.length"
                class="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20"
              >
                {{ chats.length }}
              </span>
            </div>

            <!-- Online Indicator -->
            <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span
                :class="[
                  'w-2 h-2 rounded-full',
                  isConnected ? 'bg-green-500' : 'bg-slate-400',
                ]"
              />
              <span>{{ isConnected ? 'Live' : 'Connecting' }}</span>
            </div>
          </div>

          <!-- Search Input -->
          <div class="relative">
            <svg
              class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('chat.searchCustomers')"
              class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        <!-- Chat List -->
        <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
          <!-- Loading state -->
          <div v-if="isLoadingChats" class="p-4 space-y-3">
            <div v-for="i in 5" :key="i" class="h-14 bg-slate-200/60 rounded-xl animate-pulse" />
          </div>

          <!-- Empty list state -->
          <div
            v-else-if="filteredChats.length === 0"
            class="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full"
          >
            <svg class="w-10 h-10 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p class="text-xs font-semibold text-slate-600">{{ t('chat.noActiveChat') }}</p>
            <p class="text-[11px] text-slate-400 mt-0.5">{{ t('chat.noActiveChatTxt') }}</p>
          </div>

          <!-- Thread Items -->
          <button
            v-for="chatItem in filteredChats"
            :key="chatItem.id"
            type="button"
            @click="selectChat(chatItem)"
            :class="[
              'w-full p-3.5 text-left transition-all duration-150 flex items-start gap-3 select-none cursor-pointer',
              selectedChat?.id === chatItem.id
                ? 'bg-primary/10 border-l-4 border-primary'
                : 'hover:bg-slate-100/70 bg-white/40',
            ]"
          >
            <!-- Customer Avatar -->
            <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
              {{ getCustomerInitials(chatItem) }}
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1 mb-1">
                <span class="font-bold text-xs text-slate-900 truncate">
                  {{ getCustomerDisplayName(chatItem) }}
                </span>
                <span class="text-[10px] text-slate-400 shrink-0 font-medium">
                  {{ formatTime(chatItem.lastMessage?.createdAt || chatItem.updatedAt) }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-2">
                <p class="text-xs text-slate-500 truncate leading-tight">
                  {{ getSnippet(chatItem) }}
                </p>

                <!-- Unread Badge -->
                <span
                  v-if="(chatItem.unreadCount || 0) > 0"
                  class="shrink-0 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs"
                >
                  {{ chatItem.unreadCount }}
                </span>
              </div>
            </div>
          </button>
        </div>
      </aside>

      <!-- ── Right Main Panel (Active Conversation) ────────────────────── -->
      <ConversationPanel
        ref="conversationPanelRef"
        v-model:selected-chat="selectedChat"
        v-model:reply-text="replyText"
        :messages="activeMessages"
        :is-loading-messages="isLoadingMessages"
        :is-sending="isSending"
        :on-load-more="loadOlderMessages"
        :socket="socket"
        @send-reply="sendReply"
        @message-deleted="onMessageDeleted"
        @chat-deleted="onChatDeleted"
      />
    </div>
  </div>
</template>

