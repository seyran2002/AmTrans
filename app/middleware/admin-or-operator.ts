import { useAuth } from '~/composables/useAuth'

/**
 * Route Middleware: admin-or-operator
 * Restricts access to users with ADMIN or OPERATOR role.
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
  const isSupporter = Boolean(user.value?.isSupporter)
  // Check if role is ADMIN, OPERATOR, or user is a designated SUPPORTER
  if (role !== 'ADMIN' && role !== 'OPERATOR' && !isSupporter) {
    const routeName = String(_to.name || '')
    if (routeName.includes('dashboard-office')) {
      return navigateTo(localePath('/dashboard/addresses'))
    } else if (routeName.includes('dashboard-manage-orders')) {
      return navigateTo(localePath('/dashboard/orders'))
    }
    return navigateTo(localePath('/dashboard'))
  }
})