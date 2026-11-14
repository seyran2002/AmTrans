<template>
  <div
    v-if="message"
    class="p-4 rounded-2xl bg-tertiary/10 border border-tertiary/30 text-tertiary text-sm flex items-start gap-3 shadow-sm animate-shake"
  >
    <div class="w-7 h-7 rounded-xl bg-tertiary/20 flex items-center justify-center shrink-0 mt-0.5 text-tertiary">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div class="flex-1 font-semibold leading-snug self-center">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string | null
}>()
</script>
