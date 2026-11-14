<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="block text-xs font-bold uppercase tracking-wider text-primary/90">
      {{ label }}
      <span v-if="required" class="text-tertiary ml-0.5 font-bold">*</span>
    </label>
    <div class="relative">
      <vue-tel-input
        :model-value="modelValue"
        mode="international"
        default-country="AM"
        :auto-format="true"
        :dropdown-options="{ showDialCodeInSelection: true, showFlags: true }"
        :input-options="{ placeholder: placeholder || '+374 99 123456', required: required }"
        class="vue-tel-input-custom"
        :class="[
          error ? 'is-invalid' : ''
        ]"
        @on-input="onInput"
        @country-changed="onCountryChanged"
      />
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
import { ref } from 'vue'
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  required?: boolean
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectedCountry = ref<string>('AM')

const onCountryChanged = (countryObj: any) => {
  if (countryObj && countryObj.iso2) {
    selectedCountry.value = countryObj.iso2
  }
}

const onInput = (formattedNumber: string, phoneObject?: any) => {
  let phoneObj = phoneObject || (typeof formattedNumber === 'object' ? formattedNumber : null)
  let val = typeof formattedNumber === 'string' ? formattedNumber : (phoneObj?.number || phoneObj?.formatted || '')

  if (phoneObj && phoneObj.valid && phoneObj.number) {
    emit('update:modelValue', phoneObj.number)
  } else if (typeof val === 'string') {
    emit('update:modelValue', val)
  }
}
</script>

<style>
.vue-tel-input-custom {
  border-radius: 1rem !important;
  border: 1px solid rgba(226, 232, 240, 0.9) !important;
  background-color: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  transition: all 0.2s !important;
}

.vue-tel-input-custom.is-invalid {
  border: 2px solid rgba(138, 17, 21, 0.8) !important;
  background-color: rgba(254, 242, 242, 0.4) !important;
}

.vue-tel-input-custom:focus-within {
  border-color: #243E75 !important;
  box-shadow: 0 0 0 4px rgba(36, 62, 117, 0.1) !important;
  background-color: #ffffff !important;
}

.vue-tel-input-custom .vti__input {
  border-radius: 0 1rem 1rem 0 !important;
  background: transparent !important;
  color: #1e293b !important;
  padding: 0.8rem 1rem !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
}

.vue-tel-input-custom .vti__dropdown {
  border-radius: 1rem 0 0 1rem !important;
  padding: 0 0.6rem !important;
  border-right: 1px solid rgba(226, 232, 240, 0.8) !important;
}

.vue-tel-input-custom .vti__dropdown-list {
  border-radius: 1rem !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(226, 232, 240, 0.9) !important;
  max-width: 270px;
}
</style>