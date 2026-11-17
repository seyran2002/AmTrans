<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { io, type Socket } from 'socket.io-client'
import { useApi } from '~/composables/useApi'
import { useChatScroll } from '~/composables/useChatScroll'
import { useAudioNotification } from '~/composables/useAudioNotification'
import { useSupportChatService } from '~/services/support-chat.service'
import type { SupportMessage, SupportChat } from '~/types/support-chat'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'

// ── State ──────────────────────────────────────────────────────────────
const isOpen = ref(false)
const messages = ref<SupportMessage[]>([])
const newMessage = ref('')
const chat = ref<SupportChat | null>(null)
const hasMore = ref(false)
const nextCursor = ref<string | null>(null)
const isConnected = ref(false)
const isSending = ref(false)
const isInitialLoading = ref(false)
const unreadCount = ref(0)
const hasLoadedInitial = ref(false)

// ── Service & Auth ─────────────────────────────────────────────────────
const chatService = useSupportChatService()
const { getApiUrl } = useApi()
const token = useCookie<string | null>('auth_token')
const route = useRoute()
const isHidden = computed(() => route.path.includes('support-chat'))
let socket: Socket | null = null

// ── Container & Upward Infinite Scroll ──────────────────────────────────
const messagesContainer = ref<HTMLElement | null>(null)

async function loadOlderMessages() {
  if (!chat.value?.id || !hasMore.value) return

  try {
    const response = await chatService.getMessages(
      chat.value.id,
      nextCursor.value,
      15,
    )
    if (response.messages?.length) {
      const existingIds = new Set(messages.value.map((m) => m.id))
      const freshMessages = response.messages.filter((m) => !existingIds.has(m.id))
      messages.value = [...freshMessages, ...messages.value]
    }
    hasMore.value = response.hasMore
    nextCursor.value = response.nextCursor
  } catch (error) {
    console.error('Failed to load older support messages:', error)
  }
}

const {
  isLoadingMore,
  scrollToBottom,
  isNearBottom,
  handleScroll,
} = useChatScroll(messagesContainer, {
  onLoadMore: loadOlderMessages,
  threshold: 40,
})

const { playNotification } = useAudioNotification();

// ── Socket Connection ──────────────────────────────────────────────────
function connectSocket() {
  if (socket?.connected) return

  const apiUrl = getApiUrl() || 'http://localhost:3000'
  const socketUrl = `${apiUrl}/support-chat`

  socket = io(socketUrl, {
    auth: { token: token.value || '' },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  })

  socket.on('connect', () => {
    isConnected.value = true
  })

  socket.on('disconnect', () => {
    isConnected.value = false
  })

  socket.on('new_supporter_reply', (reply: SupportMessage) => {
    playNotification();

    if (!messages.value.some((m) => m.id === reply.id)) {
      messages.value.push(reply)
    }

    if (isOpen.value) {
      markChatAsRead();
      if (isNearBottom()) {
        scrollToBottom(true)
      }
    } else {
      unreadCount.value++
    }
  })

  socket.on('messages_read', (payload: { chatId: string; readerRole?: string }) => {
    if (chat.value?.id && payload.chatId === chat.value.id) {
      messages.value.forEach((m) => {
        if (m.senderType === 'CUSTOMER') {
          m.isRead = true
        }
      })
    }
  })

  // Real-time deletion sync
  socket.on('message:deleted', ({ messageId }: { messageId: string }) => {
    messages.value = messages.value.filter((m) => m.id !== messageId)
  })

  socket.on('chat:deleted', ({ chatId }: { chatId: string }) => {
    if (chat.value?.id === chatId) {
      messages.value = []
      chat.value = null
      unreadCount.value = 0
    }
  })
}

function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
    isConnected.value = false
  }
}

// ── Read Flow Sync ─────────────────────────────────────────────────────
async function markChatAsRead() {
  unreadCount.value = 0
  messages.value.forEach((m) => {
    if (m.senderType === 'SUPPORTER') {
      m.isRead = true
    }
  })

  if (!chat.value?.id) return

  if (socket?.connected) {
    socket.emit('mark_messages_read', { chatId: chat.value.id })
  }
  try {
    await chatService.markMessagesAsRead(chat.value.id)
  } catch (error) {
    console.error('Failed to mark messages as read:', error)
  }
}

