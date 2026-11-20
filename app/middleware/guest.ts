/**
 * Guest Middleware — prevents already-authenticated users from accessing
 * guest-only pages (login, register).
 *
 * Usage (in a page):
 *   definePageMeta({ middleware: 'guest' })
 *
 * If the user is already authenticated → redirect to '/'.
 * If not authenticated → allow access.
 */
export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const { isAuthenticated, checkAuth, token } = useAuth()
  const localePath = useLocalePath()

  // Already confirmed authenticated in state
  if (isAuthenticated.value) {
    return navigateTo(localePath('/dashboard'))
  }

  // Token exists but state not hydrated yet (SSR / page refresh edge case)
  if (token.value) {
    const valid = await checkAuth()
    if (valid) {
      return navigateTo(localePath('/dashboard'))
    }
  }
})
