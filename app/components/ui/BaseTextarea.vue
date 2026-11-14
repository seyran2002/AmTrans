<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" :for="id" class="block text-xs font-bold uppercase tracking-wider text-primary/90">
      {{ label }}
      <span v-if="required" class="text-tertiary ml-0.5 font-bold">*</span>
    </label>

    <div class="relative">
      <textarea
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        @blur="$emit('blur')"
        :class="[
          'w-full px-2 sm:px-4 py-2 sm:py-3.5 text-sm font-medium rounded-2xl transition-all duration-200 outline-none placeholder:text-slate-400/80 shadow-sm resize-none disabled:opacity-60 disabled:cursor-not-allowed',
          error
            ? 'border-2 border-tertiary/80 bg-red-50/40 text-tertiary focus:border-tertiary focus:ring-4 focus:ring-tertiary/10'
            : 'bg-white/90 border border-slate-200/90 text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary'
        ]"
      />
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-xs text-tertiary font-semibold flex items-center gap-1.5 mt-1 animate-fade-in">
      <svg class="w-3.5 h-3.5 shrink-0 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{{ error }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    id?: string
    label?: string
    placeholder?: string
    rows?: number
    required?: boolean
    disabled?: boolean
    error?: string
  }>(),
  {
    rows: 3,
    required: false,
    disabled: false
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()
</script>

