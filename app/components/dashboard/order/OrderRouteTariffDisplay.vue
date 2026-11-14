<template>
  <div class="transition-all duration-200">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl flex items-center justify-between gap-3 animate-pulse"
    >
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ t('orders.routeTariff') }}</p>
          <p class="text-xs text-slate-400 font-medium">{{ t('orders.loadingTariff') }}</p>
        </div>
      </div>
      <div class="h-6 w-24 bg-slate-200/80 rounded-lg"></div>
    </div>

    <!-- Available Tariff Display -->
    <div
      v-else-if="showTariff"
      class="p-4 bg-primary/[0.03] border border-primary/20 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-primary/30 transition-all"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
        </div>
        <div class="truncate">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold uppercase tracking-wider text-primary">
              {{ isLockedTariff ? t('orders.tariffAtBooking') : (isEstimated ? t('orders.suggestedTariff') : t('orders.routeTariff')) }}
            </span>
            <span
              v-if="isLockedTariff"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300"
            >
              <svg class="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Locked
            </span>
            <span
              v-else-if="isEstimated"
              class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-800"
            >
              {{ t('orders.suggestedTariff') }}
            </span>
            <span
              v-if="routeLabel"
              class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary"
            >
              {{ routeLabel }}
            </span>
          </div>
          <p class="text-xs text-slate-500 font-medium truncate mt-0.5">
            {{ isLockedTariff ? t('orders.priceLockedAtBooking') : (isEstimated ? t('orders.proposedShippingPrice') : t('orders.tariffRateDescription')) }}
          </p>
        </div>
      </div>

      <div class="shrink-0 text-right">
        <div class="inline-flex items-baseline gap-1.5 px-3 py-1.5 bg-white border border-primary/20 rounded-xl shadow-xs">
          <span class="text-base sm:text-lg font-extrabold text-primary">
            {{ formatPrice(displayPricePerKg) }}
          </span>
          <span class="text-xs font-bold text-primary/70">AMD / kg</span>
        </div>
      </div>
    </div>

    <!-- Missing Tariff State -->
    <div
      v-else-if="isMissing && !showTariff"
      class="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-center gap-3"
    >
      <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div class="min-w-0">
        <p class="text-xs font-bold text-amber-900">{{ t('orders.routeTariff') }}</p>
        <p class="text-xs text-amber-800/90 font-medium mt-0.5">{{ t('orders.noTariffForRoute') }}</p>
      </div>
    </div>

    <!-- Error State with Retry -->
    <div
      v-else-if="error"
      class="p-3.5 bg-red-50/90 border border-tertiary/20 rounded-2xl flex items-center justify-between gap-3"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-xl bg-red-100 text-tertiary flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs font-bold text-tertiary">{{ t('orders.tariffError') }}</p>
          <p class="text-xs text-slate-600 font-medium truncate mt-0.5">{{ error }}</p>
        </div>
      </div>
      <button
        type="button"
        @click="$emit('retry')"
        class="text-xs font-bold text-tertiary hover:underline px-2.5 py-1.5 rounded-lg hover:bg-tertiary/10 transition-colors shrink-0"
      >
        {{ t('orders.retryTariff') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import type { TariffRateInput } from '~/composables/useOrderCalculation'

const props = withDefaults(
  defineProps<{
    tariff?: TariffRateInput | null
    loading?: boolean
    isMissing?: boolean
    error?: string | null
    routeLabel?: string
    formatPrice?: (price?: number | string | null) => string
    estimatedPrice?: number | string | null
    isLocked?: boolean
    tariffRateAtBooking?: number | null
  }>(),
  {
    tariff: null,
    loading: false,
    isMissing: false,
    error: null,
    routeLabel: '',
    formatPrice: (p?: number | string | null) => (p != null ? String(p) : '0'),
    estimatedPrice: null,
    isLocked: false,
    tariffRateAtBooking: null
  }
)

defineEmits<{
  (e: 'retry'): void
}>()

const { t } = useI18n()

const isLockedTariff = computed(() => {
  return props.isLocked || Boolean((props.tariff as any)?.isLocked) || Boolean(props.tariffRateAtBooking)
})

const numEstimatedPrice = computed(() => {
  const direct = props.estimatedPrice
  if (direct !== undefined && direct !== null && direct !== '') {
    const num = Number(direct)
    if (!isNaN(num) && num > 0) return num
  }
  return null
})

const hasTariff = computed(() => {
  if (!props.tariff) return false
  const p = Number(props.tariff.pricePerKg)
  return !isNaN(p) && p > 0
})

const isEstimated = computed(() => {
  if (hasTariff.value) {
    return Boolean((props.tariff as any)?.isEstimated)
  }
  return numEstimatedPrice.value !== null
})

const showTariff = computed(() => hasTariff.value || numEstimatedPrice.value !== null)

const displayPricePerKg = computed(() => {
  if (hasTariff.value) {
    return props.tariff?.pricePerKg
  }
  return numEstimatedPrice.value
})
</script>

