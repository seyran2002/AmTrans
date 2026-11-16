<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-bold tracking-wide transition-all duration-200 rounded-xl sm:rounded-2xl select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
      sizeClasses,
      variantClasses,
      block ? 'w-full' : '',
      disabled || loading ? 'opacity-60 cursor-not-allowed transform-none shadow-none' : 'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer'
    ]"
  >
    <svg v-if="loading" class="animate-spin h-5 w-5 text-current shrink-0" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
  }>(),
  {
    type: 'button',
    disabled: false,
    loading: false,
    variant: 'secondary',
    size: 'md',
    block: true
  }
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'min-h-unset sm:min-h-[44px] py-2 sm:py-2.5 px-3 sm:px-4 text-xs'
    case 'lg':
      return 'min-h-unset sm:min-h-[52px] py-3 sm:py-4 sm:px-8 text-base font-extrabold'
    case 'md':
    default:
      return 'min-h-unset sm:min-h-[48px] py-2.5 sm:py-3.5 px-4 sm:px-6 text-xs sm:text-sm'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 focus-visible:ring-primary/50 border border-primary/30'
    case 'secondary':
      return 'text-white bg-gradient-to-r from-secondary via-amber-500 to-amber-600 hover:from-amber-500 hover:to-secondary shadow-lg shadow-secondary/25 hover:shadow-secondary/40 focus-visible:ring-secondary/50 border border-amber-400/30'
    case 'tertiary':
      return 'text-white bg-gradient-to-r from-tertiary to-red-900 hover:from-red-900 hover:to-tertiary shadow-lg shadow-tertiary/25 hover:shadow-tertiary/40 focus-visible:ring-red-600/50 border border-red-800/30'
    case 'outline':
      return 'text-primary bg-white/80 hover:bg-white border-2 border-slate-300 hover:border-primary/50 shadow-sm focus-visible:ring-primary/40'
    case 'ghost':
      return 'text-slate-800 hover:text-primary bg-transparent hover:bg-slate-100/80 focus-visible:ring-slate-400'
    default:
      return 'text-white bg-secondary'
  }
})
</script>
