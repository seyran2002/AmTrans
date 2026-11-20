<template>
  <div class="text-center py-4 space-y-6 [&>.popup]:!mt-0 animate-fade-in">
    <!-- Animated Mail Badge -->
    <div class="mx-auto w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 shadow-inner relative">
      <div class="absolute inset-0 rounded-full bg-secondary/20 animate-ping"></div>
      <div class="w-14 h-14 bg-gradient-to-tr from-secondary to-amber-500 rounded-full flex items-center justify-center shadow-lg text-white">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Title -->
    <div>
      <h2 class="text-2xl font-black text-primary">
        {{ t('auth.successTitle') }}
      </h2>
      <p class="text-xs text-slate-400 mt-1 font-semibold">
        {{ registeredEmail }}
      </p>
    </div>

    <!-- Success Message Card -->
    <div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-slate-800 text-sm font-medium leading-relaxed shadow-sm">
      {{ t('auth.successMessage') }}
    </div>

    <!-- Action Button -->
    <div class="pt-2">
      <NuxtLink :to="localePath('/auth/login')" class="block w-full">
        <BaseButton variant="primary">
          <span>{{ t('auth.backToLogin') }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </BaseButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

defineProps<{
  registeredEmail: string
  t: (key: string) => string
}>()

const localePath = useLocalePath()
</script>
