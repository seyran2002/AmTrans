<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <section
    class="relative w-full overflow-hidden bg-gradient-to-b from-slate-950 via-[#132244] to-[#243E75] text-white pt-28 sm:pt-36 pb-20 sm:pb-28"
    aria-label="Contact Us Hero"
  >
    <!-- Background glow & ambient lighting effects -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/30 to-transparent blur-3xl pointer-events-none -z-0 opacity-70"
    />
    <div
      class="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-secondary/15 blur-3xl pointer-events-none -z-0"
    />
    <div
      class="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-tertiary/15 blur-3xl pointer-events-none -z-0"
    />

    <!-- Subtle geometric grid overlay -->
    <div
      class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 -z-0"
    />

    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Top Pill Badge -->
      <div
        class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-lg shadow-black/20"
      >
        <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <span class="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/95">
          {{ t('contact.badge') }}
        </span>
      </div>

      <!-- Main Headline -->
      <h1
        class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white mb-6"
      >
        {{ t('contact.heroTitle') }}
        <span
          class="bg-gradient-to-r from-secondary via-amber-400 to-amber-300 bg-clip-text text-transparent"
        >
          {{ t('contact.heroTitleHighlight') }}
        </span>
      </h1>

      <!-- Subtitle Description -->
      <p
        class="max-w-2xl sm:max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed"
      >
        {{ t('contact.heroSubtitle') }}
      </p>

      <!-- Quick Action Jump Links -->
      <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
        <a
          href="#contact-form"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-secondary hover:bg-secondary-hover text-white shadow-lg shadow-secondary/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>{{ t('contact.form.title') }}</span>
        </a>

        <a
          href="#offices-directory"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{{ t('contact.offices.title') }}</span>
        </a>
      </div>
    </div>
  </section>
</template>
