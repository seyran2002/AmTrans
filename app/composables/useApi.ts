/**
 * useApi — Centralized authenticated API request utility.
 *
 * Automatically attaches `Authorization: Bearer <JWT>` to every request
 * when a token cookie is present. Use this for all authenticated API calls
 * to avoid scattering auth header logic across composables/pages.
 *
 * Usage:
 *   const { apiFetch } = useApi()
 *   const data = await apiFetch<MyType>('/protected/endpoint')
 *   const data = await apiFetch<MyType>('/protected/endpoint', { method: 'POST', body: payload })
 */
export interface ApiFetchOptions extends Omit<NonNullable<Parameters<typeof $fetch>[1]>, 'headers'> {
  headers?: Record<string, string>
  skipAuth?: boolean
}

export function useApi() {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')

  const getApiUrl = (): string => {
    const url = config.public.apiUrl || 'http://127.0.0.1:3000'
    return url.endsWith('/') ? url.slice(0, -1) : url
  }

  const apiFetch = <T>(path: string, options: ApiFetchOptions = {}): Promise<T> => {
    const { skipAuth, headers, ...restOptions } = options
    const extraHeaders: Record<string, string> = {
      ...(headers || {})
    }

    if (token.value && !skipAuth) {
      extraHeaders['Authorization'] = `Bearer ${token.value}`
    }

    return $fetch<T>(path, {
      ...restOptions,
      baseURL: getApiUrl(),
      headers: extraHeaders
    })
  }

  return { apiFetch, getApiUrl }
}
