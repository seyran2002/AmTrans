import { useAuth } from '~/composables/useAuth'

/**
 * Route Middleware: customer
 * Restricts access to users with CUSTOMER role.
 */
export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const { isAuthenticated, checkAuth, token, user } = useAuth()
  const localePath = useLocalePath()

  // Ensure auth state is hydrated if token cookie exists
  if (!isAuthenticated.value && token.value) {
    await checkAuth()
  }

  // Not authenticated -> redirect to login
  if (!isAuthenticated.value) {
    return navigateTo(localePath('/auth/login'))
  }

  const role = user.value?.role?.toUpperCase()
  // Check if role is CUSTOMER
  if (role !== 'CUSTOMER') {
    return navigateTo(localePath('/dashboard'))
  }
})
