<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" :for="id" class="block text-xs font-bold uppercase tracking-wider text-primary/90">
      {{ label }}
      <span v-if="required" class="text-tertiary ml-0.5 font-bold">*</span>
    </label>
    <div class="relative group">
      <select
        :id="id"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        class="w-full px-4 py-3.5 bg-white border text-slate-900 text-sm font-medium rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:border-slate-400"
        :class="[
          error
            ? 'border-2 border-tertiary/80 bg-red-50/40 text-tertiary focus:border-tertiary focus:ring-tertiary/10'
            : 'border-slate-300 focus:border-primary focus:ring-primary/10 focus:bg-white'
        ]"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled selected class="text-slate-500">{{ placeholder }}</option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          class="text-slate-900 bg-white"
        >
          {{ opt.label }}
        </option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
    <p v-if="error" class="text-xs text-tertiary font-semibold flex items-center gap-1.5 mt-1 animate-fade-in">
      <svg class="w-3.5 h-3.5 shrink-0 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{{ error }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
export interface SelectOption {
  value: string
  label: string
}

defineProps<{
  modelValue: string
  options: SelectOption[]
  label?: string
  placeholder?: string
  id?: string
  required?: boolean
  disabled?: boolean
  error?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>