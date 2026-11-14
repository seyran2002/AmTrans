import { useApi } from '~/composables/useApi'
import type { Order, SubmitEstimatePayload, OrderStatus } from '~/types/order'

/**
 * Orders Service
 * Dedicated service for operator order management and tariff estimate workflows.
 */
export const ordersService = {
  /**
   * Submits a proposed shipping price estimate for a PENDING_ESTIMATE order.
   * POST /orders/:id/estimate
   */
  async submitEstimate(orderId: string, payload: SubmitEstimatePayload): Promise<Order> {
    const { apiFetch } = useApi()

    return await apiFetch<Order>(`/orders/${orderId}/estimate`, {
      method: 'POST',
      body: payload
    })
  },

  /**
   * Alternative PATCH method for estimate submission.
   * PATCH /orders/:id/estimate
   */
  async patchEstimate(orderId: string, payload: SubmitEstimatePayload): Promise<Order> {
    const { apiFetch } = useApi()

    return await apiFetch<Order>(`/orders/${orderId}/estimate`, {
      method: 'PATCH',
      body: payload
    })
  },

  /**
   * Fetches a single order by its ID.
   * GET /orders/:id
   */
  async getOrder(orderId: string): Promise<Order> {
    const { apiFetch } = useApi()

    return await apiFetch<Order>(`/orders/${orderId}`, {
      method: 'GET'
    })
  },

  /**
   * Updates an order's status.
   * PATCH /orders/:id/status
   */
  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const { apiFetch } = useApi()

    return await apiFetch<Order>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status }
    })
  },

  /**
   * Customer accepts the proposed shipping price estimate.
   * POST /orders/:id/estimate/accept
   */
  async acceptEstimate(orderId: string): Promise<Order> {
    const { apiFetch } = useApi()

    return await apiFetch<Order>(`/orders/${orderId}/estimate/accept`, {
      method: 'POST'
    })
  },

  /**
   * Customer cancels/rejects the proposed shipping price estimate.
   * POST /orders/:id/estimate/cancel
   */
  async cancelEstimate(orderId: string): Promise<Order> {
    const { apiFetch } = useApi()

    return await apiFetch<Order>(`/orders/${orderId}/estimate/cancel`, {
      method: 'POST'
    })
  }
}

