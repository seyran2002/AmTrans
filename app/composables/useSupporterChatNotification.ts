import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { io, type Socket } from 'socket.io-client'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useSupportChatService } from '~/services/support-chat.service'
import { useAudioNotification } from '~/composables/useAudioNotification'

let socket: Socket | null = null

/**
 * Composable for Supporter Chat Notifications:
 * Manages unread badge count, socket connection, and reactive synchronization.
 */
export function useSupporterChatNotification() {
  const route = useRoute()
  const { user } = useAuth()
  const { getApiUrl } = useApi()
  const token = useCookie<string | null>('auth_token')
  const chatService = useSupportChatService()
  const { playNotification } = useAudioNotification();

  const unreadCount = useState<number>('supporter_unread_chat_count', () => 0)
  const isSupporter = computed(() => Boolean(user.value?.isSupporter))

  async function fetchUnreadCount() {
    if (!isSupporter.value || !token.value) {
      unreadCount.value = 0
      return
    }
    try {
      unreadCount.value = await chatService.getTotalUnreadCount()
    } catch (error) {
      console.error('Failed to fetch supporter unread count:', error)
    }
  }

  function setupSocket() {
    if (!isSupporter.value || !token.value || socket?.connected) return

    const apiUrl = getApiUrl() || 'http://localhost:3000'
    const socketUrl = `${apiUrl}/support-chat`

    socket = io(socketUrl, {
      auth: { token: token.value || '' },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socket.on('new_customer_message', () => {
      playNotification()
      unreadCount.value++
    })

    socket.on('messages_read', () => {
      fetchUnreadCount()
    })

    socket.on('supporter_replied', () => {
      fetchUnreadCount()
    })
  }

  function disconnectSocket() {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  }

  watch(
    () => [user.value, token.value],
    async ([newUser, newToken]) => {
      if (newUser?.isSupporter && newToken) {
        await fetchUnreadCount()
        setupSocket()
      } else {
        unreadCount.value = 0
        disconnectSocket()
      }
    },
    { immediate: true },
  )

  watch(
    () => route?.path,
    (newPath) => {
      if (newPath?.includes('support-chat') && isSupporter.value) {
        fetchUnreadCount()
      }
    },
  )

  onMounted(() => {
    if (isSupporter.value && token.value) {
      fetchUnreadCount()
      setupSocket()
    }
  })

  onUnmounted(() => {
    disconnectSocket()
  })

  return {
    unreadCount,
    isSupporter,
    fetchUnreadCount,
    setupSocket,
    disconnectSocket,
  }
}

