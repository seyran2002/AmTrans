import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { io, type Socket } from 'socket.io-client'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useSupportChatService } from '~/services/support-chat.service'
import { useAudioNotification } from '~/composables/useAudioNotification'

/**
 * useSupporterChatNotification
 *
 * Manages the supporter unread-message badge, socket connection, and audio alerts.
 *
 * Key design decisions:
 *   1. ALL Nuxt composable calls (`useRoute`, `useAuth`, `useApi`, `useCookie`,
 *      `useState`) live at the synchronous top of this function — never inside
 *      callbacks, timers, or socket listeners — to satisfy NUXT_E1001.
 *   2. Socket.IO connection + event binding happens only on the client
 *      (`import.meta.client` guard) and is torn down in `onUnmounted`.
 *   3. The module-level `socket` variable is replaced by an instance-scoped one
 *      so two layout instances can't share / leak a stale reference.
 *   4. `socket.off(event)` is called before every `socket.on(event)` to prevent
 *      duplicate listeners when `setupSocket` runs more than once.
 *   5. After every `new_customer_message` event the accurate count is re-fetched
 *      from the server so multi-device / multi-operator counts stay in sync.
 */
export function useSupporterChatNotification() {
  // ── Nuxt composable calls — synchronous top-level ONLY ─────────────────
  const route = useRoute()
  const { user } = useAuth()
  const { getApiUrl } = useApi()
  const token = useCookie<string | null>('auth_token')
  const chatService = useSupportChatService()
  const { playNotification } = useAudioNotification()

  const unreadCount = useState<number>('supporter_unread_chat_count', () => 0)
  const isSupporter = computed(() => Boolean(user.value?.isSupporter))

  // ── Instance-scoped socket reference ──────────────────────────────────
  let socket: Socket | null = null

  // ── Helpers ───────────────────────────────────────────────────────────
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

  /** Handler kept as a named reference so we can `.off()` it reliably. */
  function handleNewCustomerMessage() {
    playNotification()
    // Re-fetch the real server count instead of blind `++` to stay in sync
    fetchUnreadCount()
  }

  function handleMessagesRead() {
    fetchUnreadCount()
  }

  function handleSupporterReplied() {
    fetchUnreadCount()
  }

  // ── Socket lifecycle ──────────────────────────────────────────────────
  function setupSocket() {
    // Client-only
    if (!import.meta.client) return
    if (!isSupporter.value || !token.value) return

    // Already connected — nothing to do
    if (socket?.connected) return

    // If a stale disconnected socket exists, clean it up first
    if (socket) {
      socket.removeAllListeners()
      socket.disconnect()
      socket = null
    }

    const apiUrl = getApiUrl() || 'http://localhost:3000'
    const socketUrl = `${apiUrl}/support-chat`

    socket = io(socketUrl, {
      auth: { token: token.value || '' },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    // Guard against duplicate listeners: off → on
    socket.off('new_customer_message', handleNewCustomerMessage)
    socket.on('new_customer_message', handleNewCustomerMessage)

    socket.off('messages_read', handleMessagesRead)
    socket.on('messages_read', handleMessagesRead)

    socket.off('supporter_replied', handleSupporterReplied)
    socket.on('supporter_replied', handleSupporterReplied)
  }

  function disconnectSocket() {
    if (socket) {
      socket.off('new_customer_message', handleNewCustomerMessage)
      socket.off('messages_read', handleMessagesRead)
      socket.off('supporter_replied', handleSupporterReplied)
      socket.disconnect()
      socket = null
    }
  }

  // ── Reactive watchers ─────────────────────────────────────────────────
  watch(
    () => [user.value, token.value],
    async ([newUser, newToken]) => {
      if ((newUser as any)?.isSupporter && newToken) {
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

  // ── Lifecycle hooks ───────────────────────────────────────────────────
  onMounted(() => {
    if (isSupporter.value && token.value) {
      fetchUnreadCount()
      setupSocket()
    }
  })

  onUnmounted(() => {
    disconnectSocket()
  })

  // ── Public API ────────────────────────────────────────────────────────
  return {
    unreadCount,
    isSupporter,
    fetchUnreadCount,
    setupSocket,
    disconnectSocket,
  }
}
