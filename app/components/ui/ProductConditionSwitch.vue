<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label !== ''" class="block text-xs font-bold uppercase tracking-wider text-primary/90">
      {{ displayLabel }}
      <span v-if="required" class="text-tertiary ml-0.5 font-bold">*</span>
    </label>
    <div
      class="grid grid-cols-2 p-1.5 bg-slate-200/50 backdrop-blur-md border border-slate-200/80 rounded-2xl gap-1.5 shadow-inner"
      :class="disabled ? 'opacity-60 cursor-not-allowed' : ''"
    >
      <!-- Option 1: New (true) -->
      <button
        type="button"
        :disabled="disabled"
        class="py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 select-none focus:outline-none disabled:cursor-not-allowed"
        :class="[
          modelValue === true
            ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 scale-[1.01]'
            : 'text-slate-600 hover:text-primary hover:bg-white/50'
        ]"
        @click="$emit('update:modelValue', true)"
      >
        <svg class="w-4 h-4 shrink-0 block sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>{{ displayNewLabel }}</span>
      </button>

      <!-- Option 2: Used (false) -->
      <button
        type="button"
        :disabled="disabled"
        class="py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 select-none focus:outline-none disabled:cursor-not-allowed"
        :class="[
          modelValue === false
            ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 scale-[1.01]'
            : 'text-slate-600 hover:text-primary hover:bg-white/50'
        ]"
        @click="$emit('update:modelValue', false)"
      >
        <svg class="w-4 h-4 shrink-0 block sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>{{ displayUsedLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

interface Props {
  modelValue: boolean
  label?: string
  newLabel?: string
  usedLabel?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  label: undefined,
  newLabel: undefined,
  usedLabel: undefined,
  required: false,
  disabled: false
})

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()

const displayLabel = computed(() => props.label ?? t('orders.productCondition'))
const displayNewLabel = computed(() => props.newLabel ?? t('orders.productNew'))
const displayUsedLabel = computed(() => props.usedLabel ?? t('orders.productUsed'))
</script>

