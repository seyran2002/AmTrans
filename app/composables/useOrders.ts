import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import type { Order, CreateOrderPayload, UpdateOrderPayload } from '~/types/order'

/**
 * useOrders — Composable for order management.
 *
 * Provides:
 *   - orders         → reactive list of the authenticated user's orders
 *   - isLoading      → loading state for fetch
 *   - isSubmitting   → loading state for create/update
 *   - error          → last error message
 *   - successMessage → last success message
 *   - fetchMyOrders()  → GET /orders/my
 *   - createOrder()    → POST /orders (multipart/form-data)
 *   - updateOrder()    → PATCH /orders/:id (multipart/form-data)
 */
export function useOrders() {
  const { apiFetch, getApiUrl } = useApi()
  const token = useCookie<string | null>('auth_token')

  const orders = ref<Order[]>([])
  const isLoading = ref<boolean>(false)
  const isSubmitting = ref<boolean>(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const clearMessages = () => {
    error.value = null
    successMessage.value = null
  }

  /**
   * Fetch the current user's orders.
   * GET /orders/my
   */
  const fetchMyOrders = async (): Promise<Order[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiFetch<Order[] | { data: Order[] }>('/orders/my', {
        method: 'GET'
      })

      if (Array.isArray(response)) {
        orders.value = response
      } else if (response && Array.isArray((response as any).data)) {
        orders.value = (response as any).data
      } else {
        orders.value = []
      }

      return orders.value
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to load orders.')
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new order.
   * POST /orders using multipart/form-data so the invoice file is handled by Multer.
   *
   * We use native fetch (not apiFetch/$fetch) here because $fetch does not
   * correctly set a multipart Content-Type boundary when given a FormData body.
   */
  const createOrder = async (payload: CreateOrderPayload): Promise<Order | null> => {
    if (isSubmitting.value) return null

    isSubmitting.value = true
    clearMessages()

    try {
      const formData = new FormData()

      formData.append('fromOfficeId', payload.fromOfficeId)
      formData.append('toOfficeId', payload.toOfficeId)

      // Only append receiverId when it is provided (Another receiver mode)
      if (payload.receiverId) {
        formData.append('receiverId', payload.receiverId)
      }

      formData.append('productPrice', String(payload.productPrice))
      if (payload.price !== undefined && payload.price !== null) {
        formData.append('price', String(payload.price))
      }
      formData.append('currency', payload.currency)
      formData.append('marketName', payload.marketName)
      formData.append('productDescription', payload.productDescription)
      formData.append('pieceCount', String(payload.pieceCount))
      formData.append('weight', String(payload.weight))
      formData.append('length', String(payload.length))
      formData.append('width', String(payload.width))
      formData.append('height', String(payload.height))
      if (payload.isNew !== undefined) {
        formData.append('isNew', String(payload.isNew))
      }

      if (payload.comment) {
        formData.append('comment', payload.comment)
      }

      if (payload.invoice instanceof File) {
        formData.append('invoice', payload.invoice)
      }

      const baseUrl = getApiUrl()
      const headers: Record<string, string> = {}
      if (token.value) {
        headers['Authorization'] = `Bearer ${token.value}`
      }

      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers,
        body: formData
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const serverMsg = errBody?.message
        const msg = Array.isArray(serverMsg)
          ? serverMsg.join(', ')
          : (typeof serverMsg === 'string' ? serverMsg : 'Failed to create order.')
        error.value = msg
        return null
      }

      const newOrder: Order = await response.json()

      if (newOrder) {
        orders.value = [newOrder, ...orders.value]
      }

      return newOrder
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to create order.')
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Update an existing order.
   * PATCH /orders/:id using multipart/form-data.
   *
   * PATCH is used because this is a partial update: when REGISTERED, details
   * and invoice can be updated; when in other statuses, only the receiver is updated.
   */
  const updateOrder = async (id: string, payload: UpdateOrderPayload): Promise<Order | null> => {
    if (isSubmitting.value) return null

    isSubmitting.value = true
    clearMessages()

    try {
      const formData = new FormData()

      if (payload.fromOfficeId !== undefined) {
        formData.append('fromOfficeId', payload.fromOfficeId)
      }
      if (payload.toOfficeId !== undefined) {
        formData.append('toOfficeId', payload.toOfficeId)
      }

      // receiverId: if provided pass string; if empty string/null, pass '' to reset receiver
      if (payload.receiverId !== undefined) {
        formData.append('receiverId', payload.receiverId || '')
      }

      if (payload.productPrice !== undefined) {
        formData.append('productPrice', String(payload.productPrice))
      }
      if (payload.price !== undefined && payload.price !== null) {
        formData.append('price', String(payload.price))
      }
      if (payload.currency !== undefined) {
        formData.append('currency', payload.currency)
      }
      if (payload.marketName !== undefined) {
        formData.append('marketName', payload.marketName)
      }
      if (payload.productDescription !== undefined) {
        formData.append('productDescription', payload.productDescription)
      }
      if (payload.pieceCount !== undefined) {
        formData.append('pieceCount', String(payload.pieceCount))
      }
      if (payload.weight !== undefined) {
        formData.append('weight', String(payload.weight))
      }
      if (payload.length !== undefined) {
        formData.append('length', String(payload.length))
      }
      if (payload.width !== undefined) {
        formData.append('width', String(payload.width))
      }
      if (payload.height !== undefined) {
        formData.append('height', String(payload.height))
      }
      if (payload.isNew !== undefined) {
        formData.append('isNew', String(payload.isNew))
      }

      if (payload.comment !== undefined) {
        formData.append('comment', payload.comment || '')
      }

      if (payload.invoice instanceof File) {
        formData.append('invoice', payload.invoice)
      }
      if (payload.tnVedCode !== undefined) {
        formData.append('tnVedCode', payload.tnVedCode || '')
      }
      if (payload.status !== undefined) {
        formData.append('status', payload.status)
      }

      const baseUrl = getApiUrl()
      const headers: Record<string, string> = {}
      if (token.value) {
        headers['Authorization'] = `Bearer ${token.value}`
      }

      const response = await fetch(`${baseUrl}/orders/${id}`, {
        method: 'PATCH',
        headers,
        body: formData
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const serverMsg = errBody?.message
        const msg = Array.isArray(serverMsg)
          ? serverMsg.join(', ')
          : (typeof serverMsg === 'string' ? serverMsg : 'Failed to update order.')
        error.value = msg
        return null
      }

      const updatedOrder: Order = await response.json()

      if (updatedOrder) {
        orders.value = orders.value.map(o => (o.id === id ? updatedOrder : o))
      }

      return updatedOrder
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to update order.')
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    orders,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    clearMessages,
    fetchMyOrders,
    createOrder,
    updateOrder
  }
}

