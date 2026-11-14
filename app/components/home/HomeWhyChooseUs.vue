<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

interface BenefitCard {
  key: string
  title: string
  description: string
  iconColor: string
  bgLight: string
  badgeVariant: 'primary' | 'secondary' | 'tertiary' | 'success'
  badgeLabel: string
  svgPath: string
}

const benefits = computed<BenefitCard[]>(() => [
  {
    key: 'pricing',
    title: t('home.whyUs.b1Title'),
    description: t('home.whyUs.b1Desc'),
    iconColor: 'text-amber-700',
    bgLight: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    badgeVariant: 'secondary',
    badgeLabel: t('home.whyUs.b1Badge'),
    svgPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    key: 'management',
    title: t('home.whyUs.b2Title'),
    description: t('home.whyUs.b2Desc'),
    iconColor: 'text-primary',
    bgLight: 'bg-primary/10 group-hover:bg-primary/20',
    badgeVariant: 'primary',
    badgeLabel: t('home.whyUs.b2Badge'),
    svgPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    key: 'tracking',
    title: t('home.whyUs.b3Title'),
    description: t('home.whyUs.b3Desc'),
    iconColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50 group-hover:bg-emerald-100',
    badgeVariant: 'success',
    badgeLabel: t('home.whyUs.b3Badge'),
    svgPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  },
  {
    key: 'reliability',
    title: t('home.whyUs.b4Title'),
    description: t('home.whyUs.b4Desc'),
    iconColor: 'text-tertiary',
    bgLight: 'bg-tertiary/10 group-hover:bg-tertiary/20',
    badgeVariant: 'tertiary',
    badgeLabel: t('home.whyUs.b4Badge'),
    svgPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
])
</script>

<template>
  <section
    id="why-choose-us"
    class="w-full bg-white py-20 sm:py-28 relative overflow-hidden scroll-mt-20 border-t border-slate-200/60"
    aria-labelledby="why-us-heading"
  >
    <!-- Background subtle ambient decorations -->
    <div class="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none -translate-y-1/2" />
    <div class="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      <!-- Section Header -->
      <div class="text-center mb-14 sm:mb-20 max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4 shadow-xs">
          <span class="w-1.5 h-1.5 rounded-full bg-primary" />
          {{ t('home.whyUs.badge') }}
        </div>
        <h2
          id="why-us-heading"
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          {{ t('home.whyUs.title') }}
          <span class="bg-gradient-to-r from-secondary via-amber-500 to-amber-600 bg-clip-text text-transparent">
            {{ t('home.whyUs.titleHighlight') }}
          </span>
        </h2>
        <p class="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          {{ t('home.whyUs.subtitle') }}
        </p>
      </div>

      <!-- 4 Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <article
          v-for="benefit in benefits"
          :key="benefit.key"
          class="group relative rounded-3xl bg-slate-50/70 border border-slate-200/80 p-7 sm:p-8 hover:bg-white hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
        >
          <!-- Subtle top gradient accent on hover -->
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div>
            <!-- Icon and Badge row -->
            <div class="flex items-center justify-between gap-3 mb-6">
              <div
                class="w-13 h-13 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-xs"
                :class="benefit.bgLight"
              >
                <svg
                  class="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                  :class="benefit.iconColor"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="benefit.svgPath" />
                </svg>
              </div>

              <span class="text-[11px] font-bold text-slate-700 bg-white border border-slate-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                {{ benefit.badgeLabel }}
              </span>
            </div>

            <!-- Title & Description -->
            <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-2.5 group-hover:text-primary transition-colors">
              {{ benefit.title }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {{ benefit.description }}
            </p>
          </div>

          <!-- Bottom micro-indicator -->
          <div class="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-1.5 text-xs font-bold text-slate-600 group-hover:text-primary transition-colors">
            <span>{{ t('home.whyUs.guaranteed') }}</span>
            <svg class="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </article>
      </div>

    </div>
  </section>
</template>
