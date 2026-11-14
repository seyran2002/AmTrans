import { useApi } from '~/composables/useApi'
import type { Tariff } from '~/types/tariff'

/**
 * Tariffs Service
 * Dedicated service for fetching and managing shipping tariffs.
 */
export const tariffsService = {
  /**
   * Fetches available shipping tariffs from the backend API.
   * Does NOT require a JWT token (skipAuth: true).
   */
  async getTariffs(): Promise<Tariff[]> {
    const { apiFetch } = useApi()

    const response = await apiFetch<Tariff[] | { data?: Tariff[]; tariffs?: Tariff[] }>('/tariffs', {
      method: 'GET',
      skipAuth: true,
    })

    if (Array.isArray(response)) {
      return response
    }
    if (response && Array.isArray(response.data)) {
      return response.data
    }
    if (response && Array.isArray(response.tariffs)) {
      return response.tariffs
    }
    return []
  },
}
