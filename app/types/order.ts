import type { Receiver } from "./receiver"

export type OrderCurrency = 'USD' | 'EUR' | 'AED' | 'RUB' | 'AMD'

export type OrderStatus =
  | 'UNDER_REVIEW'
  | 'PENDING_ESTIMATE'
  | 'REGISTERED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'FOREIGN_WAREHOUSE'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'READY'
  | 'DELIVERED'

export type FilterStatus = OrderStatus | 'ALL'

export const ORDER_STATUSES: OrderStatus[] = [
  'UNDER_REVIEW',
  'PENDING_ESTIMATE',
  'REGISTERED',
  'CANCELLED',
  'REJECTED',
  'FOREIGN_WAREHOUSE',
  'IN_TRANSIT',
  'ARRIVED',
  'READY',
  'DELIVERED'
]

export interface OrderOffice {
  id: string
  city: string
  province: string
  fullAddress: string
  phone: string
  postalCode?: string
  country?: {
    id: string
    enName: string
    hyName: string
    ruName: string
  }
}

export interface OrderUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  code?: string
  companyName?: string
  taxpayerId?: string
  documentNumber?: string
  hyDocumentType?: string
  enDocumentType?: string
  ruDocumentType?: string
  isIndividual?: boolean
  role?: string
  address?: string
  receivers?: Receiver[]
}

export interface Order {
  id: string
  fromOfficeId?: string
  toOfficeId?: string
  userId?: string | null
  receiverId?: string | null
  status: OrderStatus
  price?: number
  totalPrice?: number | null
  tariffRateAtBooking?: number | null
  billableWeight?: number | null
  estimatedPrice?: number | null
  estimatedById?: string | null
  estimatedAt?: string | null
  estimatedBy?: {
    id: string
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  } | null
  productPrice: number
  currency: OrderCurrency
  marketName: string
  productDescription: string
  pieceCount: number
  weight: number
  length: number
  width: number
  height: number
  invoiceUrl?: string | null
  qrCode?: string | null
  comment?: string | null
  tnVedCode?: string | null
  isNew?: boolean
  createdAt: string
  updatedAt?: string
  fromOffice?: OrderOffice
  toOffice?: OrderOffice
  receiver?: Receiver | null
  user?: OrderUser
  trackingNumber?: string
}

/** Payload submitted to POST /orders/:id/estimate */
export interface SubmitEstimatePayload {
  estimatedPrice: number
  price?: number
}

/** Payload submitted to POST /orders as multipart/form-data */
export interface CreateOrderPayload {
  fromOfficeId: string
  toOfficeId: string
  receiverId?: string | null
  productPrice: number
  price?: number
  currency: OrderCurrency
  marketName: string
  productDescription: string
  pieceCount: number
  comment?: string
  weight: number
  length: number
  width: number
  height: number
  isNew?: boolean
  invoice?: File | null
}

/** Payload submitted to PATCH /orders/:id as multipart/form-data */
export interface UpdateOrderPayload {
  fromOfficeId?: string
  toOfficeId?: string
  receiverId?: string | null
  price?: number
  productPrice?: number
  currency?: OrderCurrency
  marketName?: string
  productDescription?: string
  pieceCount?: number
  comment?: string | null
  weight?: number
  length?: number
  width?: number
  height?: number
  isNew?: boolean
  invoice?: File | null
  tnVedCode?: string | null
  status?: OrderStatus
}

