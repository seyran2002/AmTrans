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
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],
  i18n: {
    baseUrl: 'https://amtrans.am',
    defaultLocale: 'hy',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    locales: [
      { code: 'hy', language: 'hy-AM' },
      { code: 'en', language: 'en-US' },
      { code: 'ru', language: 'ru-RU' },
    ],
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'AmTrans' },
      ],
    },
  },

  hooks: {
    'imports:extend'(imports) {
      for (const item of imports) {
        if (item.name === 'useI18n') {
          item.from = '~/composables/useI18n'
        }
      }
    },
  },
  routeRules: {
    '/admin/support-chat': { redirect: '/dashboard/support-chat' },
    '/hy': { redirect: { to: '/', statusCode: 301 } },
    '/hy/**': { redirect: { to: '/**', statusCode: 301 } },
  },
  devServer: {
    port: 5173,
  },
})
