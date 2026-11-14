<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="block text-xs font-bold uppercase tracking-wider text-primary/90">
      {{ label }}
    </label>
    <div class="grid grid-cols-2 p-1.5 bg-slate-200/50 backdrop-blur-md border border-slate-200/80 rounded-2xl gap-1.5 shadow-inner">
      <button
        type="button"
        class="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 select-none"
        :class="[
          modelValue === true
            ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 scale-[1.01]'
            : 'text-slate-600 hover:text-primary hover:bg-white/50'
        ]"
        @click="$emit('update:modelValue', true)"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>{{ individualLabel }}</span>
      </button>

      <button
        type="button"
        class="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 select-none"
        :class="[
          modelValue === false
            ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 scale-[1.01]'
            : 'text-slate-600 hover:text-primary hover:bg-white/50'
        ]"
        @click="$emit('update:modelValue', false)"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4" />
        </svg>
        <span>{{ legalEntityLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
  individualLabel: string
  legalEntityLabel: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>