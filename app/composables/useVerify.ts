import { ref } from 'vue'

export interface VerifyUserResponse {
  id: string
  email: string
  firstName?: string
  lastName?: string
  isIndividual?: boolean
  hyDocumentType?: string
  enDocumentType?: string
  ruDocumentType?: string
  documentNumber?: string
  companyName?: string
  taxpayerId?: string
  address?: string
  phoneNumber?: string
  telegramChatId?: string
  code?: string
  role?: string
  status?: string
}

export interface UpdateProfilePayload {
  isIndividual: boolean
  firstName?: string
  lastName?: string
  address: string
  phoneNumber: string
  hyDocumentType?: string
  enDocumentType?: string
  ruDocumentType?: string
  documentNumber?: string
  companyName?: string
  taxpayerId?: string
}

export function useVerify() {
  const config = useRuntimeConfig()
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  const getApiUrl = (): string => {
    let url = (config.public && config.public.apiUrl) || 'http://127.0.0.1:3000'
    return url.endsWith('/') ? url.slice(0, -1) : url
  }

  const verifyUser = async (email: string, code: string): Promise<VerifyUserResponse | null> => {
    isLoading.value = true
    error.value = null

    try {
      const baseUrl = getApiUrl()
      const response = await $fetch<VerifyUserResponse>('/auth/verify', {
        baseURL: baseUrl,
        method: 'GET',
        query: { email, code }
      })
      return response
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg) ? serverMsg.join(', ') : (serverMsg || 'Verification failed.')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (userId: string, payload: UpdateProfilePayload): Promise<VerifyUserResponse | null> => {
    isSubmitting.value = true
    error.value = null

    try {
      const baseUrl = getApiUrl()
      const response = await $fetch<VerifyUserResponse>(`/users/${userId}/profile`, {
        baseURL: baseUrl,
        method: 'PUT',
        body: payload
      })
      return response
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg) ? serverMsg.join(', ') : (serverMsg || 'Failed to update profile.')
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  const checkTelegramStatus = async (userId: string): Promise<{ connected: boolean; telegramChatId?: string } | null> => {
    try {
      const baseUrl = getApiUrl()
      const response = await $fetch<{ connected: boolean; telegramChatId?: string }>(`/telegram/status/${userId}`, {
        baseURL: baseUrl,
        method: 'GET'
      })
      return response
    } catch (err) {
      return null
    }
  }

  return {
    isLoading,
    isSubmitting,
    error,
    verifyUser,
    updateProfile,
    checkTelegramStatus
  }
}