<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useChatScroll } from '~/composables/useChatScroll'
import type { AdminSupportChat, SupportMessage } from '~/types/support-chat'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { useI18n } from '~/composables/useI18n'
import { useSupportChatService } from '~/services/support-chat.service'

interface Props {
  modelValue?: AdminSupportChat | null
  selectedChat?: AdminSupportChat | null
  messages?: SupportMessage[]
  activeMessages?: SupportMessage[]
  replyText?: string
  isLoadingMessages?: boolean
  isLoadingMore?: boolean
  isSending?: boolean
  onLoadMore?: () => Promise<void>
  socket?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  selectedChat: undefined,
  messages: undefined,
  activeMessages: undefined,
  replyText: undefined,
  isLoadingMessages: false,
  isLoadingMore: undefined,
  isSending: false,
  onLoadMore: undefined,
  socket: undefined,
})

const { t } = useI18n()
const chatService = useSupportChatService()

const emit = defineEmits<{
  (e: 'update:modelValue', value: AdminSupportChat | null): void
  (e: 'update:selectedChat', value: AdminSupportChat | null): void
  (e: 'update:replyText', value: string): void
  (e: 'send-reply'): void
  (e: 'send'): void
  (e: 'back'): void
  (e: 'load-more'): void
  (e: 'message-deleted', messageId: string): void
  (e: 'chat-deleted', chatId: string): void
}>()

// ── Computed Bindings ──────────────────────────────────────────────────
const currentChat = computed(
  () => (props.selectedChat !== undefined ? props.selectedChat : props.modelValue) ?? null,
)

const messageList = computed(
  () => props.messages ?? props.activeMessages ?? [],
)

const localReplyText = ref('')
const currentReplyText = computed({
  get: () => (props.replyText !== undefined ? props.replyText : localReplyText.value),
  set: (val: string) => {
    localReplyText.value = val
    emit('update:replyText', val)
  },
})

// ── Upward Scroll Composable ───────────────────────────────────────────
const messagesContainer = ref<HTMLElement | null>(null)

const {
  isLoadingMore: internalLoadingMore,
  scrollToBottom,
  handleScroll,
} = useChatScroll(messagesContainer, {
  onLoadMore: async () => {
    if (props.onLoadMore) {
      await props.onLoadMore()
    } else {
      emit('load-more')
    }
  },
  threshold: 40,
})

const effectiveLoadingMore = computed(
  () => props.isLoadingMore ?? internalLoadingMore.value,
)

// Auto-scroll to bottom once initial message loading completes
watch(
  () => props.isLoadingMessages,
  async (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      await nextTick()
      scrollToBottom()
    }
  },
)

// Expose methods for parent component control (e.g. scroll on new messages)
defineExpose({
  scrollToBottom,
  messagesContainer,
})

// ── Actions ────────────────────────────────────────────────────────────
function handleBack() {
  emit('update:selectedChat', null)
  emit('update:modelValue', null)
  emit('back')
}

function handleSend() {
  if (!currentReplyText.value.trim() || props.isSending) return
  emit('send-reply')
  emit('send')
}

// ── Socket Listeners ───────────────────────────────────────────────────
function handleSocketMessageDeleted({ messageId }: { messageId: string }) {
  if (confirmModal.value.isOpen && confirmModal.value.type === 'message' && confirmModal.value.targetId === messageId) {
    confirmModal.value.isOpen = false
  }
  emit('message-deleted', messageId)
}

function handleSocketChatDeleted({ chatId }: { chatId: string }) {
  if (confirmModal.value.isOpen && confirmModal.value.type === 'chat' && confirmModal.value.targetId === chatId) {
    confirmModal.value.isOpen = false
  }
  if (currentChat.value?.id === chatId) {
    emit('chat-deleted', chatId)
    emit('update:selectedChat', null)
    emit('update:modelValue', null)
  }
}

