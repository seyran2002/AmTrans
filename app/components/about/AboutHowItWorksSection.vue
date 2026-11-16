<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

interface Step {
  number: string
  title: string
  description: string
  icon: string
}

const steps = computed<Step[]>(() => [
  {
    number: '01',
    title: t('about.howItWorks.step1Title'),
    description: t('about.howItWorks.step1Desc'),
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    number: '02',
    title: t('about.howItWorks.step2Title'),
    description: t('about.howItWorks.step2Desc'),
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    number: '03',
    title: t('about.howItWorks.step3Title'),
    description: t('about.howItWorks.step3Desc'),
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  },
  {
    number: '04',
    title: t('about.howItWorks.step4Title'),
    description: t('about.howItWorks.step4Desc'),
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  },
])
</script>

<template>
  <section
    id="how-it-works"
    class="w-full bg-white py-12 sm:py-28 scroll-mt-20"
    aria-labelledby="how-it-works-heading"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Section header -->
      <div class="text-center mb-14 sm:mb-20">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary mb-5">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
          {{ t('about.howItWorks.badge') }}
        </span>
        <h2
          id="how-it-works-heading"
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          {{ t('about.howItWorks.title') }}
          <span class="bg-gradient-to-r from-secondary to-amber-500 bg-clip-text text-transparent"> {{ t('about.howItWorks.titleHighlight') }}</span>
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          {{ t('about.howItWorks.subtitle') }}
        </p>
      </div>

      <!-- Steps grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">

        <!-- Connecting line — desktop only -->
        <div class="hidden lg:block absolute top-[2.75rem] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-0" aria-hidden="true" />

        <div
          v-for="(step, index) in steps"
          :key="step.number"
          class="relative flex flex-col items-center text-center group"
        >
          <!-- Step number circle -->
          <div
            class="relative z-10 w-14 h-14 rounded-full flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110"
            :class="index % 2 === 0 ? 'bg-primary' : 'bg-secondary'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.75"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" :d="step.icon" />
            </svg>
            <!-- Step label -->
            <span class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-slate-200 text-[9px] font-black text-primary flex items-center justify-center shadow-sm">
              {{ step.number.slice(1) }}
            </span>
          </div>

          <!-- Step content: H3 semantic heading with compliant text-slate-600 description -->
          <h3 class="text-sm sm:text-base font-bold text-primary mb-2">{{ step.title }}</h3>
          <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[220px] mx-auto">{{ step.description }}</p>
        </div>

      </div>

      <!-- Bottom CTA strip: minimum 48px touch target & high-contrast focus -->
      <div class="mt-16 sm:mt-20 text-center">
        <p class="text-sm text-slate-700 font-medium mb-5">{{ t('about.howItWorks.ctaText') }}</p>
        <NuxtLink
          to="/auth/register"
          class="inline-flex items-center justify-center min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
          aria-label="Գրանցվել և սկսել այսօր"
        >
          <button
            type="button"
            class="min-h-[48px] inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
          >
            <span>{{ t('about.howItWorks.ctaBtn') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>
