<template>
  <div class="flex flex-col items-center justify-center p-8 sm:p-10 text-center bg-white/85 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl shadow-primary/10 max-w-md mx-auto animate-fade-in">
    <div class="w-16 h-16 rounded-2xl bg-tertiary/10 text-tertiary border border-tertiary/20 flex items-center justify-center mb-6 shadow-sm">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 class="text-xl sm:text-2xl font-black text-primary tracking-tight mb-3">{{ title }}</h3>
    <p class="text-sm text-slate-500 font-medium mb-8 leading-relaxed max-w-xs">{{ message }}</p>
    <NuxtLink to="/" class="w-full">
      <BaseButton variant="secondary" size="md" block>
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
</script>