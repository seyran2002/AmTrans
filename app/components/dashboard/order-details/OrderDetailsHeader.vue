<template>
  <div class="flex flex-col gap-4">
    <!-- ── Top Navigation & Back Button ──────────────────────────────────── -->
    <div class="flex items-center justify-between gap-3">
      <NuxtLink
        to="/dashboard/manage-orders"
        class="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary transition-colors bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 group"
      >
        <svg class="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{{ t('manageOrders.backToOrders') }}</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <BaseButton
          type="button"
          variant="outline"
          size="sm"
          :disabled="isLoading || isUpdating"
          @click="$emit('refresh')"
        >
          <svg
            :class="['w-3.5 h-3.5 text-primary shrink-0', (isLoading || isUpdating) ? 'animate-spin' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="hidden sm:inline">Refresh</span>
        </BaseButton>
      </div>
    </div>

    <!-- ── Status Update Error Alert ────────────────────────────────────── -->
    <div
      v-if="updateError"
      class="flex items-center justify-between text-xs font-semibold text-tertiary bg-red-50 border border-red-200/90 rounded-2xl p-3.5 animate-fade-in shadow-2xs"
    >
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ updateError }}</span>
      </div>
      <button
        type="button"
        @click="updateError = null"
        class="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </div>

    <!-- ── Main Header Card ──────────────────────────────────────────────── -->
    <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="space-y-2">
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
            {{ t('manageOrders.orderDetailsTitle') }}
          </h1>

          <!-- Order ID Pill + Copy button -->
          <div class="inline-flex items-center gap-1.5 bg-slate-100/90 px-2.5 py-1 rounded-xl border border-slate-200/80">
            <span class="font-mono text-xs font-bold text-slate-700 select-all">
              #{{ order.id }}
            </span>
            <button
              type="button"
              @click="copyOrderId"
              class="text-slate-400 hover:text-primary transition-colors p-0.5 cursor-pointer rounded"
              :title="copied ? t('manageOrders.copied') : t('manageOrders.copyLink')"
            >
              <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>

          <!-- Status Badge -->
          <OrderStatusBadge :status="order.status" size="md" />

          <!-- Status Change Select -->
          <div class="relative inline-flex items-center gap-2">
            <div
              class="relative inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/90 transition-all rounded-xl border border-slate-200/90 shadow-2xs px-2.5 py-1 text-xs font-bold text-slate-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary group"
              :class="{ 'opacity-60 pointer-events-none': isUpdating || isLoading }"
            >
              <!-- Icon / Spinner -->
              <svg
                v-if="isUpdating"
                class="w-3.5 h-3.5 text-primary animate-spin shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <svg
                v-else
                class="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>

              <!-- Native Select Styled -->
              <select
                id="order-status-select"
                :value="order.status"
                :disabled="isUpdating || isLoading"
                aria-label="Change order status"
                @change="handleStatusChange(($event.target as HTMLSelectElement).value as OrderStatus)"
                class="bg-transparent text-xs font-extrabold text-slate-800 pr-4 pl-0.5 py-0.5 cursor-pointer focus:outline-none appearance-none disabled:cursor-not-allowed"
              >
                <option v-if="order.status === 'CANCELLED'" value="CANCELLED" disabled>
                  {{ t('orders.status.CANCELLED') }} ({{ t('manageOrders.userOnly') }})
                </option>
                <option
                  v-for="st in statusOptions"
                  :key="st"
                  :value="st"
                  :disabled="order.status === 'PENDING_ESTIMATE' && st === 'REGISTERED'"
                  class="text-slate-800 font-medium py-1"
                >
                  {{ t(`orders.status.${st}`) }}
                </option>
              </select>

              <!-- Chevron Down Arrow -->
              <svg
                class="w-3.5 h-3.5 text-slate-400 group-hover:text-primary pointer-events-none -ml-3.5 shrink-0 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Success indicator pill -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <span
                v-if="updateSuccess"
                class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-2 py-0.5 rounded-lg shadow-2xs"
              >
                <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ t('manageOrders.statusUpdated') }}</span>
              </span>
            </transition>
          </div>
        </div>

        <!-- Timestamps -->
        <div class="flex items-center gap-4 text-xs text-slate-500 font-medium flex-wrap">
          <span class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ t('manageOrders.createdAt') }}: <strong class="text-slate-700">{{ formatDate(order.createdAt) }}</strong>
          </span>

          <span v-if="order.updatedAt" class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ t('manageOrders.updatedAt') }}: <strong class="text-slate-700">{{ formatDate(order.updatedAt) }}</strong>
          </span>
        </div>
      </div>

      <!-- Price Highlights -->
      <div class="text-left md:text-right p-3.5 sm:p-4 rounded-2xl bg-primary/5 border border-primary/10 shrink-0 w-full md:w-auto">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          {{ t('manageOrders.transitPrice') }}
        </span>
        <div class="text-xl sm:text-2xl font-black text-primary tracking-tight">
          {{ order.price && Number(order.price) ? formatPrice(order.price, "AMD") : '—' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useApi } from '~/composables/useApi'
import BaseButton from '~/components/ui/BaseButton.vue'
import OrderStatusBadge from '~/components/dashboard/OrderStatusBadge.vue'
import type { Order, OrderStatus } from '~/types/order'

interface Props {
  order: Order
  isLoading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'updated', order: Order): void
}>()

const { t, currentLanguage } = useI18n()
const { apiFetch } = useApi()

const copied = ref(false)
const isUpdating = ref(false)
const updateError = ref<string | null>(null)
const updateSuccess = ref(false)

const statusOptions: OrderStatus[] = [
  'UNDER_REVIEW',
  'PENDING_ESTIMATE',
  'REGISTERED',
  'REJECTED',
  'FOREIGN_WAREHOUSE',
  'IN_TRANSIT',
  'ARRIVED',
  'READY',
  'DELIVERED'
]

const handleStatusChange = async (newStatus: OrderStatus) => {
  if (!newStatus || newStatus === props.order.status || isUpdating.value) {
    return
  }

  // Operators cannot register an order directly from PENDING_ESTIMATE without customer approval
  if (props.order.status === 'PENDING_ESTIMATE' && newStatus === 'REGISTERED') {
    updateError.value = t('manageOrders.errCustomerApprovalRequired')
    return
  }

  isUpdating.value = true
  updateError.value = null
  updateSuccess.value = false

  try {
    const updatedOrder = await apiFetch<Order>(`/orders/${props.order.id}/status`, {
      method: 'PATCH',
      body: { status: newStatus }
    })

    updateSuccess.value = true
    setTimeout(() => {
      updateSuccess.value = false
    }, 2500)

    if (updatedOrder) {
      emit('updated', updatedOrder)
    }
    emit('refresh')
  } catch (err: any) {
    const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
    updateError.value = Array.isArray(serverMsg)
      ? serverMsg.join(', ')
      : (typeof serverMsg === 'string' ? serverMsg : 'Failed to update order status.')
  } finally {
    isUpdating.value = false
  }
}

const copyOrderId = async () => {
  try {
    await navigator.clipboard.writeText(props.order.id)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // fallback
  }
}

const formatPrice = (price: number, currency: string): string => {
  return `${Number(price).toLocaleString()} ${currency}`
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString(
    currentLanguage.value === 'hy' ? 'hy-AM' : currentLanguage.value === 'ru' ? 'ru-RU' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  )
}
</script>
