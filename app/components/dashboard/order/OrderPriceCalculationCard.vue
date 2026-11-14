<template>
  <div class="bg-gradient-to-br from-slate-50 to-primary/[0.03] border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
    <!-- Card Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-3.5">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-primary/90">
          {{ t('orders.priceCalculation') }}
        </h4>
      </div>

      <div class="flex items-center gap-2">
        <!-- Locked Tariff Badge -->
        <span
          v-if="isLocked || tariffRateAtBooking"
          class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md"
          :title="t('orders.priceLockedAtBooking')"
        >
          <svg class="w-3 h-3 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>{{ t('orders.lockedPrice') }}</span>
        </span>

        <!-- Divisor badge -->
        <span
          v-if="volumetricDivisor"
          class="text-[11px] font-medium text-slate-500 bg-white/80 border border-slate-200/80 px-2 py-0.5 rounded-md"
          :title="t('orders.volumetricFormula').replace('{divisor}', String(volumetricDivisor))"
        >
          Divisor: {{ volumetricDivisor }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 animate-pulse">
      <svg class="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span>{{ t('orders.loadingTariff') }}</span>
    </div>

    <!-- Route missing state -->
    <div v-else-if="!hasRoute" class="py-2.5 text-xs text-slate-500 flex items-center gap-2">
      <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ t('orders.calcMissingRoute') }}</span>
    </div>

    <!-- Tariff missing state -->
    <div v-else-if="isRouteTariffMissing" class="py-2.5 text-xs text-amber-700 flex items-center gap-2">
      <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{{ t('orders.noTariffForRoute') }}</span>
    </div>

    <!-- Missing dimensions or weight state -->
    <div v-else-if="numericWeight === null || volumetricWeight === null" class="py-2.5 text-xs text-slate-500 flex items-center gap-2">
      <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ t('orders.calcMissingDimensions') }}</span>
    </div>

    <!-- Complete Calculation Breakdown -->
    <div v-else class="space-y-3.5">
      <!-- Weight metrics 3-col grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <!-- 1. Actual Weight -->
        <div
          :class="[
            'p-3 rounded-xl border transition-all',
            !isVolumetricLarger
              ? 'bg-primary/5 border-primary/25 ring-1 ring-primary/20'
              : 'bg-white/80 border-slate-200/80'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold text-slate-500">{{ t('orders.actualWeight') }}</span>
            <span v-if="!isVolumetricLarger" class="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              {{ t('orders.largerWeightApplied') }}
            </span>
          </div>
          <p class="text-sm sm:text-base font-bold text-slate-900 mt-1">
            {{ numericWeight.toFixed(2) }} <span class="text-xs font-semibold text-slate-500">kg</span>
          </p>
        </div>

        <!-- 2. Volumetric Weight -->
        <div
          :class="[
            'p-3 rounded-xl border transition-all',
            isVolumetricLarger
              ? 'bg-primary/5 border-primary/25 ring-1 ring-primary/20'
              : 'bg-white/80 border-slate-200/80'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold text-slate-500">{{ t('orders.volumetricWeight') }}</span>
            <span v-if="isVolumetricLarger" class="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              {{ t('orders.largerWeightApplied') }}
            </span>
          </div>
          <p class="text-sm sm:text-base font-bold text-slate-900 mt-1">
            {{ volumetricWeight.toFixed(2) }} <span class="text-xs font-semibold text-slate-500">kg</span>
          </p>
        </div>

        <!-- 3. Chargeable Weight (shows billable weight, with minimum badge when clamped) -->
        <div class="p-3 rounded-xl bg-primary/10 border border-primary/30">
          <div class="flex items-center justify-between gap-1">
            <span class="text-[11px] font-bold uppercase tracking-wider text-primary">{{ t('orders.chargeableWeight') }}</span>
            <span
              v-if="billableWeight !== null && chargeableWeight !== null && billableWeight > chargeableWeight"
              class="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded whitespace-nowrap"
            >
              min 5 kg
            </span>
          </div>
          <p class="text-sm sm:text-base font-black text-primary mt-1">
            {{ (billableWeight ?? chargeableWeight)?.toFixed(2) }} <span class="text-xs font-bold text-primary/70">kg</span>
          </p>
        </div>
      </div>

      <!-- Rate and Final Calculated Price Banner -->
      <div class="pt-3 border-t border-slate-200/80 flex flex-col gap-2.5">
        <!-- Tariff rate line -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-xs text-slate-600 font-medium flex-wrap">
            <span class="flex items-center gap-1">
              <svg v-if="isLocked || tariffRateAtBooking" class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>{{ (isLocked || tariffRateAtBooking) ? t('orders.tariffAtBooking') : t('orders.tariffPerKg') }}:</span>
            </span>
            <span class="font-bold text-slate-900">
              {{ formatPrice(tariffPricePerKg) }} AMD / kg
            </span>
            <span class="text-slate-400">×</span>
            <span class="font-bold text-slate-900">{{ (billableWeight ?? chargeableWeight)?.toFixed(2) }} kg</span>
          </div>

          <div class="flex items-baseline justify-between sm:justify-end gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">
              {{ (isLocked || tariffRateAtBooking) ? t('orders.lockedPrice') : t('orders.calculatedShippingPrice') }}:
            </span>
            <div class="inline-flex items-baseline gap-1 px-3 py-1 bg-primary text-white rounded-xl shadow-sm">
              <span class="text-base sm:text-lg font-black tracking-tight">
                {{ formatPrice(calculatedOrderPrice) }}
              </span>
              <span class="text-xs font-bold text-white/90">AMD</span>
            </div>
          </div>
        </div>

        <!-- Locked price info notice (when tariff is locked at booking) -->
        <div
          v-if="isLocked || tariffRateAtBooking"
          class="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-lg px-2.5 py-1.5"
        >
          <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">
            {{ t('orders.priceLockedAtBooking') }}
          </span>
        </div>

        <!-- Minimum price notice (shown whenever a tariff exists) -->
        <div
          v-if="minimumPrice !== null"
          class="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 rounded-lg px-2.5 py-1.5"
        >
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">
            {{ t('orders.minimumPrice').replace('{amount}', formatPrice(minimumPrice) + ' AMD') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

withDefaults(
  defineProps<{
    loading?: boolean
    hasRoute?: boolean
    isRouteTariffMissing?: boolean
    volumetricDivisor: number
    numericWeight: number | null
    volumetricWeight: number | null
    chargeableWeight: number | null
    billableWeight: number | null
    isVolumetricLarger: boolean
    tariffPricePerKg: number | null
    minimumPrice: number | null
    calculatedOrderPrice: number | null
    formatPrice?: (price?: number | string | null) => string
    isLocked?: boolean
    tariffRateAtBooking?: number | null
  }>(),
  {
    loading: false,
    hasRoute: false,
    isRouteTariffMissing: false,
    billableWeight: null,
    minimumPrice: null,
    formatPrice: (p?: number | string | null) => (p != null ? String(p) : '0'),
    isLocked: false,
    tariffRateAtBooking: null
  }
)

const { t } = useI18n()
</script>

