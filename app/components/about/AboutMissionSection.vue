<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <section
    id="our-story"
    class="w-full bg-bgPrimary py-20 sm:py-28 scroll-mt-20"
    aria-labelledby="mission-heading"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Section header -->
      <div class="text-center mb-14 sm:mb-20">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-5">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
          {{ t('about.mission.badge') }}
        </span>
        <h2
          id="mission-heading"
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          {{ t('about.mission.title') }}
          <span class="bg-gradient-to-r from-secondary to-amber-500 bg-clip-text text-transparent"> {{ t('about.mission.titleHighlight') }}</span>
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          {{ t('about.mission.subtitle') }}
        </p>
      </div>

      <!-- Two-column: story + visual card -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        <!-- Left: narrative text -->
        <div class="space-y-6 [&>.popup]:!mt-0 text-slate-800">
          <p class="text-sm sm:text-base leading-relaxed">
            {{ t('about.mission.p1') }}
          </p>
          <p class="text-sm sm:text-base leading-relaxed">
            {{ t('about.mission.p2') }}
          </p>
          <p class="text-sm sm:text-base leading-relaxed">
            {{ t('about.mission.p3') }}
          </p>

          <!-- Highlighted pull-quote -->
          <blockquote class="border-l-4 border-secondary pl-5 py-1">
            <p class="text-base sm:text-lg font-semibold text-primary italic leading-snug">
              {{ t('about.mission.quote') }}
            </p>
          </blockquote>
        </div>

        <!-- Right: mission card grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <!-- Card: Transparency -->
          <div class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-primary mb-1.5">{{ t('about.mission.values.transparencyTitle') }}</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">{{ t('about.mission.values.transparencyDesc') }}</p>
          </div>

          <!-- Card: Reliability -->
          <div class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-primary mb-1.5">{{ t('about.mission.values.reliabilityTitle') }}</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">{{ t('about.mission.values.reliabilityDesc') }}</p>
          </div>

          <!-- Card: Convenience -->
          <div class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="w-11 h-11 rounded-xl bg-tertiary/10 flex items-center justify-center mb-4 group-hover:bg-tertiary/20 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-primary mb-1.5">{{ t('about.mission.values.convenienceTitle') }}</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">{{ t('about.mission.values.convenienceDesc') }}</p>
          </div>

          <!-- Card: Customer Focus -->
          <div class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-primary mb-1.5">{{ t('about.mission.values.customerFirstTitle') }}</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">{{ t('about.mission.values.customerFirstDesc') }}</p>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
