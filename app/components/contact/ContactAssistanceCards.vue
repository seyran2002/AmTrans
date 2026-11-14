<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <div class="space-y-6 [&>.popup]:!mt-0">
    <!-- ── 1. Support Commitment Card ── -->
    <div class="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm">
      <div class="w-11 h-11 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <h3 class="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
        {{ t('contact.customer.title') }}
      </h3>
      <p class="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 font-normal">
        {{ t('contact.customer.description') }}
      </p>

      <div class="space-y-4 pt-4 border-t border-slate-100">
        <div class="flex items-start gap-3">
          <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-800">{{ t('contact.customer.subTitle') }}</h4>
            <p class="text-[11px] text-slate-600 font-medium">{{ t('contact.customer.subTitleDescription') }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-800">{{ t('contact.customer.subTitle2') }}</h4>
            <p class="text-[11px] text-slate-600 font-medium">{{ t('contact.customer.subTitle2Description') }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 class="text-xs font-bold text-slate-800">{{ t('contact.customer.subTitle3') }}</h4>
            <p class="text-[11px] text-slate-600 font-medium">{{ t('contact.customer.subTitle3Description') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 2. Quick Hotline Banner ── -->
    <div class="rounded-3xl bg-gradient-to-br from-primary via-[#1c3260] to-primary-dark p-6 sm:p-7 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
      <div class="relative z-10">
        <span class="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-white/10 mb-3">
          {{ t('contact.help.badge') }}
        </span>
        <h4 class="text-lg font-bold text-white mb-1">
          {{ t('contact.help.title') }}
        </h4>
        <p class="text-xs text-slate-100 leading-relaxed mb-4 font-normal">
          {{ t('contact.help.description') }}
        </p>
        <a
          href="tel:+37498890233"
          class="inline-flex items-center gap-2 px-5 py-2.5 min-h-[48px] rounded-xl text-xs sm:text-sm font-bold bg-secondary hover:bg-secondary-hover text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 cursor-pointer"
          :aria-label="t('contact.cards.phoneAction')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>+374 98 890-233</span>
        </a>
      </div>

      <!-- Background decorative icon -->
      <svg
        class="absolute -bottom-6 -right-6 w-36 h-36 text-white/5 pointer-events-none"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    </div>
  </div>
</template>

