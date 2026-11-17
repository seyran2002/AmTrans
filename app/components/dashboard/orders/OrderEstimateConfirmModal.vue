<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="confirmingEstimate"
        class="fixed inset-0 z-[60] flex items-center justify-center px-4"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('dismiss')" />

        <!-- Dialog -->
        <div class="relative bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full z-10 border border-slate-200/50">
          <!-- Icon -->
          <div
            :class="[
              'w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4',
              confirmingEstimate.action === 'accept'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-600'
            ]"
          >
            <svg v-if="confirmingEstimate.action === 'accept'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-bold text-slate-900 text-center mb-2">
            {{ confirmingEstimate.action === 'accept' ? t('orders.acceptEstimate') : t('orders.rejectEstimate') }}
          </h3>

          <!-- Message -->
          <p class="text-sm text-slate-600 text-center mb-6 leading-relaxed">
            {{ confirmingEstimate.action === 'accept' ? t('orders.acceptConfirm') : t('orders.rejectConfirm') }}
          </p>

          <!-- Price Summary Recap for Acceptance -->
          <div
            v-if="confirmingEstimate.action === 'accept' && confirmingOrder"
            class="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-center space-y-1"
          >
            <span class="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              {{ t('orders.finalCalculatedPrice') }}
            </span>
            <div class="text-xl sm:text-2xl font-black text-slate-900">
              {{ calculatedPriceText }}
            </div>
            <div class="text-xs text-amber-800 font-semibold">
              {{ t('orders.suggestedTariff') }}: {{ confirmingOrder.estimatedPrice?.toLocaleString() }} AMD/kg
              <span class="text-slate-500 font-normal">({{ billableWeight }} kg)</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="$emit('dismiss')"
              class="flex-1 py-2.5 px-4 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
            >
              {{ t('orders.cancel') }}
            </button>
            <button
              type="button"
              @click="$emit('confirm', confirmingEstimate.orderId, confirmingEstimate.action)"
              :class="[
                'flex-1 py-2.5 px-4 rounded-2xl text-sm font-bold text-white transition-all active:scale-95',
                confirmingEstimate.action === 'accept'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-red-600 hover:bg-red-700'
              ]"
            >
              {{ confirmingEstimate.action === 'accept' ? t('orders.confirmAccept') : t('orders.confirmReject') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import type { Order } from '~/types/order'

const props = defineProps<{
  confirmingEstimate: { orderId: string; action: 'accept' | 'cancel' } | null
  confirmingOrder: Order | null
  getCalculatedPrice: (order: Order) => number | null
  getBillableWeight: (order: Order) => number
  formatCurrency: (price: number, currency: string) => string
}>()

defineEmits<{
  (e: 'dismiss'): void
  (e: 'confirm', orderId: string, action: 'accept' | 'cancel'): void
}>()

const { t } = useI18n()

const billableWeight = computed(() => {
  if (!props.confirmingOrder) return 0
  return props.getBillableWeight(props.confirmingOrder)
})

const calculatedPriceText = computed(() => {
  if (!props.confirmingOrder) return '-'
  const price = props.getCalculatedPrice(props.confirmingOrder)
  if (price === null) return '-'
  return props.formatCurrency(price, props.confirmingOrder.currency || 'AMD')
})
</script>

