<template>
  <header class="relative overflow-hidden pt-24 pb-10 sm:pt-36 sm:pb-16 mb-6 sm:mb-8 lg:mb-12">
    
    <div class="relative z-10">
      <!-- Breadcrumbs -->
      <nav class="mb-6 flex items-center gap-2 text-xs text-slate-500 font-medium">
        <NuxtLink to="/" class="hover:text-primary transition-colors flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>{{ t('howToUse.hero.home') }}</span>
        </NuxtLink>
        <span class="text-slate-300">/</span>
        <span class="text-slate-800 font-semibold">{{ t('howToUse.hero.breadcrumb') }}</span>
      </nav>

      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-wide uppercase mb-5 shadow-2xs">
        <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <span>{{ t('howToUse.hero.badge') }}</span>
      </div>

      <!-- Main Title -->
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5 max-w-3xl">
        {{ t('howToUse.hero.title') }} <span class="bg-gradient-to-r from-secondary via-amber-500 to-amber-600 bg-clip-text text-transparent">{{ t('howToUse.hero.brand') }}</span>
      </h1>

      <!-- Description -->
      <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal mb-8">
        {{ t('howToUse.hero.description') }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
        <!-- Primary CTA -->
        <button
          type="button"
          @click="$emit('startLearning')"
          class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto"
        >
          <span>{{ t('howToUse.hero.startLearning') }}</span>
          <svg class="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        <!-- Secondary CTA -->
        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-primary font-bold text-sm border border-slate-200/90 shadow-xs hover:border-primary/30 transition-all duration-200 active:scale-95 w-full sm:w-auto"
        >
          <span>{{ t('howToUse.hero.exploreDashboard') }}</span>
          <svg class="w-4 h-4 text-slate-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Quick Feature Pill Highlights -->
      <div class="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-6 border-t border-slate-200/80">
        <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-slate-200/70 shadow-2xs">
          <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-900 block leading-tight">{{ t('howToUse.hero.stat1Value') }}</span>
            <span class="text-[11px] text-slate-500 font-medium">{{ t('howToUse.hero.stat1Label') }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-slate-200/70 shadow-2xs">
          <div class="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-900 block leading-tight">{{ t('howToUse.hero.stat2Value') }}</span>
            <span class="text-[11px] text-slate-500 font-medium">{{ t('howToUse.hero.stat2Label') }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-slate-200/70 shadow-2xs">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-900 block leading-tight">{{ t('howToUse.hero.stat3Value') }}</span>
            <span class="text-[11px] text-slate-500 font-medium">{{ t('howToUse.hero.stat3Label') }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-slate-200/70 shadow-2xs">
          <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-900 block leading-tight">{{ t('howToUse.hero.stat4Value') }}</span>
            <span class="text-[11px] text-slate-500 font-medium">{{ t('howToUse.hero.stat4Label') }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

defineEmits<{
  (e: 'startLearning'): void
}>()
</script>
