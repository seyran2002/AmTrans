import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import type { Tariff, CreateTariffPayload, UpdateTariffPayload } from '~/types/tariff'

interface ApiErrorResponse {
  data?: { message?: string | string[] }
  response?: { _data?: { message?: string | string[] } }
  message?: string
}

function extractErrorMessage(err: unknown, fallback: string): string {
  const e = err as ApiErrorResponse
  const serverMsg = e?.data?.message || e?.response?._data?.message || e?.message
  if (Array.isArray(serverMsg)) {
    return serverMsg.join(', ')
  }
  if (typeof serverMsg === 'string') {
    return serverMsg
  }
  return fallback
}

export function useTariffs() {
  const { apiFetch } = useApi()

  const tariffs = ref<Tariff[]>([])
  const routeTariff = ref<Tariff | null>(null)
  const isRouteTariffLoading = ref<boolean>(false)
  const routeTariffError = ref<string | null>(null)
  const isRouteTariffMissing = ref<boolean>(false)

  const isLoading = ref<boolean>(false)
  const isSubmitting = ref<boolean>(false)
  const isDeleting = ref<boolean>(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const clearMessages = () => {
    error.value = null
    successMessage.value = null
  }

  const clearRouteTariff = () => {
    routeTariff.value = null
    routeTariffError.value = null
    isRouteTariffMissing.value = false
  }

  /**
   * Fetch all tariffs.
   * GET /tariffs
   */
  const fetchTariffs = async (): Promise<Tariff[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiFetch<Tariff[] | { data?: Tariff[]; tariffs?: Tariff[] }>('/tariffs', {
        method: 'GET'
      })

      let fetchedData: Tariff[] = []
      if (Array.isArray(response)) {
        fetchedData = response
      } else if (response && Array.isArray(response.data)) {
        fetchedData = response.data
      } else if (response && Array.isArray(response.tariffs)) {
        fetchedData = response.tariffs
      }

      tariffs.value = fetchedData
      return tariffs.value
    } catch (err: unknown) {
      error.value = extractErrorMessage(err, 'Failed to fetch tariffs.')
      tariffs.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new tariff.
   * POST /tariffs
   */
  const createTariff = async (payload: CreateTariffPayload): Promise<Tariff | null> => {
    if (isSubmitting.value) return null

    isSubmitting.value = true
    clearMessages()

    try {
      const newTariff = await apiFetch<Tariff>('/tariffs', {
        method: 'POST',
        body: payload
      })

      await fetchTariffs()
      return newTariff
    } catch (err: unknown) {
      error.value = extractErrorMessage(err, 'Failed to create tariff.')
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Update an existing tariff using PATCH.
   * Sends only changed fields.
   * PATCH /tariffs/:id
   */
  const updateTariff = async (id: string, payload: UpdateTariffPayload): Promise<Tariff | null> => {
    if (isSubmitting.value) return null

    isSubmitting.value = true
    clearMessages()

    try {
      const updated = await apiFetch<Tariff>(`/tariffs/${id}`, {
        method: 'PATCH',
        body: payload
      })

      await fetchTariffs()
      return updated
    } catch (err: unknown) {
      error.value = extractErrorMessage(err, 'Failed to update tariff.')
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Delete a tariff.
   * DELETE /tariffs/:id
   */
  const deleteTariff = async (id: string): Promise<boolean> => {
    if (isDeleting.value) return false

    isDeleting.value = true
    clearMessages()

    try {
      await apiFetch(`/tariffs/${id}`, {
        method: 'DELETE'
      })

      await fetchTariffs()
      return true
    } catch (err: unknown) {
      error.value = extractErrorMessage(err, 'Failed to delete tariff.')
      return false
    } finally {
      isDeleting.value = false
    }
  }

  /**
   * Fetch tariff for a specific route.
   * GET /tariffs/by-route?fromOfficeId=${fromOfficeId}&toOfficeId=${toOfficeId}
   */
  const fetchTariffByRoute = async (fromOfficeId: string, toOfficeId: string): Promise<Tariff | null> => {
    clearRouteTariff()

    if (!fromOfficeId || !toOfficeId) {
      return null
    }

    isRouteTariffLoading.value = true

    try {
      const response = await apiFetch<Tariff | { data?: Tariff }>(
        `/tariffs/by-route?fromOfficeId=${encodeURIComponent(fromOfficeId)}&toOfficeId=${encodeURIComponent(toOfficeId)}`,
        {
          method: 'GET'
        }
      )

      let fetched: Tariff | null = null
      if (response && typeof response === 'object') {
        if ('data' in response && response.data && typeof response.data === 'object') {
          fetched = response.data as Tariff
        } else if ('pricePerKg' in response || 'id' in response) {
          fetched = response as Tariff
        }
      }

      if (fetched && (fetched.pricePerKg !== undefined && fetched.pricePerKg !== null)) {
        routeTariff.value = fetched
        return fetched
      } else {
        isRouteTariffMissing.value = true
        return null
      }
    } catch (err: unknown) {
      const e = err as { status?: number; statusCode?: number; response?: { status?: number } }
      const status = e?.status || e?.statusCode || e?.response?.status
      const msg = extractErrorMessage(err, '')
      if (status === 404 || msg.toLowerCase().includes('not found')) {
        isRouteTariffMissing.value = true
        routeTariffError.value = null
      } else {
        routeTariffError.value = msg || 'Failed to fetch tariff.'
      }
      return null
    } finally {
      isRouteTariffLoading.value = false
    }
  }

  return {
    tariffs,
    routeTariff,
    isRouteTariffLoading,
    routeTariffError,
    isRouteTariffMissing,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    successMessage,
    clearMessages,
    clearRouteTariff,
    fetchTariffByRoute,
    fetchTariffs,
    createTariff,
    updateTariff,
    deleteTariff
  }
}
