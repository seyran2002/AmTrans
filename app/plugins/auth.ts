/**
 * Auth Initialization Plugin
 *
 * Runs on every app startup (client + server).
 * If a JWT cookie exists, calls /auth/me to verify it and hydrate user state.
 * If /auth/me returns 401, the token & user state are cleared automatically
 * inside checkAuth() and the user is redirected to '/'.
 */
export default defineNuxtPlugin(async () => {
  const { checkAuth, token } = useAuth()

  // Only call checkAuth if a token actually exists – avoids unnecessary network request
  if (token.value) {
    await checkAuth()
  }
})
