import { useApi } from '~/composables/useApi'
import type { SupportChat, MessagesResponse, AdminSupportChat } from '~/types/support-chat'

/**
 * Support Chat Service
 * Dedicated service for customer and admin support chat REST API endpoints.
 */
export const supportChatService = {
  /**
   * Customer: Fetch the active chat session for current user
   */
  async getActiveChat(): Promise<SupportChat> {
    const { apiFetch } = useApi()
    return await apiFetch<SupportChat>('/support-chat/active-chat', {
      method: 'GET',
    })
  },

  /**
   * Fetch paginated messages for a chat
   */
  async getMessages(
    chatId: string,
    cursor?: string | null,
    limit = 15,
  ): Promise<MessagesResponse> {
    const { apiFetch } = useApi()

    const query = new URLSearchParams()
    query.set('chatId', chatId)
    query.set('limit', String(limit))
    if (cursor) {
      query.set('cursor', cursor)
    }

    return await apiFetch<MessagesResponse>(
      `/support-chat/messages?${query.toString()}`,
      {
        method: 'GET',
      },
    )
  },

  /**
   * Admin: Fetch all active/open customer support chats
   */
  async getAdminChats(): Promise<AdminSupportChat[]> {
    const { apiFetch } = useApi()
    return await apiFetch<AdminSupportChat[]>('/support-chat/admin/chats', {
      method: 'GET',
    })
  },

  /**
   * Admin: Fetch paginated messages for a selected chat
   */
  async getAdminMessages(
    chatId: string,
    cursor?: string | null,
    limit = 15,
  ): Promise<MessagesResponse> {
    return this.getMessages(chatId, cursor, limit)
  },

  /**
   * Mark all unread messages as read for a given chat
   */
  async markMessagesAsRead(
    chatId: string,
  ): Promise<{ success: boolean; count: number }> {
    const { apiFetch } = useApi()
    return await apiFetch<{ success: boolean; count: number }>(
      '/support-chat/messages/read',
      {
        method: 'PATCH',
        body: { chatId },
      },
    )
  },

  /**
   * Admin: Fetch total unread customer messages count across all chats
   */
  async getTotalUnreadCount(): Promise<number> {
    try {
      const chats = await this.getAdminChats()
      return (chats || []).reduce(
        (acc, chat) => acc + (chat.unreadCount || 0),
        0,
      )
    } catch {
      return 0
    }
  },

  /**
   * Delete a single message by ID
   */
  async deleteMessage(messageId: string): Promise<void> {
    const { apiFetch } = useApi()
    return await apiFetch<void>(`/support-chat/messages/${messageId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Delete an entire chat session by ID
   */
  async deleteChat(chatId: string): Promise<void> {
    const { apiFetch } = useApi()
    return await apiFetch<void>(`/support-chat/${chatId}`, {
      method: 'DELETE',
    })
  },
}

/**
 * Composable wrapper for Support Chat Service
 */
export function useSupportChatService() {
  return supportChatService
}
