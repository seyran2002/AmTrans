<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '#imports'
import { useI18n } from '~/composables/useI18n'
import BaseButton from '~/components/ui/BaseButton.vue'
import NuxtImg from '~/components/NuxtImg.vue'

const { t } = useI18n()

// Cloudinary image configuration — optimized responsive loading for LCP < 1.2s
const cloudinaryBase = 'https://res.cloudinary.com/tgatbuws/image/upload'
const imagePath = 'v1792777621/about-hero.jpg'

const getCloudinaryUrl = (width: number, quality = 75) =>
  `${cloudinaryBase}/c_fill,g_auto,w_${width},q_${quality},f_auto/${imagePath}`

const mobileWidths = [412, 480, 640, 768, 1024]
const desktopWidths = [1280, 1440, 1600, 1920, 2560]

const mobileSrcset = computed(() =>
  mobileWidths.map(w => `${getCloudinaryUrl(w)} ${w}w`).join(', '),
)
const desktopSrcset = computed(() =>
  desktopWidths.map(w => `${getCloudinaryUrl(w)} ${w}w`).join(', '),
)

// Preload hero image in useHead with crossorigin: 'anonymous' for maximum performance (LCP)
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      media: '(max-width: 1024px)',
      imagesrcset: mobileSrcset.value,
      imagesizes: '100vw',
      crossorigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'image',
      media: '(min-width: 1025px)',
      imagesrcset: desktopSrcset.value,
      imagesizes: '100vw',
      crossorigin: 'anonymous',
    },
  ],
})
</script>

<template>
  <!-- Hero: full-viewport, matching HomeHero proportions exactly -->
  <section
    class="about-hero relative w-full h-[100dvh] max-h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-slate-900"
    aria-label="About AmTrans hero"
  >
    <!-- ── 1. Art-Directed Background Image via NuxtImg (CLS = 0.00, high priority, zero-cookie) ── -->
    <div class="absolute inset-0 z-0 select-none pointer-events-none">
      <NuxtImg
        :src="getCloudinaryUrl(1920)"
        :width="1920"
        :height="1080"
        fetchpriority="high"
        loading="eager"
        decoding="async"
        crossorigin="anonymous"
        class="absolute inset-0 w-full h-full object-cover object-left sm:object-center transform scale-[1.02] transition-transform duration-1000"
        :alt="t('about.hero.imageAlt')"
      />
    </div>

    <!-- ── 2. Overlay stack (high contrast WCAG 2.1 AA compliant) ── -->
    <div class="absolute inset-0 z-[1] bg-slate-950/40" />
    <div class="absolute inset-x-0 bottom-0 h-3/4 z-[1] bg-gradient-to-t from-primary/50 via-slate-950/40 to-transparent" />
    <div class="absolute inset-x-0 top-0 h-48 sm:h-56 z-[1] bg-gradient-to-b from-white/95 via-white/40 to-transparent pointer-events-none" />

    <!-- Decorative glow orbs -->
    <div class="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl pointer-events-none z-[1]" />
    <div class="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none z-[1]" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/15 blur-3xl pointer-events-none z-[1]" />
    <div class="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none z-[1]" />

    <!-- ── 3. Hero Content ── -->
    <div class="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex-1 flex flex-col justify-center items-center text-center hero-content min-h-0">

      <!-- Page label badge -->
      <div class="hidden min-[380px]:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 mb-6 sm:mb-8 shadow-lg shadow-primary/10">
        <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <span class="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {{ t('about.hero.badge') }}
        </span>
      </div>

      <!-- Main headline: Single semantic H1 with full accessibility & visual preservation -->
      <h1
        class="text-3xl min-[380px]:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-4 sm:mb-5 max-w-4xl shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        aria-label="AmTrans Լոգիստիկ Ընկերության Մասին"
      >
        <span class="sr-only">AmTrans Լոգիստիկ Ընկերության Մասին - </span>
        {{ t('about.hero.title') }}
        <span class="block sm:inline bg-gradient-to-r from-secondary via-amber-400 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
          {{ t('about.hero.titleHighlight') }}
        </span>
      </h1>

      <!-- Supporting description -->
      <p class="text-xs sm:text-sm md:text-base lg:text-lg text-slate-100 font-normal leading-relaxed max-w-2xl sm:max-w-3xl mb-6 sm:mb-8 shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
        {{ t('about.hero.subtitle') }}
      </p>

      <!-- CTAs: Minimum 48px touch targets, visible focus rings -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto shrink-0">
        <a
          href="#our-story"
          class="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl"
          aria-label="Կարդալ մեր պատմությունը"
        >
          <BaseButton
            variant="primary"
            size="md"
            :block="false"
            class="w-full sm:w-auto min-w-[180px] min-h-[48px] shadow-xl shadow-primary/40 hover:shadow-primary/60 font-bold focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          >
            <span>{{ t('about.hero.storyBtn') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5 ml-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </BaseButton>
        </a>

        <NuxtLink
          to="/contact-us"
          class="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl"
          aria-label="Կապ հաստատել AmTrans-ի հետ"
        >
          <button
            type="button"
            class="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-primary/30 hover:bg-primary/40 backdrop-blur-md border border-primary/50 shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none cursor-pointer"
          >
            <span>{{ t('about.hero.contactBtn') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </button>
        </NuxtLink>
      </div>
    </div>

    <!-- ── 4. Scroll Indicator ── -->
    <div class="relative bottom-8 z-10 pb-12 shrink-0 flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
      <span class="text-[9px] font-bold uppercase tracking-[0.2em] text-white">{{ t('about.hero.scroll') }}</span>
      <div class="w-4 h-7 rounded-full border-2 border-white/40 flex items-start justify-center p-0.5">
        <span class="w-1 h-1.5 rounded-full bg-white animate-bounce" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-content > * {
  animation: heroFadeUp 0.8s ease-out both;
}
.hero-content > *:nth-child(1) { animation-delay: 0.1s; }
.hero-content > *:nth-child(2) { animation-delay: 0.25s; }
.hero-content > *:nth-child(3) { animation-delay: 0.4s; }
.hero-content > *:nth-child(4) { animation-delay: 0.55s; }

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
