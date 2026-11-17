<template>
  <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 transition-all">

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3 sm:space-y-4 py-3 sm:py-4">
      <div class="h-10 bg-slate-100 rounded-2xl animate-pulse w-full" />
      <div class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-16 bg-slate-50 rounded-2xl animate-pulse w-full" />
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!isLoading && orders.length === 0"
      class="text-center py-10 sm:py-12 px-4 max-w-md mx-auto"
    >
      <div class="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-primary/20">
        <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-1">{{ t('orders.emptyTitle') }}</h3>
      <p class="text-slate-500 text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed">{{ t('orders.emptySubtitle') }}</p>
      <BaseButton
        type="button"
        variant="secondary"
        size="md"
        :block="false"
        class="w-full sm:w-auto !min-h-[40px] sm:!min-h-[44px]"
        @click="$emit('add-order')"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>{{ t('orders.addOrder') }}</span>
      </BaseButton>
    </div>

    <!-- Orders Table & Filter -->
    <div v-else class="space-y-4 sm:space-y-6 [&>.popup]:!mt-0">
      <!-- ── Status Filter Bar ─────────────────────────────────────────── -->
      <OrdersStatusFilter
        :selected-status="selectedStatus"
        :tracking-number="trackingNumber"
        :status-counts="statusCounts"
        :total-orders="orders.length"
        :filtered-count="filteredOrders.length"
        @update:selected-status="$emit('update:selectedStatus', $event)"
        @update:tracking-number="$emit('update:trackingNumber', $event)"
        @reset-filter="$emit('reset-filter')"
      />

      <!-- ── Filtered Out Empty State ───────────────────────────────────── -->
      <div
        v-if="filteredOrders.length === 0"
        class="text-center py-10 sm:py-12 px-4 max-w-md mx-auto"
      >
        <div class="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 text-slate-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-2.5 sm:mb-3 border border-slate-200/80">
          <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <h3 class="text-sm sm:text-base font-bold text-slate-900 mb-1">
          {{ t('orders.noFilteredOrdersTitle') }}
        </h3>
        <p class="text-slate-500 text-xs mb-4 sm:mb-5 leading-relaxed">
          {{ t('orders.noFilteredOrdersSubtitle') }}
        </p>
        <BaseButton
          type="button"
          variant="outline"
          size="sm"
          :block="false"
          class="w-full sm:w-auto !min-h-[36px] sm:!min-h-[38px]"
          @click="$emit('reset-filter')"
        >
          <svg class="w-4 h-4 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ t('orders.clearFilter') }}</span>
        </BaseButton>
      </div>

      <!-- ── Orders Table ──────────────────────────────────────────────── -->
      <div v-else class="overflow-x-auto -mx-4 sm:mx-0">
        <table class="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th class="py-3.5 sm:py-4 px-3.5 sm:px-5 rounded-l-2xl">{{ t('orders.colId') }}</th>
              <th class="py-3.5 sm:py-4 px-3.5 sm:px-5">{{ t('orders.colStatus') }}</th>
              <th class="py-3.5 sm:py-4 px-3.5 sm:px-5">{{ t('orders.colProduct') }}</th>
              <th class="py-3.5 sm:py-4 px-3.5 sm:px-5">{{ t('orders.colRoute') }}</th>
              <th class="py-3.5 sm:py-4 px-3.5 sm:px-5">{{ t('orders.colPrice') }}</th>
              <th class="py-3.5 sm:py-4 px-3.5 sm:px-5">{{ t('orders.colPieces') }}</th>
              <th class="py-3.5 sm:py-4 px-3.5 sm:px-5">{{ t('orders.colWeight') }}</th>
              <th class="py-3.5 sm:py-4 px-3.5 sm:px-5">{{ t('orders.colDate') }}</th>
              <th class="py-3.5 sm:py-4 px-3.5 sm:px-5 text-right rounded-r-2xl">{{ t('orders.colActions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm font-medium text-slate-700">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-slate-50/80 transition-colors group"
            >
              <!-- ID / Code -->
              <td class="py-3.5 sm:py-4 px-3.5 sm:px-5 font-mono text-xs text-slate-500 font-bold w-max">
                {{ order.trackingNumber }}
              </td>

              <!-- Status Badge -->
              <td class="py-3.5 sm:py-4 px-3.5 sm:px-5">
                <OrderStatusBadge :status="order.status" size="sm" />
              </td>

              <!-- Product -->
              <td class="py-3.5 sm:py-4 px-3.5 sm:px-5">
                <div class="font-semibold text-slate-900 truncate max-w-[180px]" :title="order.marketName">
                  {{ order.marketName }}
                </div>
                <div class="text-xs text-slate-500 truncate max-w-[180px]" :title="order.productDescription">
                  {{ order.productDescription }}
                </div>
              </td>

              <!-- Route -->
              <td class="py-3.5 sm:py-4 px-3.5 sm:px-5">
                <div class="flex items-center gap-1.5 text-xs">
                  <span class="font-semibold text-slate-700 truncate max-w-[100px]">
                    {{ formatOfficeLabel(order.fromOffice) }}
                  </span>
                  <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span class="font-semibold text-slate-700 truncate max-w-[100px]">
                    {{ formatOfficeLabel(order.toOffice) }}
                  </span>
                </div>
              </td>

              <!-- Price -->
              <td class="py-3.5 sm:py-4 px-3.5 sm:px-5 text-center">
                <!-- Case when estimate accept/reject actions are displaying -->
                <div v-if="isPendingWithEstimate(order)" class="space-y-1">
                  <!-- Final calculated price -->
                  <div class="font-extrabold text-slate-900 text-sm">
                    {{ getCalculatedPrice(order) !== null ? formatCurrency(getCalculatedPrice(order)!, order.currency || 'AMD') : '-' }}
                  </div>
                  <!-- Suggested tariff price (estimatedPrice) -->
                  <div class="text-xs font-semibold text-amber-700">
                    {{ order.estimatedPrice!.toLocaleString() }} AMD/kg
                  </div>
                  <span class="inline-block text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-lg">
                    {{ t('orders.suggestedTariff') }}
                  </span>
                </div>

                <!-- Locked price at booking -->
                <div v-else-if="order.tariffRateAtBooking" class="space-y-1">
                  <div class="inline-flex items-center gap-1 font-bold text-slate-900">
                    <svg class="w-3.5 h-3.5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                    <span>{{ formatCurrency(Number(order.totalPrice ?? order.price ?? (order.tariffRateAtBooking * getBillableWeight(order))), order.currency || 'AMD') }}</span>
                  </div>
                  <div class="text-[11px] text-slate-500 font-medium">
                    {{ formatCurrency(+order.tariffRateAtBooking, "AMD") }}/kg
                  </div>
                  <span class="inline-block text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded" :title="t('orders.priceLockedAtBooking')">
                    {{ t('orders.lockedTariffAtBooking').replace('{rate}', formatCurrency(+order.tariffRateAtBooking, "AMD")) }} 
                  </span>
                </div>

                <!-- Has a final price -->
                <span v-else-if="order.totalPrice || order.price" class="font-bold text-slate-900">
                  {{ Number(order.totalPrice ?? order.price) ? formatCurrency(Number(order.totalPrice ?? order.price), order.currency) : "-" }}
                </span>

                <!-- Pending estimate waiting for operator -->
                <div v-else-if="isPendingWithoutEstimate(order)">
                  <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <svg class="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    {{ t('orders.waitingForEstimate') }}
                  </span>
                </div>
                <!-- No price -->
                <span v-else class="text-slate-400">—</span>
              </td>

              <!-- Pieces -->
              <td class="py-3.5 sm:py-4 px-3.5 sm:px-5 text-slate-700 font-medium">
                {{ order.pieceCount ?? 1 }} {{ t('orders.pieces') }}
              </td>

              <!-- Weight -->
              <td class="py-3.5 sm:py-4 px-3.5 sm:px-5 text-slate-600">
                <div>{{ order.weight }} kg</div>
                <div v-if="getBillableWeight(order) > Number(order.weight)" class="text-[11px] text-amber-700 font-medium" :title="t('orders.billableWeight')">
                  {{ getBillableWeight(order) }} kg (min 5kg)
                </div>
              </td>

              <!-- Date -->
              <td class="py-3.5 sm:py-4 px-3.5 sm:px-5 text-xs text-slate-500 min-w-[120px]">
                {{ formatDate(order.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="py-3.5 sm:py-4 px-3.5 sm:px-5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Estimate accept/reject actions -->
                  <template v-if="isPendingWithEstimate(order)">
                    <!-- Accept Button -->
                    <button
                      type="button"
                      :disabled="isEstimateProcessing(order.id)"
                      @click="showEstimateConfirm(order.id, 'accept')"
                      :title="t('orders.acceptEstimate')"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg v-if="isEstimateProcessing(order.id) && estimateAction === 'accept'" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span class="hidden lg:inline">{{ t('orders.acceptEstimate') }}</span>
                    </button>
                    <!-- Reject Button -->
                    <button
                      type="button"
                      :disabled="isEstimateProcessing(order.id)"
                      @click="showEstimateConfirm(order.id, 'cancel')"
                      :title="t('orders.rejectEstimate')"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg v-if="isEstimateProcessing(order.id) && estimateAction === 'cancel'" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span class="hidden lg:inline">{{ t('orders.rejectEstimate') }}</span>
                    </button>
                  </template>

                  <!-- QR Code Button -->
                  <button
                    type="button"
                    @click="openQrModal(order)"
                    :title="t('orders.viewQrCode')"
                    class="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-primary/10 transition-all active:scale-95 cursor-pointer"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                  </button>

                  <!-- Standard edit button -->
                  <button
                    v-if="!isPendingWithEstimate(order)"
                    type="button"
                    :disabled="isOrderLocked(order.status)"
                    @click="$emit('edit-order', order)"
                    :title="getOrderActionTooltip(order.status)"
                    :class="[
                      'inline-flex items-center justify-center p-2 rounded-xl transition-all',
                      isOrderLocked(order.status)
                        ? 'text-slate-300 cursor-not-allowed'
                        : order.status === 'REGISTERED'
                          ? 'text-primary hover:bg-primary/10 hover:text-primary active:scale-95'
                          : 'text-amber-600 hover:bg-amber-50 active:scale-95'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Estimate Confirmation Dialog ───────────────────────────────── -->
    <OrderEstimateConfirmModal
      :confirming-estimate="confirmingEstimate"
      :confirming-order="confirmingOrder"
      :get-calculated-price="getCalculatedPrice"
      :get-billable-weight="getBillableWeight"
      :format-currency="formatCurrency"
      @dismiss="dismissEstimateConfirm"
      @confirm="handleConfirmEstimate"
    />

    <!-- ── QR Code Modal ──────────────────────────────────────────────── -->
    <OrderQrModal
      :is-open="isQrModalOpen"
      :order="selectedQrOrder"
      @close="closeQrModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useSystemSettings } from '~/composables/useSystemSettings'
import BaseButton from '~/components/ui/BaseButton.vue'
import OrderStatusBadge from '~/components/dashboard/OrderStatusBadge.vue'
import OrdersStatusFilter from '~/components/dashboard/orders/OrdersStatusFilter.vue'
import OrderEstimateConfirmModal from '~/components/dashboard/orders/OrderEstimateConfirmModal.vue'
import OrderQrModal from '~/components/dashboard/orders/OrderQrModal.vue'
import type { Order, OrderStatus, FilterStatus } from '~/types/order'

const props = defineProps<{
  orders: Order[]
  filteredOrders: Order[]
  isLoading: boolean
  selectedStatus: FilterStatus
  trackingNumber?: string
  statusCounts: Partial<Record<OrderStatus, number>>
  processingEstimateId?: string | null
  estimateAction?: 'accept' | 'cancel' | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedStatus', value: FilterStatus): void
  (e: 'update:trackingNumber', value: string): void
  (e: 'reset-filter'): void
  (e: 'add-order'): void
  (e: 'edit-order', order: Order): void
  (e: 'estimate-action', orderId: string, action: 'accept' | 'cancel'): void
}>()

const { t, currentLanguage } = useI18n()
const { volumetricDivisor } = useSystemSettings()

// ── Estimate Confirm State ────────────────────────────────────────────────
const confirmingEstimate = ref<{ orderId: string; action: 'accept' | 'cancel' } | null>(null)

const confirmingOrder = computed<Order | null>(() => {
  if (!confirmingEstimate.value) return null
  return props.orders.find(o => o.id === confirmingEstimate.value?.orderId) || null
})

const showEstimateConfirm = (orderId: string, action: 'accept' | 'cancel') => {
  confirmingEstimate.value = { orderId, action }
}

const dismissEstimateConfirm = () => {
  confirmingEstimate.value = null
}

const handleConfirmEstimate = (orderId: string, action: 'accept' | 'cancel') => {
  confirmingEstimate.value = null
  emit('estimate-action', orderId, action)
}

const isEstimateProcessing = (orderId: string): boolean => {
  return props.processingEstimateId === orderId
}

// ── QR Modal State ────────────────────────────────────────────────────────
const isQrModalOpen = ref(false)
const selectedQrOrder = ref<Order | null>(null)

const openQrModal = (order: Order) => {
  selectedQrOrder.value = order
  isQrModalOpen.value = true
}

const closeQrModal = () => {
  isQrModalOpen.value = false
  selectedQrOrder.value = null
}

// ── Formatters & Helpers ──────────────────────────────────────────────────
const formatOfficeLabel = (office: { city?: string; province?: string; country?: { enName?: string; hyName?: string; ruName?: string } } | undefined): string => {
  if (!office) return '—'
  const country = office.country
  const countryName = currentLanguage.value === 'hy'
    ? (country?.hyName || country?.enName || '')
    : currentLanguage.value === 'ru'
      ? (country?.ruName || country?.enName || '')
      : (country?.enName || '')

  return [office.city, office.province, countryName].filter(Boolean).join(', ')
}

const formatCurrency = (price: number, currency: string): string => {
  return `${price.toLocaleString()} ${currency}`
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString(
    currentLanguage.value === 'hy' ? 'hy-AM' : currentLanguage.value === 'ru' ? 'ru-RU' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  )
}

const isOrderLocked = (status: string): boolean => {
  return status === 'DELIVERED' || status === 'CANCELLED' || status === 'REJECTED'
}

const getOrderActionTooltip = (status: string): string => {
  if (status === 'REGISTERED') return t('orders.editOrder')
  if (isOrderLocked(status)) return t('orders.cannotEdit')
  return t('orders.editReceiver')
}

const isPendingWithEstimate = (order: Order): boolean => {
  return order.status === 'PENDING_ESTIMATE' && order.estimatedPrice != null
}

const isPendingWithoutEstimate = (order: Order): boolean => {
  return order.status === 'PENDING_ESTIMATE' && order.estimatedPrice == null
}

const getChargeableWeight = (order: Order): number => {
  const actual = Number(order.weight) || 0
  const l = Number(order.length) || 0
  const w = Number(order.width) || 0
  const h = Number(order.height) || 0
  const div = volumetricDivisor.value || 5000
  const vol = (l > 0 && w > 0 && h > 0) ? (l * w * h) / div : 0
  if (vol > 0 && actual > 0) {
    return Math.round(Math.max(actual, vol) * 100) / 100
  }
  return Math.round((actual || vol || 0) * 100) / 100
}

const getBillableWeight = (order: Order): number => {
  if (order.billableWeight !== undefined && order.billableWeight !== null && Number(order.billableWeight) > 0) {
    return Number(order.billableWeight)
  }
  const chargeable = getChargeableWeight(order)
  return Math.max(chargeable, 5)
}

const getCalculatedPrice = (order: Order): number | null => {
  if (order.totalPrice !== undefined && order.totalPrice !== null && Number(order.totalPrice) > 0) {
    return Number(order.totalPrice)
  }
  if (order.price !== undefined && order.price !== null && Number(order.price) > 0) {
    return Number(order.price)
  }
  const rate = Number(order.tariffRateAtBooking || order.estimatedPrice)
  if (!rate || rate <= 0) return null
  const weight = getBillableWeight(order)
  if (!weight || weight <= 0) return null
  return Math.round(weight * rate * 100) / 100
}
</script>

