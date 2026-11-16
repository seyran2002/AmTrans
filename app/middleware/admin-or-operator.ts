import { useAuth } from '~/composables/useAuth'

/**
 * Route Middleware: admin-or-operator
 * Restricts access to users with ADMIN or OPERATOR role.
 */
export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const { isAuthenticated, checkAuth, token, user } = useAuth()

  // Ensure auth state is hydrated if token cookie exists
  if (!isAuthenticated.value && token.value) {
    await checkAuth()
  }

  // Not authenticated -> redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }

  const role = user.value?.role?.toUpperCase()
  const isSupporter = Boolean(user.value?.isSupporter)
  // Check if role is ADMIN, OPERATOR, or user is a designated SUPPORTER
  if (role !== 'ADMIN' && role !== 'OPERATOR' && !isSupporter) {
    if (_to.name === 'dashboard-office') {
      return navigateTo('/dashboard/addresses')
    } else if(_to.name === 'dashboard-manage-orders') {
      return navigateTo('/dashboard/orders')
    }
    return navigateTo('/dashboard')
  }
})