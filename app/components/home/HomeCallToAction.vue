<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'
import BaseButton from '~/components/ui/BaseButton.vue'

const { isAuthenticated } = useAuth()
const { t } = useI18n()
</script>

<template>
  <section
    id="get-started"
    class="w-full py-12 sm:py-28 relative overflow-hidden bg-gradient-to-br from-primary via-[#1c3260] to-slate-950 text-white"
    aria-labelledby="cta-heading"
  >
    <!-- Background glowing orbs & radial overlays -->
    <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/40 blur-3xl pointer-events-none" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />

    <!-- Subtle geometric grid overlay -->
    <div
      class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50"
    />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

      <!-- Top Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-[0.18em] text-white mb-6 shadow-lg shadow-black/20">
        <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        {{ t('home.cta.badge') }}
      </div>

      <!-- Main Headline -->
      <h2
        id="cta-heading"
        class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 max-w-3xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      >
        {{ t('home.cta.title') }}
        <span class="bg-gradient-to-r from-secondary via-amber-400 to-amber-300 bg-clip-text text-transparent">
          {{ t('home.cta.titleHighlight') }}
        </span>
      </h2>

      <!-- Subtitle Description -->
      <p class="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-100 font-normal leading-relaxed mb-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
        {{ t('home.cta.subtitle') }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <NuxtLink :to="isAuthenticated ? '/dashboard' : '/auth/register'" class="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
          <BaseButton
            variant="secondary"
            size="lg"
            :block="false"
            class="w-full sm:w-auto min-w-[220px] min-h-[48px] shadow-xl shadow-secondary/30 font-bold"
          >
            <span>{{ isAuthenticated ? t('home.cta.goToDashboard') : t('home.cta.getStarted') }}</span>
            <svg class="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </BaseButton>
        </NuxtLink>

        <NuxtLink to="/contact-us" class="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
          <button
            type="button"
            class="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 py-3 px-8 sm:py-4 rounded-2xl text-base font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none cursor-pointer"
          >
            <span>{{ t('home.cta.contactUs') }}</span>
          </button>
        </NuxtLink>
      </div>

      <!-- Feature Reassurance Badges -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/15">
        <div class="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-100 font-medium">
          <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>{{ t('home.cta.f1') }}</span>
        </div>

        <div class="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-100 font-medium">
          <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>{{ t('home.cta.f2') }}</span>
        </div>

        <div class="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-100 font-medium">
          <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>{{ t('home.cta.f3') }}</span>
        </div>
      </div>

    </div>
  </section>
</template>
