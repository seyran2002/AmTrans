<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 font-semibold rounded-full border transition-colors',
      sizeClasses,
      variantClasses
    ]"
  >
    <slot name="icon" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

interface Props {
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-0.5 text-[11px]'
    case 'lg':
      return 'px-3.5 py-1.5 text-sm'
    case 'md':
    default:
      return 'px-2.5 py-1 text-xs'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary/10 text-primary border-primary/20'
    case 'secondary':
      return 'bg-amber-500/15 text-amber-800 border-amber-600/30 font-bold'
    case 'tertiary':
    case 'danger':
      return 'bg-tertiary/10 text-tertiary border-tertiary/20'
    case 'success':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'warning':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'info':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'default':
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
})
</script>
