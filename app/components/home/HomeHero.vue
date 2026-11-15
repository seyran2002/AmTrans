<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '#imports'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'

const { isAuthenticated } = useAuth()
const { t } = useI18n()
const $t = t

// Cloudinary image configuration
const cloudinaryBase = 'https://res.cloudinary.com/tgatbuws/image/upload'
const imagePath = 'v1790515541/home_hero.webp'

// Generate optimized Cloudinary crop URLs
const getCloudinaryUrl = (width: number, quality = 75) => {
  return `${cloudinaryBase}/c_fill,g_auto,w_${width},q_${quality},f_auto/${imagePath}`
}

const mobileWidths = [412, 480, 640, 768, 1024]
const desktopWidths = [1280, 1440, 1600, 1920, 2560]
  
const mobileSrcset = computed(() =>
  mobileWidths.map(w => `${getCloudinaryUrl(w)} ${w}w`).join(', ')
)

const desktopSrcset = computed(() =>
  desktopWidths.map(w => `${getCloudinaryUrl(w)} ${w}w`).join(', ')
)

// Inject responsive image preloads for maximum performance (LCP optimization)
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      media: '(max-width: 1024px)',
      imagesrcset: mobileSrcset.value,
      imagesizes: '100vw'
    },
    {
      rel: 'preload',
      as: 'image',
      media: '(min-width: 1025px)',
      imagesrcset: desktopSrcset.value,
      imagesizes: '100vw'
    }
  ]
})
</script>

