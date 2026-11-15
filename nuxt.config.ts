// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiUrl: process.env.BASE_URL,
      telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME,
    },
  },
  css: ['~/assets/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
  routeRules: {
    '/admin/support-chat': { redirect: '/dashboard/support-chat' },
  },
  devServer: {
    port: 5173,
  },
})
