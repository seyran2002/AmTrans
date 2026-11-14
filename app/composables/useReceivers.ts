import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import type { Receiver, CreateReceiverPayload, UpdateReceiverPayload } from '~/types/receiver'

export function useReceivers() {
  const { apiFetch } = useApi()

  const receivers = ref<Receiver[]>([])
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
   * Fetch all receivers for the authenticated user.
   * GET /receivers
   */
  const fetchReceivers = async (): Promise<Receiver[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiFetch<Receiver[] | { data: Receiver[]; receivers?: Receiver[] }>('/receivers', {
        method: 'GET'
      })

      if (Array.isArray(response)) {
        receivers.value = response
      } else if (response && Array.isArray(response.data)) {
        receivers.value = response.data
      } else if (response && Array.isArray(response.receivers)) {
        receivers.value = response.receivers
      } else {
        receivers.value = []
      }

      return receivers.value
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to load receivers.')
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new receiver profile.
   * POST /receivers
   */
  const createReceiver = async (payload: CreateReceiverPayload): Promise<Receiver | null> => {
    if (isSubmitting.value) return null

    isSubmitting.value = true
    clearMessages()

    try {
      const newReceiver = await apiFetch<Receiver>('/receivers', {
        method: 'POST',
        body: payload
      })

      if (newReceiver) {
        // Add to local list or refresh
        receivers.value = [newReceiver, ...receivers.value]
      }
      return newReceiver
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to create receiver.')
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Update an existing receiver profile.
   * PUT /receivers/:receiverId
   */
  const updateReceiver = async (receiverId: string, payload: UpdateReceiverPayload): Promise<Receiver | null> => {
    if (isSubmitting.value) return null

    isSubmitting.value = true
    clearMessages()

    try {
      const updated = await apiFetch<Receiver>(`/receivers/${receiverId}`, {
        method: 'PUT',
        body: payload
      })

      if (updated) {
        const index = receivers.value.findIndex(r => r.id === receiverId)
        if (index !== -1) {
          receivers.value[index] = { ...receivers.value[index], ...updated }
        } else {
          await fetchReceivers()
        }
      }
      return updated
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to update receiver.')
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Delete a receiver profile.
   * DELETE /receivers/:receiverId
   */
  const deleteReceiver = async (receiverId: string): Promise<boolean> => {
    if (isDeleting.value) return false

    isDeleting.value = true
    clearMessages()

    try {
      await apiFetch(`/receivers/${receiverId}`, {
        method: 'DELETE'
      })

      receivers.value = receivers.value.filter(r => r.id !== receiverId)
      return true
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to delete receiver.')
      return false
    } finally {
      isDeleting.value = false
    }
  }

  return {
    receivers,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    successMessage,
    clearMessages,
    fetchReceivers,
    createReceiver,
    updateReceiver,
    deleteReceiver
  }
}
