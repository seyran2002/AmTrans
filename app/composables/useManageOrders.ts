import { ref, reactive, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useTrackingFilter } from '~/composables/useTrackingFilter'
import type { Order, OrderStatus } from '~/types/order'

export interface ManageOrdersFilters {
  userCode: string
  documentType: string
  documentNumber: string
  status: string
  searchQuery: string
  trackingNumber: string
}

/**
 * useManageOrders — Composable for managing office orders (for ADMIN and OPERATOR).
 *
 * Provides:
 *   - orders            → reactive list of fetched orders for current office
 *   - isLoading         → loading flag
 *   - error             → error message if fetch fails
 *   - selectedOfficeId  → currently active office id
 *   - filters           → reactive filter criteria (userCode, documentType, documentNumber, status, searchQuery)
 *   - filteredOrders    → computed orders filtered by criteria
 *   - activeFiltersCount → computed count of applied filters
 *   - fetchOrdersByOffice → GET /orders/by-office/:officeId
 *   - resetFilters      → resets all filter fields
 *   - clearMessages     → clears error messages
 */
export function useManageOrders() {
  const { apiFetch } = useApi()

  const orders = ref<Order[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const selectedOfficeId = ref<string | null>(null)

  const filters = reactive<ManageOrdersFilters>({
    userCode: '',
    documentType: '',
    documentNumber: '',
    status: '',
    searchQuery: '',
    trackingNumber: ''
  })

  const clearMessages = () => {
    error.value = null
  }

  const resetFilters = () => {
    filters.userCode = ''
    filters.documentType = ''
    filters.documentNumber = ''
    filters.status = ''
    filters.searchQuery = ''
    filters.trackingNumber = ''
  }

  /**
   * Fetch orders for a given office ID.
   * GET /orders/by-office/:officeId
   */
  const fetchOrdersByOffice = async (officeId: string): Promise<Order[]> => {
    if (!officeId || !officeId.trim()) {
      orders.value = []
      return []
    }

    isLoading.value = true
    error.value = null
    selectedOfficeId.value = officeId

    try {
      const response = await apiFetch<Order[] | { data: Order[] }>(
        `/orders/by-office/${encodeURIComponent(officeId.trim())}`,
        { method: 'GET' }
      )

      let fetched: Order[] = []
      if (Array.isArray(response)) {
        fetched = response
      } else if (response && Array.isArray((response as any).data)) {
        fetched = (response as any).data
      }

      orders.value = fetched
      return orders.value
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to fetch office orders.')
      orders.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Helper to normalize document type matching across languages
   */
  const matchesDocumentType = (order: Order, typeFilter: string): boolean => {
    if (!typeFilter) return true
    const u = order.user
    if (!u) return false

    const filter = typeFilter.toLowerCase()

    // Key-based check (Passport, IdCard, Biometric)
    if (filter === 'passport') {
      const texts = [u.enDocumentType, u.hyDocumentType, u.ruDocumentType].filter(Boolean).join(' ').toLowerCase()
      return texts.includes('passport') || texts.includes('անձնագիր') || texts.includes('паспорт')
    }
    if (filter === 'idcard') {
      const texts = [u.enDocumentType, u.hyDocumentType, u.ruDocumentType].filter(Boolean).join(' ').toLowerCase()
      return texts.includes('id card') || texts.includes('նույնականացման') || texts.includes('идентификационная')
    }
    if (filter === 'biometric') {
      const texts = [u.enDocumentType, u.hyDocumentType, u.ruDocumentType].filter(Boolean).join(' ').toLowerCase()
      return texts.includes('biometric') || texts.includes('կենսաչափական') || texts.includes('биометрический')
    }

    // Direct substring search across localized fields
    const docFields = [u.enDocumentType, u.hyDocumentType, u.ruDocumentType].filter(Boolean).map(s => s!.toLowerCase())
    return docFields.some(field => field.includes(filter))
  }

  /**
   * Computed filtered orders based on user criteria
   */
  const baseFilteredOrders = computed<Order[]>(() => {
    return orders.value.filter((order) => {
      // 1. Filter by user code (identifier code)
      if (filters.userCode.trim()) {
        const query = filters.userCode.trim().toLowerCase()
        const userCode = order.user?.code?.toLowerCase() || ''
        if (!userCode.includes(query)) {
          return false
        }
      }

      // 2. Filter by document type
      if (filters.documentType) {
        if (!matchesDocumentType(order, filters.documentType)) {
          return false
        }
      }

      // 3. Filter by document number (or taxpayer ID for legal entities)
      if (filters.documentNumber.trim()) {
        const query = filters.documentNumber.trim().toLowerCase()
        const docNum = order.user?.documentNumber?.toLowerCase() || ''
        const taxId = order.user?.taxpayerId?.toLowerCase() || ''
        if (!docNum.includes(query) && !taxId.includes(query)) {
          return false
        }
      }

      // 4. Filter by order status
      if (filters.status) {
        if (order.status !== filters.status) {
          return false
        }
      }

      // 5. General search query (order ID, tracking number, market, product, user name, phone, receiver name, etc.)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.trim().toLowerCase()
        const orderId = order.id.toLowerCase()
        const tracking = (order.trackingNumber || '').toLowerCase()
        const market = (order.marketName || '').toLowerCase()
        const desc = (order.productDescription || '').toLowerCase()
        const userEmail = (order.user?.email || '').toLowerCase()
        const userName = `${order.user?.firstName || ''} ${order.user?.lastName || ''} ${order.user?.companyName || ''}`.toLowerCase()
        const userPhone = (order.user?.phoneNumber || '').toLowerCase()
        const receiverName = `${order.receiver?.firstName || ''} ${order.receiver?.lastName || ''}`.toLowerCase()
        const receiverPhone = (order.receiver?.phoneNumber || '').toLowerCase()

        const matchesSearch =
          orderId.includes(q) ||
          tracking.includes(q) ||
          market.includes(q) ||
          desc.includes(q) ||
          userEmail.includes(q) ||
          userName.includes(q) ||
          userPhone.includes(q) ||
          receiverName.includes(q) ||
          receiverPhone.includes(q)

        if (!matchesSearch) {
          return false
        }
      }

      return true
    })
  })

  // Hook useTrackingFilter into the filter chain so trackingNumber works simultaneously alongside all current filters
  const filteredOrders = useTrackingFilter(baseFilteredOrders, () => filters.trackingNumber)

  /**
   * Count of active filters currently applied
   */
  const activeFiltersCount = computed<number>(() => {
    let count = 0
    if (filters.userCode.trim()) count++
    if (filters.documentType) count++
    if (filters.documentNumber.trim()) count++
    if (filters.status) count++
    if (filters.searchQuery.trim()) count++
    if (filters.trackingNumber?.trim()) count++
    return count
  })

  const currentOrder = ref<Order | null>(null)

  /**
   * Fetch single order details by ID.
   * GET /orders/:id
   */
  const fetchOrderById = async (id: string): Promise<Order | null> => {
    if (!id || !id.trim()) {
      error.value = 'Order ID is required'
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await apiFetch<Order>(`/orders/${encodeURIComponent(id.trim())}`, {
        method: 'GET'
      })

      currentOrder.value = response
      return response
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to fetch order details.')
      currentOrder.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    orders,
    currentOrder,
    isLoading,
    error,
    selectedOfficeId,
    filters,
    filteredOrders,
    activeFiltersCount,
    fetchOrdersByOffice,
    fetchOrderById,
    resetFilters,
    clearMessages
  }
}
