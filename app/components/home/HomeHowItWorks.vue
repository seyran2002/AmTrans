<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import BaseButton from '~/components/ui/BaseButton.vue'

const { t } = useI18n()
const localePath = useLocalePath();

interface StepItem {
  number: string
  title: string
  description: string
  icon: string
  color: string
  bg: string
}

const steps = computed<StepItem[]>(() => [
  {
    number: '01',
    title: t('home.howItWorks.step1Title'),
    description: t('home.howItWorks.step1Desc'),
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    number: '02',
    title: t('home.howItWorks.step2Title'),
    description: t('home.howItWorks.step2Desc'),
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    color: 'text-amber-700',
    bg: 'bg-amber-500/15',
  },
  {
    number: '03',
    title: t('home.howItWorks.step3Title'),
    description: t('home.howItWorks.step3Desc'),
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    number: '04',
    title: t('home.howItWorks.step4Title'),
    description: t('home.howItWorks.step4Desc'),
    icon: 'M5 13l4 4L19 7',
    color: 'text-tertiary',
    bg: 'bg-tertiary/10',
  },
])
</script>

<template>
  <section
    id="how-it-works"
    class="w-full bg-slate-50/70 py-12 sm:py-28 relative overflow-hidden scroll-mt-20 border-t border-slate-200/60"
    aria-labelledby="how-it-works-heading"
  >
    <!-- Background subtle ambient decorations -->
    <div class="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
    <div class="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      <!-- Section Header -->
      <div class="text-center mb-14 sm:mb-20 max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-600/30 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800 mb-4 shadow-xs">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          {{ t('home.howItWorks.badge') }}
        </div>
        <h2
          id="how-it-works-heading"
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          {{ t('home.howItWorks.title') }}
          <span class="bg-gradient-to-r from-secondary via-amber-500 to-amber-600 bg-clip-text text-transparent">
            {{ t('home.howItWorks.titleHighlight') }}
          </span>
        </h2>
        <p class="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          {{ t('home.howItWorks.subtitle') }}
        </p>
      </div>

      <!-- 4-Steps Process Grid with Desktop Connector Line -->
      <div class="relative mb-14 sm:mb-18">

        <!-- Connecting Line between steps on Desktop -->
        <div class="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-secondary/30 to-tertiary/20 z-0 pointer-events-none" />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 relative z-10">
          <div
            v-for="(step, idx) in steps"
            :key="step.number"
            class="group relative flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5"
          >
            <!-- Step Number Badge (Floating) -->
            <div class="relative mb-5">
              <div
                class="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md"
                :class="step.bg"
              >
                <svg
                  class="w-8 h-8 sm:w-9 sm:h-9"
                  :class="step.color"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" :d="step.icon" />
                </svg>
              </div>

              <!-- Number Tag -->
              <span class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center shadow-md border-2 border-white">
                {{ idx + 1 }}
              </span>
            </div>

            <!-- Title & Description -->
            <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
              {{ step.title }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[240px] mx-auto font-medium">
              {{ step.description }}
            </p>
          </div>
        </div>

      </div>

      <!-- Action Card Linking to How-to-Use Page -->
      <div class="max-w-2xl mx-auto text-center rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 shadow-xs">
        <h4 class="text-base sm:text-lg font-bold text-slate-900 mb-2">
          {{ t('home.howItWorks.walkthroughTitle') }}
        </h4>
        <p class="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          {{ t('home.howItWorks.learnMore') }}
        </p>
        <NuxtLink :to="localePath('/how-to-use')" class="inline-flex min-h-[48px] items-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          <BaseButton variant="primary" size="md" :block="false" class="shadow-lg shadow-primary/20 min-h-[48px]">
            <span>{{ t('home.howItWorks.howToUseBtn') }}</span>
            <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </BaseButton>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>
