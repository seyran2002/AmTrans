/**
 * Auth Middleware — protects routes that require authentication.
 *
 * Usage (in a page):
 *   definePageMeta({ middleware: 'auth' })
 *
 * If the user is authenticated → allow access.
 * If not → redirect to /auth/login.
 */
export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const { isAuthenticated, checkAuth, token } = useAuth()

  // If already authenticated in state, allow through immediately
  if (isAuthenticated.value) return

  // If token exists but user state is empty (e.g., SSR hydration), revalidate
  if (token.value) {
    const valid = await checkAuth()
    if (valid) return
  }

  // Not authenticated → redirect to login
  return navigateTo('/auth/login')
})
