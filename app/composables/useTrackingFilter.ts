import { computed, toValue, type MaybeRefOrGetter, type ComputedRef } from 'vue'
import type { Order } from '~/types/order'

/**
 * useTrackingFilter
 *
 * Lightweight frontend-only composable that accepts an existing filtered orders list
 * and an existing filter state/query (string, ref, getter, or filter object with trackingNumber/searchQuery).
 *
 * Returns the list filtered by a case-insensitive, trimmed partial match on order.trackingNumber.
 * When query is empty or whitespace, returns the original list without modification.
 */
export function useTrackingFilter(
  orders: MaybeRefOrGetter<Order[]>,
  trackingQuery: MaybeRefOrGetter<string | { trackingNumber?: string; searchQuery?: string } | undefined | null>
): ComputedRef<Order[]> & { filteredOrders: ComputedRef<Order[]> } {
  const filteredOrders = computed<Order[]>(() => {
    const list = toValue(orders) || []
    const rawVal = toValue(trackingQuery)

    let queryStr = ''
    if (typeof rawVal === 'string') {
      queryStr = rawVal
    } else if (rawVal && typeof rawVal === 'object') {
      queryStr = rawVal.trackingNumber ?? rawVal.searchQuery ?? ''
    }

    const q = (queryStr || '').trim().toLowerCase()
    if (!q) {
      return list
    }

    return list.filter((order) => {
      const tracking = order.trackingNumber ? String(order.trackingNumber).trim().toLowerCase() : ''
      return tracking.includes(q)
    })
  })

  const result = filteredOrders as any
  result.filteredOrders = filteredOrders
  return result
}

