<template>
  <BaseBadge :variant="variant" :size="size">
    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="dotClass" />
    <span class="w-max">{{ statusLabel }}</span>
  </BaseBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import BaseBadge, { type BadgeVariant } from '~/components/ui/BaseBadge.vue'
import type { OrderStatus } from '~/types/order'

interface Props {
  status: OrderStatus | string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const { t } = useI18n()

const statusLabel = computed(() => {
  if (!props.status) return '—'
  const key = `orders.status.${props.status}`
  const translated = t(key)
  return translated !== key ? translated : props.status
})

const variant = computed<BadgeVariant>(() => {
  switch (props.status) {
    case 'UNDER_REVIEW':
    case 'PENDING_ESTIMATE':
      return 'warning'
    case 'REGISTERED':
      return 'info'
    case 'FOREIGN_WAREHOUSE':
      return 'secondary'
    case 'IN_TRANSIT':
      return 'warning'
    case 'ARRIVED':
    case 'READY':
      return 'primary'
    case 'DELIVERED':
      return 'success'
    case 'CANCELLED':
    case 'REJECTED':
      return 'danger'
    default:
      return 'default'
  }
})

const dotClass = computed<string>(() => {
  switch (props.status) {
    case 'UNDER_REVIEW':
    case 'PENDING_ESTIMATE':
      return 'bg-amber-500 animate-pulse'
    case 'REGISTERED':
      return 'bg-blue-500'
    case 'FOREIGN_WAREHOUSE':
      return 'bg-secondary'
    case 'IN_TRANSIT':
      return 'bg-amber-500'
    case 'ARRIVED':
    case 'READY':
      return 'bg-primary'
    case 'DELIVERED':
      return 'bg-emerald-500'
    case 'CANCELLED':
    case 'REJECTED':
      return 'bg-red-500'
    default:
      return 'bg-slate-400'
  }
})
</script>