<template>
  <section class="hero-section relative w-full h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-slate-900">

    <!-- ── 1. Cloudinary Art-Directed Background Image with AVIF/WebP & zero CLS ── -->
    <div class="absolute inset-0 z-0 select-none pointer-events-none">
      <NuxtImg
        :src="getCloudinaryUrl(1920)"
        :width="1920"
        :height="1080"
        fetchpriority="high"
        loading="eager"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover object-center transform scale-[1.02] transition-transform duration-1000"
        alt="AmTrans Logistics freight transport background"
      />
    </div>

    <!-- ── 2. Base Dark Scrim Overlay to Guarantee WCAG 4.5:1 Contrast over Image ── -->
    <div class="absolute inset-0 z-[1] bg-slate-950/40" />

    <div class="absolute inset-x-0 bottom-0 h-3/4 z-[1] bg-gradient-to-t from-primary/50 via-slate-950/30 to-transparent" />

    <!-- ── Light Gradient at Top specifically for the dark primary/secondary/tertiary BrandLogo ── -->
    <div class="absolute inset-x-0 top-0 h-48 sm:h-56 z-[1] bg-gradient-to-b from-white/95 via-white/50 to-transparent pointer-events-none" />

    <!-- Dominant Primary Orbs & Subtle Secondary Glow Orbs -->
    <div class="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl pointer-events-none z-[1]" />
    <div class="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none z-[1]" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/15 blur-3xl pointer-events-none z-[1]" />
    <div class="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none z-[1]" />

    <!-- ── 3. Main Hero Content Container ── -->
    <div class="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex-1 flex flex-col justify-center items-center text-center hero-content min-h-0">

      <!-- Badge with Primary Brand Styling -->
      <div class="hidden min-[380px]:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 mb-6 sm:mb-8 shadow-lg shadow-primary/10">
        <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {{ $t('home.hero.welcome') }}
        </span>
      </div>

      <!-- Main Headline with Primary Dominant Gradient -->
      <h1 class="text-3xl min-[380px]:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-4 sm:mb-5 max-w-4xl shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {{ $t('home.hero.title1') }}
        <span class="block sm:inline bg-gradient-to-r from-secondary via-amber-400 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
          {{ $t('home.hero.title2') }}
        </span>
      </h1>

      <!-- Short Supporting Description -->
      <p class="text-xs sm:text-sm md:text-base lg:text-lg text-slate-100 font-normal leading-relaxed max-w-2xl sm:max-w-3xl mb-6 sm:mb-8 shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
        {{ $t('home.hero.description') }}
      </p>

      <!-- ── 4. Call-to-Action Buttons ── -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-6 sm:mb-8 shrink-0">
        <!-- Main CTA (Primary #00338a Blue Accent) -->
        <NuxtLink :to="isAuthenticated ? '/dashboard' : '/auth/register'" class="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl">
          <BaseButton
            variant="primary"
            size="md"
            :block="false"
            class="w-full sm:w-auto min-w-[180px] min-h-[48px] shadow-xl shadow-primary/40 hover:shadow-primary/60 font-bold focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          >
            <span>{{ isAuthenticated ? $t('auth.dashboard') : $t('home.hero.getStarted') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </BaseButton>
        </NuxtLink>

        <!-- Secondary CTA ("How It Works") -->
        <NuxtLink to="/how-to-use" class="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl">
          <button
            type="button"
            class="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-primary/30 hover:bg-primary/40 backdrop-blur-md border border-primary/50 shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none cursor-pointer"
          >
            <div class="w-5 h-5 rounded-full bg-primary/40 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <span>{{ $t('home.hero.howItWorks') }}</span>
          </button>
        </NuxtLink>
      </div>

      <!-- ── 5. Statistics Grid (Primary Accent) ── -->
      <div class="w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-primary/30 backdrop-blur-xl border border-primary/40 p-3 sm:p-6 shadow-2xl shadow-primary/10 relative overflow-hidden shrink-0">
        <!-- Primary accent bar at top edge of stats card -->
        <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-90" />

        <div class="grid grid-cols-3 gap-1 sm:gap-2 divide-x divide-white/10">
          <!-- Stat 1 -->
          <div class="flex flex-col items-center text-center p-1 sm:p-1.5">
            <span class="text-base min-[360px]:text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
              150+
            </span>
            <span class="mt-0.5 text-[9px] min-[360px]:text-[10px] sm:text-xs font-semibold uppercase tracking-tight sm:tracking-wider text-slate-100 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              {{ $t('home.hero.globalHubs') }}
            </span>
          </div>

          <!-- Stat 2 -->
          <div class="flex flex-col items-center text-center p-1 sm:p-1.5">
            <span class="text-base min-[360px]:text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
              2.5M+
            </span>
            <span class="mt-0.5 text-[9px] min-[360px]:text-[10px] sm:text-xs font-semibold uppercase tracking-tight sm:tracking-wider text-slate-100 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              {{ $t('home.hero.parcelsMoved') }}
            </span>
          </div>

          <!-- Stat 3 -->
          <div class="flex flex-col items-center text-center p-1 sm:p-1.5">
            <span class="text-base min-[360px]:text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-sm">
              24/7
            </span>
            <span class="mt-0.5 text-[9px] min-[360px]:text-[10px] sm:text-xs font-semibold uppercase tracking-tight sm:tracking-wider text-slate-100 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              {{ $t('home.hero.liveExpressSupport') }}
            </span>
          </div>

        </div>
      </div>

    </div>

    <!-- ── 6. Scroll Indicator (Primary Accent) ── -->
    <div class="relative bottom-8 z-10 pb-12 shrink-0 flex flex-col items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity duration-300">
      <span class="text-[9px] font-bold uppercase tracking-[0.2em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Scroll</span>
      <div class="w-4 h-7 rounded-full border-2 border-white/60 flex items-start justify-center p-0.5">
        <span class="w-1 h-1.5 rounded-full bg-white animate-bounce" />
      </div>
    </div>

  </section>
</template>

<style scoped>
/* Staggered fade-in animation for hero elements */
.hero-content > * {
  animation: heroFadeUp 0.8s ease-out both;
}
.hero-content > *:nth-child(1) { animation-delay: 0.1s; }
.hero-content > *:nth-child(2) { animation-delay: 0.25s; }
.hero-content > *:nth-child(3) { animation-delay: 0.4s; }
.hero-content > *:nth-child(4) { animation-delay: 0.55s; }
.hero-content > *:nth-child(5) { animation-delay: 0.7s; }

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
