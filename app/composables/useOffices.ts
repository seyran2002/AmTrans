import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import type { Office, CreateOfficePayload, UpdateOfficePayload, OperatorUser } from '~/types/office'

export function useOffices() {
  const { apiFetch } = useApi()

  const offices = ref<Office[]>([])
  const isLoading = ref<boolean>(false)
  const isSubmitting = ref<boolean>(false)
  const isDeleting = ref<boolean>(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const clearMessages = () => {
    error.value = null
    successMessage.value = null
  }

  /**
   * Fetch all offices.
   * GET /offices
   */
  const fetchOffices = async (): Promise<Office[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiFetch<Office[] | { data: Office[]; offices?: Office[] }>('/offices', {
        method: 'GET'
      })

      let fetchedData: Office[] = []
      if (Array.isArray(response)) {
        fetchedData = response
      } else if (response && Array.isArray((response as any).data)) {
        fetchedData = (response as any).data
      } else if (response && Array.isArray((response as any).offices)) {
        fetchedData = (response as any).offices
      }

      offices.value = fetchedData
      return offices.value
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to fetch offices.')
      offices.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new office.
   * POST /offices
   */
  const createOffice = async (payload: CreateOfficePayload): Promise<Office | null> => {
    if (isSubmitting.value) return null

    isSubmitting.value = true
    clearMessages()

    try {
      const newOffice = await apiFetch<Office>('/offices', {
        method: 'POST',
        body: payload
      })

      await fetchOffices()
      return newOffice
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to create office.')
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Update an existing office.
   * PUT /offices/:id
   */
  const updateOffice = async (id: string, payload: UpdateOfficePayload): Promise<Office | null> => {
    if (isSubmitting.value) return null

    isSubmitting.value = true
    clearMessages()

    try {
      const updated = await apiFetch<Office>(`/offices/${id}`, {
        method: 'PUT',
        body: payload
      })

      await fetchOffices()
      return updated
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to update office.')
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Delete an office.
   * DELETE /offices/:id
   */
  const deleteOffice = async (id: string): Promise<boolean> => {
    if (isDeleting.value) return false

    isDeleting.value = true
    clearMessages()

    try {
      await apiFetch(`/offices/${id}`, {
        method: 'DELETE'
      })

      await fetchOffices()
      return true
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to delete office.')
      return false
    } finally {
      isDeleting.value = false
    }
  }

  /**
   * Fetch available operators (users with role OPERATOR) from GET /users/operators
   */
  const fetchOperators = async (): Promise<OperatorUser[]> => {
    try {
      const response = await apiFetch<OperatorUser[] | { data?: OperatorUser[] }>('/users/operators', {
        method: 'GET'
      })
      if (Array.isArray(response)) return response
      if (response && Array.isArray((response as any).data)) return (response as any).data
      return []
    } catch (err: any) {
      return []
    }
  }

  /**
   * Assign an operator to an office.
   * POST /offices/:officeId/operators/:userId
   * Returns the full updated office or throws with the raw error.
   */
  const assignOperator = async (officeId: string, userId: string): Promise<Office | null> => {
    try {
      const result = await apiFetch<Office>(`/offices/${officeId}/operators/${userId}`, {
        method: 'POST'
      })
      await fetchOffices()
      return result
    } catch (err: any) {
      throw err
    }
  }

  /**
   * Remove an operator from an office.
   * DELETE /offices/:officeId/operators/:userId
   */
  const removeOperator = async (officeId: string, userId: string): Promise<boolean> => {
    try {
      await apiFetch(`/offices/${officeId}/operators/${userId}`, {
        method: 'DELETE'
      })
      await fetchOffices()
      return true
    } catch (err: any) {
      throw err
    }
  }

  return {
    offices,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    successMessage,
    clearMessages,
    fetchOffices,
    createOffice,
    updateOffice,
    deleteOffice,
    fetchOperators,
    assignOperator,
    removeOperator
  }
}
