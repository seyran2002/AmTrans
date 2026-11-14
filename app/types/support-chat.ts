export interface SupportMessage {
  id: string
  chatId: string
  senderType: 'CUSTOMER' | 'SUPPORTER'
  senderId: string
  text: string
  isRead: boolean
  createdAt: string
  customerId?: string
}

export interface MessagesResponse {
  messages: SupportMessage[]
  hasMore: boolean
  nextCursor: string | null
}

export interface SupportChat {
  id: string
  userId: string
  status: 'OPEN' | 'RESOLVED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface ChatCustomer {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  code?: string | null
  phoneNumber?: string | null
}

export interface AdminSupportChat extends SupportChat {
  user?: ChatCustomer
  messages?: SupportMessage[]
  unreadCount?: number
  lastMessage?: SupportMessage | null
}
