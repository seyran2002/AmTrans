<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useHead, clearError } from '#imports'
import type { NuxtError } from '#app'
import { useI18n } from '~/composables/useI18n'
import BaseButton from '~/components/ui/BaseButton.vue'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()

const router = useRouter()
const { t } = useI18n()
const $t = t

const is404 = computed(() => !props.error || Number(props.error.statusCode) === 404)
const localePath = (path: string) => path

useHead({
  title: computed(() => (is404.value ? t('error.404.metaTitle') : t('error.generic.metaTitle'))),
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
})

const handleBackToHome = () => {
  clearError({ redirect: localePath('/') })
}

const handleGoBack = () => {
  if (import.meta.client && window.history.length > 1) {
    router.back()
  } else {
    clearError({ redirect: localePath('/') })
  }
}
</script>

<template>
  <NuxtLayout name="guest">
    <section
      class="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:py-16"
      role="region"
      aria-label="Error Information"
    >
      <div class="max-w-md w-full text-center">
        <!-- Visual Anchor: Pill Badge -->
        <div
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-600/30 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800 shadow-xs mb-6"
        >
          <svg
            class="w-3.5 h-3.5 text-secondary shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.2"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <span>
            {{ is404 ? $t('error.404.badge') : (error?.statusCode ? `Error ${error.statusCode}` : $t('error.generic.badge')) }}
          </span>
        </div>

        <!-- Visual Anchor: Large Display Typography -->
        <div class="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none mb-4 select-none">
          <span class="bg-gradient-to-r from-primary via-[#1c3260] to-primary bg-clip-text text-transparent">
            {{ is404 ? '404' : (error?.statusCode || '500') }}
          </span>
        </div>

        <!-- Concise Headline -->
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          {{ is404 ? $t('error.404.title') : (error?.statusMessage || $t('error.generic.title')) }}
        </h1>

        <!-- Short Explanation -->
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto mb-8 font-normal">
          {{ is404 ? $t('error.404.description') : (error?.message || $t('error.generic.description')) }}
        </p>

        <!-- Core Functionality & CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <!-- Primary CTA: Back to Home -->
          <BaseButton
            type="button"
            variant="primary"
            size="md"
            :block="false"
            class="w-full sm:w-auto min-w-[170px] shadow-lg shadow-primary/25 hover:shadow-primary/40"
            :aria-label="$t('error.404.homeBtn')"
            @click="handleBackToHome"
          >
            <svg
              class="w-4 h-4 mr-1.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>{{ $t('error.404.homeBtn') }}</span>
          </BaseButton>

          <!-- Secondary CTA: Go Back -->
          <BaseButton
            type="button"
            variant="outline"
            size="md"
            :block="false"
            class="w-full sm:w-auto min-w-[150px]"
            :aria-label="$t('error.404.backBtn')"
            @click="handleGoBack"
          >
            <svg
              class="w-4 h-4 mr-1.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>{{ $t('error.404.backBtn') }}</span>
          </BaseButton>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
