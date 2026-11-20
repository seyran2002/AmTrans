export default defineNuxtRouteMiddleware((to) => {
  // If the page explicitly disabled layout (layout: false), respect it
  if (to.meta.layout === false) return

  // Strip locale prefix (/en, /ru) if present
  const pathWithoutLocale = to.path.replace(/^\/(?:en|ru)(?=\/|$)/, '') || '/'

  // All pages in the /dashboard route tree use the dashboard layout
  if (pathWithoutLocale === '/dashboard' || pathWithoutLocale.startsWith('/dashboard/')) {
    to.meta.layout = 'dashboard'
    setPageLayout('dashboard')
  } else {
    // All other pages use the guest layout by default
    to.meta.layout = 'guest'
    setPageLayout('guest')
  }
})
