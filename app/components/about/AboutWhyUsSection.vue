<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

interface Reason {
  title: string
  description: string
  gradient: string
  iconPath: string
  iconColor: string
}

const reasons = computed<Reason[]>(() => [
  {
    title: t('about.whyUs.reason1Title'),
    description: t('about.whyUs.reason1Desc'),
    gradient: 'from-primary/5 to-primary/10',
    iconPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    iconColor: 'text-primary',
  },
  {
    title: t('about.whyUs.reason2Title'),
    description: t('about.whyUs.reason2Desc'),
    gradient: 'from-secondary/5 to-secondary/10',
    iconPath: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z',
    iconColor: 'text-secondary',
  },
  {
    title: t('about.whyUs.reason3Title'),
    description: t('about.whyUs.reason3Desc'),
    gradient: 'from-tertiary/5 to-tertiary/10',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    iconColor: 'text-tertiary',
  },
  {
    title: t('about.whyUs.reason4Title'),
    description: t('about.whyUs.reason4Desc'),
    gradient: 'from-emerald-50 to-emerald-100/60',
    iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    iconColor: 'text-emerald-600',
  },
  {
    title: t('about.whyUs.reason5Title'),
    description: t('about.whyUs.reason5Desc'),
    gradient: 'from-violet-50 to-violet-100/60',
    iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
    iconColor: 'text-violet-600',
  },
  {
    title: t('about.whyUs.reason6Title'),
    description: t('about.whyUs.reason6Desc'),
    gradient: 'from-sky-50 to-sky-100/60',
    iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconColor: 'text-sky-600',
  },
])
</script>

<template>
  <section
    id="why-choose-us"
    class="w-full bg-bgPrimary py-20 sm:py-28 scroll-mt-20"
    aria-labelledby="why-choose-heading"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Section header -->
      <div class="text-center mb-14 sm:mb-20">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/20 text-xs font-bold uppercase tracking-[0.18em] text-tertiary mb-5">
          <span class="w-1.5 h-1.5 rounded-full bg-tertiary" aria-hidden="true" />
          {{ t('about.whyUs.badge') }}
        </span>
        <h2
          id="why-choose-heading"
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          {{ t('about.whyUs.title') }}
          <span class="bg-gradient-to-r from-secondary to-amber-500 bg-clip-text text-transparent"> {{ t('about.whyUs.titleHighlight') }}</span>
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          {{ t('about.whyUs.subtitle') }}
        </p>
      </div>

      <!-- Reasons grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <article
          v-for="reason in reasons"
          :key="reason.title"
          class="group relative rounded-2xl bg-white border border-slate-200/70 p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <!-- Subtle gradient bg on hover -->
          <div :class="`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`" />

          <!-- Icon -->
          <div class="relative w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center mb-5 shadow-sm transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
              :class="reason.iconColor"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.75"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" :d="reason.iconPath" />
            </svg>
          </div>

          <!-- Content: semantic H3 and high-contrast text-slate-600 font-medium -->
          <div class="relative">
            <h3 class="text-sm sm:text-base font-bold text-primary mb-2 group-hover:text-primary transition-colors">
              {{ reason.title }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {{ reason.description }}
            </p>
          </div>
        </article>
      </div>

    </div>
  </section>
</template>
