<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" :for="id" class="block text-xs font-bold uppercase tracking-wider text-primary/90">
      {{ label }}
      <span v-if="required" class="text-tertiary ml-0.5 font-bold">*</span>
    </label>

    <div class="relative group">
      <!-- Icon Prefix Slot -->
      <div v-if="$slots.icon" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
        <slot name="icon" />
      </div>

      <!-- Input Field -->
      <input
        :id="id"
        :value="modelValue"
        :type="type"
        :min="min"
        :max="max"
        :step="step"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        :class="[
          'w-full py-3.5 text-sm font-medium transition-all duration-200 outline-none rounded-2xl text-slate-900 placeholder:text-slate-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          $slots.icon ? 'pl-11' : 'pl-4',
          $slots.action ? 'pr-11' : 'pr-4',
          disabled ? 'opacity-60 cursor-not-allowed bg-slate-100/80 border-slate-200' : '',
          touched && error
            ? 'border-2 border-tertiary/80 bg-red-50/40 text-tertiary focus:border-tertiary focus:ring-4 focus:ring-tertiary/10'
            : 'border border-slate-300 bg-white hover:border-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:shadow-md'
        ]"
      />

      <!-- Right Action Slot (e.g., Eye Toggle) -->
      <div v-if="$slots.action" class="absolute inset-y-0 right-0 pr-3.5 flex items-center">
        <slot name="action" />
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="touched && error" class="text-xs text-tertiary font-semibold flex items-center gap-1.5 mt-1 animate-fade-in">
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
    id: string
    label?: string
    type?: string
    min?: string | number
    max?: string | number
    step?: string | number
    placeholder?: string
    disabled?: boolean
    required?: boolean
    error?: string
    touched?: boolean
    autocomplete?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    disabled: false,
    required: false,
    error: '',
    touched: true,
    autocomplete: 'off'
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()
</script>
