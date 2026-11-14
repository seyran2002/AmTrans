<template>
  <div class="w-full p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3.5 text-emerald-900 shadow-sm animate-fade-in">
    <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <div class="flex-1 text-sm leading-relaxed self-center">
      <h4 v-if="title" class="font-bold text-emerald-950 mb-0.5">{{ title }}</h4>
      <p class="font-medium text-emerald-800"><slot>{{ message }}</slot></p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
}>()
</script>