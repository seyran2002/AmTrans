<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'

const { isAuthenticated } = useAuth()
const { t } = useI18n()
</script>

<template>
  <section
    id="our-commitment"
    class="w-full bg-gradient-to-br from-primary via-[#1c3260] to-primary-dark py-12 sm:py-28 relative overflow-hidden"
    aria-labelledby="commitment-heading"
  >
    <!-- Decorative glow orbs -->
    <div class="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" aria-hidden="true" />
    <div class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" aria-hidden="true" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-dark/40 blur-3xl pointer-events-none" aria-hidden="true" />
    <svg
      class="absolute -bottom-12 -right-12 w-64 h-64 text-white/5 pointer-events-none"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>

    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

      <!-- Label badge with WCAG AA compliant text -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-[0.18em] text-white mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" aria-hidden="true" />
        {{ t('about.commitment.badge') }}
      </div>

      <h2
        id="commitment-heading"
        class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6"
      >
        {{ t('about.commitment.title') }}
        <span class="bg-gradient-to-r from-secondary via-amber-400 to-amber-300 bg-clip-text text-transparent">
          {{ t('about.commitment.titleHighlight') }}
        </span>
      </h2>

      <!-- High contrast subtitle (text-slate-100) -->
      <p class="text-sm sm:text-base text-slate-100 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
        {{ t('about.commitment.subtitle') }}
      </p>

      <!-- CTA buttons: Minimum 48px touch targets, visible high contrast focus indicators -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          :to="isAuthenticated ? '/dashboard' : '/auth/register'"
          class="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl"
          :aria-label="isAuthenticated ? t('about.commitment.btnDashboard') : t('about.commitment.btnRegister')"
        >
          <BaseButton
            variant="secondary"
            size="lg"
            :block="false"
            class="w-full sm:w-auto min-w-[200px] min-h-[48px] shadow-xl shadow-secondary/30 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none font-bold"
          >
            {{ isAuthenticated ? t('about.commitment.btnDashboard') : t('about.commitment.btnRegister') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </BaseButton>
        </NuxtLink>

        <NuxtLink
          to="/contact-us"
          class="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl"
          aria-label="Կապ հաստատել AmTrans-ի հետ"
        >
          <button
            type="button"
            class="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none cursor-pointer"
          >
            {{ t('about.commitment.btnContact') }}
          </button>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>
