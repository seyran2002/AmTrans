import { useAuth } from '~/composables/useAuth'

/**
 * Route Middleware: admin
 * Restricts access to users with ADMIN role only.
 */
export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const { isAuthenticated, checkAuth, token, user } = useAuth()

  if (!isAuthenticated.value && token.value) {
    await checkAuth()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }

  if (user.value?.role?.toUpperCase() !== 'ADMIN') {
    return navigateTo('/dashboard')
  }
})