watch(
  () => props.socket,
  (newSocket, oldSocket) => {
    if (oldSocket) {
      oldSocket.off('message:deleted', handleSocketMessageDeleted)
      oldSocket.off('chat:deleted', handleSocketChatDeleted)
    }
    if (newSocket) {
      newSocket.on('message:deleted', handleSocketMessageDeleted)
      newSocket.on('chat:deleted', handleSocketChatDeleted)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (props.socket) {
    props.socket.off('message:deleted', handleSocketMessageDeleted)
    props.socket.off('chat:deleted', handleSocketChatDeleted)
  }
})

// ── Custom Confirmation Modal & Deletion ──────────────────────────────
interface ConfirmModalState {
  isOpen: boolean
  type: 'message' | 'chat'
  targetId: string
  title: string
  message: string
  isDeleting: boolean
}

const confirmModal = ref<ConfirmModalState>({
  isOpen: false,
  type: 'message',
  targetId: '',
  title: '',
  message: '',
  isDeleting: false,
})

function openDeleteMessageModal(messageId: string) {
  confirmModal.value = {
    isOpen: true,
    type: 'message',
    targetId: messageId,
    title: t('chat.deleteMessageTitle') || 'Delete Message',
    message: t('chat.deleteMessageConfirm') || 'Are you sure you want to delete this message? This action cannot be undone.',
    isDeleting: false,
  }
}

function openDeleteChatModal() {
  if (!currentChat.value?.id) return
  confirmModal.value = {
    isOpen: true,
    type: 'chat',
    targetId: currentChat.value.id,
    title: t('chat.deleteChatTitle') || 'Delete Chat',
    message: t('chat.deleteChatConfirm') || 'Are you sure you want to delete this entire chat? This action cannot be undone.',
    isDeleting: false,
  }
}

function closeConfirmModal() {
  if (confirmModal.value.isDeleting) return
  confirmModal.value.isOpen = false
}

async function handleConfirmDelete() {
  if (!confirmModal.value.isOpen || confirmModal.value.isDeleting) return
  confirmModal.value.isDeleting = true

  try {
    if (confirmModal.value.type === 'message') {
      const messageId = confirmModal.value.targetId
      await chatService.deleteMessage(messageId)
      emit('message-deleted', messageId)
      confirmModal.value.isOpen = false
    } else if (confirmModal.value.type === 'chat') {
      const chatId = confirmModal.value.targetId
      await chatService.deleteChat(chatId)
      emit('chat-deleted', chatId)
      emit('update:selectedChat', null)
      emit('update:modelValue', null)
      confirmModal.value.isOpen = false
    }
  } catch (error) {
    console.error(`Failed to delete ${confirmModal.value.type}:`, error)
  } finally {
    confirmModal.value.isDeleting = false
  }
}

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
</script>

<template>
  <main
    :class="[
      'flex-1 flex flex-col bg-white overflow-hidden',
      // Mobile: hidden when thread list is displayed
      currentChat ? 'flex' : 'hidden sm:flex',
    ]"
  >
    <!-- Conversation View (When a chat is selected) -->
    <template v-if="currentChat">
      <!-- Active Header -->
      <div
        class="px-4 sm:px-6 py-3.5 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0 shadow-xs"
      >
        <div class="flex items-center gap-3">
          <!-- Mobile Back Button -->
          <button
            type="button"
            @click="handleBack"
            class="sm:hidden p-1.5 -ml-1 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Back to chat list"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Customer Avatar -->
          <div
            class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20"
          >
            {{ getCustomerInitials(currentChat) }}
          </div>

          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-sm text-slate-900 leading-tight">
                {{ getCustomerDisplayName(currentChat) }}
              </h3>
              <span
                v-if="currentChat.user?.code"
                class="text-[10px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20"
              >
                {{ currentChat.user.code }}
              </span>
            </div>
            <div class="block xs:flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{{ currentChat.user?.email }}</span>
              <span v-if="currentChat.user?.phoneNumber">• {{ currentChat.user.phoneNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Delete Chat Button -->
        <button
          type="button"
          @click="openDeleteChatModal"
          :disabled="confirmModal.isOpen && confirmModal.type === 'chat' && confirmModal.isDeleting"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          :aria-label="t('chat.deleteChat') || 'Delete chat'"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span class="hidden sm:inline">{{ t('chat.deleteChat') || 'Delete Chat' }}</span>
        </button>
      </div>

      <!-- Message History Area -->
      <div
        ref="messagesContainer"
        @scroll="handleScroll"
        class="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 pt-16 space-y-3 bg-slate-50/50"
      >
        <!-- Upward loading spinner -->
        <div v-if="effectiveLoadingMore" class="flex justify-center py-2">
          <svg class="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>

        <!-- Messages Loading State -->
        <div
          v-if="isLoadingMessages"
          class="flex flex-col items-center justify-center h-full gap-2 text-slate-400"
        >
          <svg class="animate-spin h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span class="text-xs font-medium">Loading messages...</span>
        </div>

        <!-- Empty Conversation State -->
        <div
          v-else-if="messageList.length === 0"
          class="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8"
        >
          <p class="text-sm font-semibold text-slate-600">{{ t('chat.emptyConversation') }}</p>
          <p class="text-xs text-slate-400 mt-1">{{ t('chat.emptyConversationText') }}</p>
        </div>

        <!-- Messages Stream -->
        <template v-else>
          <div
            v-for="msg in messageList"
            :key="msg.id"
            :class="[
              'flex',
              msg.senderType === 'SUPPORTER' ? 'justify-end' : 'justify-start',
            ]"
          >
            <!-- Customer message: Left-aligned, light gray/white border -->
            <!-- Supporter message: Right-aligned, primary color -->

            <!-- Supporter message wrapper with hover delete -->
            <div
              v-if="msg.senderType === 'SUPPORTER'"
              class="relative group flex items-start gap-2 justify-end max-w-[85%]"
            >
              <!-- Delete button (hover reveal for all supporter messages) -->
              <button
                type="button"
                @click="openDeleteMessageModal(msg.id)"
                :disabled="confirmModal.isOpen && confirmModal.type === 'message' && confirmModal.targetId === msg.id && confirmModal.isDeleting"
                class="opacity-0 group-hover:opacity-100 self-center shrink-0 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Delete message"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <div
                class="max-w-full px-4 py-2.5 text-sm leading-relaxed shadow-xs break-words bg-primary text-white rounded-2xl rounded-br-sm"
              >
                <p class="whitespace-pre-wrap">{{ msg.text }}</p>
                <div class="text-[10px] mt-1 flex items-center gap-1 select-none text-white/70 justify-end">
                  <span>{{ formatTime(msg.createdAt) }}</span>
                  <!-- Visual read status / ticks for supporter sent messages -->
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
                  <!-- Single check for sent -->
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
                </div>
              </div>
            </div>

            <!-- Customer message bubble (unchanged) -->
            <div
              v-else
              class="max-w-[80%] px-4 py-2.5 text-sm leading-relaxed shadow-xs break-words bg-white text-slate-800 border border-slate-200/90 rounded-2xl rounded-bl-sm"
            >
              <p class="whitespace-pre-wrap">{{ msg.text }}</p>
              <div class="text-[10px] mt-1 flex items-center gap-1 select-none text-slate-400 justify-start">
                <span>{{ formatTime(msg.createdAt) }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Input Footer -->
      <div class="p-3 sm:p-4 border-t border-slate-200/80 bg-white shrink-0">
        <form @submit.prevent="handleSend" class="flex items-center gap-2">
          <div class="flex-1">
            <BaseInput
              id="admin-reply-input"
              v-model="currentReplyText"
              :placeholder="t('chat.typePlaceholder')"
              :disabled="isSending"
              :touched="false"
              autocomplete="off"
              @keydown.enter.prevent="handleSend"
            />
          </div>

          <!-- Send Button -->
          <BaseButton
            type="submit"
            variant="primary"
            size="md"
            :block="false"
            :disabled="!currentReplyText.trim() || isSending"
            :loading="isSending"
            class="shrink-0 !py-3.5 !px-5 !rounded-2xl cursor-pointer"
            aria-label="Send reply"
          >
            <span class="hidden md:inline text-xs font-bold uppercase tracking-wider">{{ t('chat.send') }}</span>
            <svg
              v-if="!isSending"
              class="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </BaseButton>
        </form>
      </div>
    </template>

    <!-- No Chat Selected Placeholder (Desktop) -->
    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/30"
    >
      <div
        class="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h3 class="font-extrabold text-slate-800 text-lg mb-1">{{ t('chat.selectConversation') }}</h3>
      <p class="text-xs text-slate-500 max-w-sm">{{ t('chat.selectConversationDesc') }}</p>
    </div>

    <!-- ── Custom Confirmation Modal (Yes / No) ─────────────────────────── -->
    <Transition name="fade-modal">
      <div
        v-if="confirmModal.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
        @click.self="closeConfirmModal"
        @keydown.esc="closeConfirmModal"
      >
        <div
          class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 transform transition-all animate-scale-up text-center my-8"
        >
          <!-- Warning / Trash Icon -->
          <div
            class="w-14 h-14 bg-red-100 text-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-bold text-slate-900 mb-2">
            {{ confirmModal.title }}
          </h3>

          <!-- Message -->
          <p class="text-xs text-slate-500 mb-6 leading-relaxed">
            {{ confirmModal.message }}
          </p>

          <!-- Modal Action Buttons: No and Yes -->
          <div class="flex items-center justify-center gap-3">
            <BaseButton
              type="button"
              variant="outline"
              size="md"
              :block="false"
              :disabled="confirmModal.isDeleting"
              @click="closeConfirmModal"
              class="flex-1 !py-2.5 !rounded-xl cursor-pointer"
            >
              {{ t('chat.no') || 'No' }}
            </BaseButton>

            <BaseButton
              type="button"
              variant="tertiary"
              size="md"
              :block="false"
              :loading="confirmModal.isDeleting"
              :disabled="confirmModal.isDeleting"
              @click="handleConfirmDelete"
              class="flex-1 !py-2.5 !rounded-xl cursor-pointer"
            >
              {{ confirmModal.isDeleting ? (t('chat.deleting') || 'Deleting...') : (t('chat.yes') || 'Yes') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.25s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

