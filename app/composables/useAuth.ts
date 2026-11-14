import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  role?: string
  status?: string
  officeId?: string | null
  office?: any
  isSupporter: boolean
  [key: string]: any
}

export interface RegisterPayload {
  email: string
  password: string
  language: 'en' | 'ru' | 'hy'
}

export interface RegisterResponse {
  message?: string
  success?: boolean
  [key: string]: any
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user?: User
}

/**
 * useAuth — Centralized authentication composable.
 *
 * Provides:
 *   - user          → reactive current authenticated user (null when logged out)
 *   - isAuthenticated → computed boolean, true only when token + user are both present
 *   - isLoading     → reactive loading flag
 *   - error         → reactive last error message
 *   - login()       → POST /auth/login, store JWT, verify via /auth/me
 *   - logout()      → clear JWT + user state, redirect to /auth/login
 *   - checkAuth()   → verify existing JWT via GET /auth/me (source of truth)
 *   - register()    → POST /auth/register
 *
 * Do NOT decode the JWT to determine auth state.
 * The /auth/me response is always the source of truth.
 */
export function useAuth() {
  const config = useRuntimeConfig()

  // ── JWT stored in a cookie (7-day expiry, SameSite=lax, available on both client + server) ──
  const token = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  // ── Shared global user state across the entire app (useState = SSR-safe) ──
  const user = useState<User | null>('auth_user', () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ── isAuthenticated: true only when BOTH token AND user are present ──
  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  const getApiUrl = (): string => {
    const url = config.public.apiUrl || 'http://127.0.0.1:3000'
    return url.endsWith('/') ? url.slice(0, -1) : url
  }

  // ── Internal helper: build headers with Authorization if token exists ──
  const buildHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
    const headers: Record<string, string> = { ...extra }
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }
    return headers
  }

  /**
   * checkAuth — Calls GET /auth/me to verify the stored JWT.
   *
   * On success: hydrates user state and returns true.
   * On 401/error: clears token + user, redirects to '/', returns false.
   */
  const checkAuth = async (): Promise<boolean> => {
    if (!token.value) {
      user.value = null
      return false
    }

    try {
      const baseUrl = getApiUrl()
      const response = await $fetch<User>('/auth/me', {
        baseURL: baseUrl,
        method: 'GET',
        headers: buildHeaders()
      })

      user.value = response
      return true
    } catch (_err: any) {
      // Token invalid or expired — clear state and let the caller (middleware) handle routing
      token.value = null
      user.value = null
      return false
    }
  }

  /**
   * login — POST /auth/login, then immediately verifies via /auth/me.
   *
   * On success: stores JWT, hydrates user, navigates to '/'.
   * On failure: sets error message, returns false.
   */
  const login = async (payload: LoginPayload): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const baseUrl = getApiUrl()
      const response = await $fetch<LoginResponse>('/auth/login', {
        baseURL: baseUrl,
        method: 'POST',
        body: payload
      })

      if (response?.access_token) {
        // Store JWT in cookie first so checkAuth can attach it
        token.value = response.access_token

        // Verify via /auth/me — backend is source of truth for user data
        const verified = await checkAuth()
        if (verified) {
          await navigateTo('/dashboard')
          return true
        }
      }

      error.value = 'Failed to verify session after login.'
      return false
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      if (Array.isArray(serverMsg)) {
        error.value = serverMsg.join(', ')
      } else if (typeof serverMsg === 'string') {
        error.value = serverMsg
      } else {
        error.value = 'Login failed. Please check your credentials.'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * logout — Clears JWT cookie and user state, then redirects to /auth/login.
   */
  const logout = async () => {
    token.value = null
    user.value = null
    await navigateTo('/auth/login')
  }

  /**
   * register — POST /auth/register.
   *
   * Returns the response object on success, null on failure.
   * Sets error on failure.
   */
  const register = async (payload: RegisterPayload): Promise<RegisterResponse | null> => {
    isLoading.value = true
    error.value = null

    try {
      const baseUrl = getApiUrl()
      const response = await $fetch<RegisterResponse>('/auth/register', {
        baseURL: baseUrl,
        method: 'POST',
        body: payload
      })
      return response
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      if (Array.isArray(serverMsg)) {
        error.value = serverMsg.join(', ')
      } else if (typeof serverMsg === 'string') {
        error.value = serverMsg
      } else {
        error.value = 'Registration failed. Please check your details and try again.'
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    buildHeaders,
    login,
    logout,
    checkAuth,
    register
  }
}
