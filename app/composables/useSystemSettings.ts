import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'

export interface SystemSettings {
  id: string
  volumetricDivisor: number
}

export interface UpdateSystemSettingsPayload {
  volumetricDivisor: number
}

// In-flight promise tracker to deduplicate simultaneous calls across components
let inFlightPromise: Promise<SystemSettings | null> | null = null

export function useSystemSettings() {
  const { apiFetch } = useApi()

  // Shared global state across all components and pages (SSR-safe)
  const settings = useState<SystemSettings | null>('system_settings', () => null)
  const isLoading = useState<boolean>('system_settings_loading', () => false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const volumetricDivisor = computed<number>(() => {
    const div = Number(settings.value?.volumetricDivisor)
    return div > 0 ? div : 5000
  })

  const clearMessages = () => {
    error.value = null
    successMessage.value = null
  }

  /**
   * fetchSettings — fetches system settings once and shares the result.
   * If settings are already loaded (and force !== true), returns the cached settings immediately.
   * If a fetch is already in progress, concurrent callers wait on the same in-flight request.
   */
  const fetchSettings = async (force = false): Promise<SystemSettings | null> => {
    if (!force && settings.value) {
      return settings.value
    }

    if (inFlightPromise) {
      return inFlightPromise
    }

    isLoading.value = true
    clearMessages()

    inFlightPromise = (async () => {
      try {
        const data = await apiFetch<SystemSettings>('/admin/settings', { method: 'GET' })
        settings.value = data
        return data
      } catch (err: unknown) {
        const e = err as { data?: { message?: string | string[] }; message?: string }
        const msg = e?.data?.message || e?.message || 'Failed to load settings.'
        error.value = Array.isArray(msg) ? (msg as string[]).join(', ') : String(msg)
        return null
      } finally {
        isLoading.value = false
        inFlightPromise = null
      }
    })()

    return inFlightPromise
  }

  /**
   * saveSettings — updates system settings and syncs the shared state.
   * All components reading `settings` or `volumetricDivisor` will automatically update.
   */
  const saveSettings = async (payload: UpdateSystemSettingsPayload): Promise<boolean> => {
    if (isSaving.value) return false
    isSaving.value = true
    clearMessages()
    try {
      const data = await apiFetch<SystemSettings>('/admin/settings', {
        method: 'PATCH',
        body: payload
      })
      settings.value = data
      return true
    } catch (err: unknown) {
      const e = err as { data?: { message?: string | string[] }; message?: string }
      const msg = e?.data?.message || e?.message || 'Failed to save settings.'
      error.value = Array.isArray(msg) ? msg.join(', ') : String(msg)
      return false
    } finally {
      isSaving.value = false
    }
  }

  return {
    settings,
    volumetricDivisor,
    isLoading,
    isSaving,
    error,
    successMessage,
    clearMessages,
    fetchSettings,
    saveSettings
  }
}