// ── Chat Initialization ────────────────────────────────────────────────
async function fetchInitialUnread() {
  if (!token.value) return
  try {
    chat.value = await chatService.getActiveChat()
    if (chat.value?.id) {
      const response = await chatService.getMessages(chat.value.id, null, 15)
      messages.value = response.messages || []
      hasMore.value = response.hasMore
      nextCursor.value = response.nextCursor
      hasLoadedInitial.value = true

      // Initial count calculated from fetched messages where senderType === 'SUPPORTER' and isRead === false
      unreadCount.value = messages.value.filter(
        (m) => m.senderType === 'SUPPORTER' && !m.isRead,
      ).length
    }
  } catch (error) {
    console.error('Failed to pre-fetch support chat:', error)
  }
}

async function initChat() {
  if (isInitialLoading.value) return
  isInitialLoading.value = true

  try {
    if (!chat.value) {
      chat.value = await chatService.getActiveChat()
    }

    if (chat.value?.id) {
      if (!hasLoadedInitial.value) {
        const response = await chatService.getMessages(chat.value.id, null, 15)
        messages.value = response.messages || []
        hasMore.value = response.hasMore
        nextCursor.value = response.nextCursor
        hasLoadedInitial.value = true
      }

      connectSocket()
      await scrollToBottom()
    }
  } catch (error) {
    console.error('Failed to initialize active support chat:', error)
  } finally {
    isInitialLoading.value = false
  }
}

// ── Actions ────────────────────────────────────────────────────────────
async function toggleChat() {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    if (!hasLoadedInitial.value) {
      await initChat()
    } else {
      connectSocket()
      await scrollToBottom()
    }
    await markChatAsRead()
  }
}

function closeChat() {
  isOpen.value = false
}

function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || isSending.value) return

  if (!socket?.connected) {
    connectSocket()
  }

  isSending.value = true
  const textToSend = text
  newMessage.value = ''

  if (socket && socket.connected) {
    socket.emit(
      'send_customer_message',
      { text: textToSend },
      (savedMessage: SupportMessage) => {
        isSending.value = false
        if (savedMessage && savedMessage.id) {
          if (!messages.value.some((m) => m.id === savedMessage.id)) {
            messages.value.push(savedMessage)
          }
          scrollToBottom(true)
        }
      },
    )
  } else {
    isSending.value = false
  }
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeChat()
  }
}

// ── Computed ───────────────────────────────────────────────────────────
const formattedMessages = computed(() =>
  messages.value.map((msg) => {
    let formattedTime = ''
    try {
      formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      formattedTime = ''
    }
    return {
      ...msg,
      formattedTime,
      isCustomer: msg.senderType === 'CUSTOMER',
    }
  }),
)

// ── Mobile Scroll Lock ─────────────────────────────────────────────────
const isScrollLocked = ref(false)

function lockMobileScroll() {
  if (!import.meta.client || isScrollLocked.value) return
  if (window.innerWidth < 640) {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    isScrollLocked.value = true
  }
}

function unlockMobileScroll() {
  if (!import.meta.client || !isScrollLocked.value) return
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  isScrollLocked.value = false
}

function handleResize() {
  if (!import.meta.client) return
  if (isOpen.value) {
    if (window.innerWidth < 640) {
      lockMobileScroll()
    } else {
      unlockMobileScroll()
    }
  } else if (isScrollLocked.value) {
    unlockMobileScroll()
  }
}

watch(isOpen, (newVal) => {
  if (!import.meta.client) return
  if (newVal) {
    if (window.innerWidth < 640) {
      lockMobileScroll()
    }
  } else {
    unlockMobileScroll()
  }
})

// ── Lifecycle ──────────────────────────────────────────────────────────
onMounted(async () => {
  document.addEventListener('keydown', onEscape)
  if (import.meta.client) {
    window.addEventListener('resize', handleResize)
  }
  // Eagerly connect socket and prefetch chat unread count if token is present
  if (token.value) {
    connectSocket()
    await fetchInitialUnread()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onEscape)
  if (import.meta.client) {
    window.removeEventListener('resize', handleResize)
  }
  unlockMobileScroll()
  disconnectSocket()
})
</script>

