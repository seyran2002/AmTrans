<template>
  <div class="flex flex-col items-center justify-center p-5 sm:p-8 text-center bg-white/90 backdrop-blur-2xl border border-white/60 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl shadow-primary/10 max-w-md mx-auto animate-fade-in">
    <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-tertiary/10 text-tertiary border border-tertiary/20 flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
      <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 class="text-lg sm:text-2xl font-black text-primary tracking-tight mb-2 sm:mb-3">{{ title }}</h3>
    <p class="text-xs sm:text-sm text-slate-500 font-medium mb-5 sm:mb-8 leading-relaxed max-w-xs">{{ message }}</p>
    <NuxtLink :to="localePath('/')" class="w-full">
      <BaseButton variant="secondary" size="md" block class="!py-2.5 sm:!py-3 text-xs sm:text-sm">
        {{ backText }}
      </BaseButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

defineProps<{
  title: string
  message: string
  backText: string
}>()
const localePath = useLocalePath()
</script>