<template>
  <div v-if="!isHidden" class="support-chat-widget">
    <!-- Floating Chat Toggle Button (Only in Dashboard) -->
    <button
      v-if="!isOpen"
      type="button"
      @click="toggleChat"
      class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary/30 cursor-pointer"
      aria-label="Open support chat"
    >
      <!-- Chat Bubble Icon -->
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      <!-- Unread Messages Badge -->
      <ClientOnly> 
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </ClientOnly>
    </button>

    <!-- Chat Window Panel -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
      >
        <div
          v-if="isOpen"
          :class="[
            'fixed z-50 bg-white flex flex-col shadow-2xl border border-slate-200/80 overflow-hidden',
            // Mobile (< sm): Takes up the whole screen
            'inset-0 w-full h-full rounded-none',
            // Desktop (sm+): Floating panel bottom-6 right-6, w-[380px], h-[75vh], max-h-[700px], rounded-2xl
            'sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[75vh] sm:max-h-[700px] sm:rounded-2xl',
          ]"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-dark text-white shrink-0 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-sm sm:text-base leading-tight">Amtrans Support</h3>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span
                    :class="[
                      'w-2 h-2 rounded-full',
                      isConnected ? 'bg-green-400' : 'bg-slate-300',
                    ]"
                  />
                  <span class="text-xs text-white/80 font-medium">
                    {{ isConnected ? 'Online' : 'Connecting...' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Close Button using BaseButton -->
            <BaseButton
              type="button"
              variant="ghost"
              size="sm"
              :block="false"
              @click="closeChat"
              class="!p-1.5 !rounded-xl !text-white hover:!bg-white/20 !shadow-none !border-0 focus:!ring-white/40 cursor-pointer"
              aria-label="Close chat"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </BaseButton>
          </div>

          <!-- Message Area: Scrollable with auto-scroll & upward infinite scroll -->
          <div
            ref="messagesContainer"
            @scroll="handleScroll"
            class="flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-16 space-y-3 bg-slate-50/60"
          >
            <!-- Upward Infinite Scroll Loading Indicator -->
            <div
              v-if="isLoadingMore"
              class="flex justify-center py-2"
            >
              <svg
                class="animate-spin h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>

            <!-- Initial Loading State -->
            <div
              v-if="isInitialLoading"
              class="flex flex-col items-center justify-center h-full gap-3 text-slate-400"
            >
              <svg
                class="animate-spin h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span class="text-sm font-medium">Loading chat...</span>
            </div>

            <!-- Empty Messages State -->
            <div
              v-else-if="messages.length === 0 && !isInitialLoading"
              class="flex flex-col items-center justify-center h-full gap-2.5 text-slate-400 text-center px-4"
            >
              <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p class="text-sm font-semibold text-slate-600">No messages yet</p>
              <p class="text-xs text-slate-400">Ask us anything, our support team is here to help!</p>
            </div>

            <!-- Messages List -->
            <template v-else>
              <div
                v-for="msg in formattedMessages"
                :key="msg.id"
                :class="[
                  'flex',
                  msg.isCustomer ? 'justify-end' : 'justify-start',
                ]"
              >
                <!-- Customer message: Right-aligned, primary color -->
                <!-- Supporter message: Left-aligned, gray background -->
                <div
                  :class="[
                    'max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm break-words',
                    msg.isCustomer
                      ? 'bg-primary text-white rounded-2xl rounded-br-sm'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-2xl rounded-bl-sm',
                  ]"
                >
                  <p class="whitespace-pre-wrap">{{ msg.text }}</p>
                  <div
                    :class="[
                      'text-[10px] mt-1 flex items-center gap-1 select-none',
                      msg.isCustomer ? 'text-white/70 justify-end' : 'text-slate-400 justify-start',
                    ]"
                  >
                    <span>{{ msg.formattedTime }}</span>
                    <!-- Read status indicator for customer sent messages -->
                    <template v-if="msg.isCustomer">
                      <!-- Double check for read -->
                      <svg
                        v-if="msg.isRead"
                        class="w-3.5 h-3.5 text-white/90 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-label="Read"
                      >
                        <path d="M18 6L7 17l-5-5" />
                        <path d="M22 10l-7.5 7.5-1.5-1.5" />
                      </svg>
                      <!-- Single check for sent/delivered -->
                      <svg
                        v-else
                        class="w-3.5 h-3.5 text-white/60 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-label="Sent"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </template>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Input Footer: BaseInput & BaseButton with Enter to send -->
          <div class="shrink-0 border-t border-slate-200/80 bg-white p-3">
            <form @submit.prevent="sendMessage" class="flex items-center gap-2">
              <div class="flex-1">
                <BaseInput
                  id="support-chat-message-input"
                  v-model="newMessage"
                  placeholder="Type a message..."
                  :disabled="!isConnected || isSending"
                  :touched="false"
                  autocomplete="off"
                  @keydown.enter.prevent="sendMessage"
                />
              </div>

              <!-- Send Button using BaseButton -->
              <BaseButton
                type="submit"
                variant="primary"
                size="md"
                :block="false"
                :disabled="!newMessage.trim() || !isConnected || isSending"
                :loading="isSending"
                class="shrink-0 !py-3.5 !px-4 !rounded-2xl cursor-pointer shadow-none"
                aria-label="Send message"
              >
                <svg
                  v-if="!isSending"
                  class="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </BaseButton>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
