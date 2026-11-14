<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '~/composables/useI18n'
import { useOrders } from '~/composables/useOrders'
import { useTrackingFilter } from '~/composables/useTrackingFilter'
import { useSystemSettings } from '~/composables/useSystemSettings'
import { ordersService } from '~/services/orders.service'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import SuccessBanner from '~/components/ui/SuccessBanner.vue'
import OrdersHeader from '~/components/dashboard/orders/OrdersHeader.vue'
import OrdersTable from '~/components/dashboard/orders/OrdersTable.vue'
import OrderModal from '~/components/dashboard/OrderModal.vue'
import { ORDER_STATUSES, type Order, type OrderStatus, type FilterStatus, type CreateOrderPayload, type UpdateOrderPayload } from '~/types/order'

definePageMeta({
  middleware: ['auth', 'customer'],
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { fetchSettings } = useSystemSettings()
const {
  orders,
  isLoading,
  isSubmitting,
  error,
  clearMessages,
  fetchMyOrders,
  createOrder,
  updateOrder
} = useOrders()

// ── Status & Tracking Filter ───────────────────────────────────────────
const selectedStatus = ref<FilterStatus>('ALL')
const trackingNumber = ref('')

const statusCounts = computed<Partial<Record<OrderStatus, number>>>(() => {
  const counts: Partial<Record<OrderStatus, number>> = {}
  orders.value.forEach((o) => {
    if (o.status) {
      counts[o.status] = (counts[o.status] || 0) + 1
    }
  })
  return counts
})

const statusFilteredOrders = computed<Order[]>(() => {
  if (selectedStatus.value === 'ALL') {
    return orders.value
  }
  return orders.value.filter((o) => o.status === selectedStatus.value)
})

const filteredOrders = useTrackingFilter(statusFilteredOrders, trackingNumber)

const resetFilter = () => {
  selectedStatus.value = 'ALL'
  trackingNumber.value = ''
}

watch(selectedStatus, (newVal) => {
  router.replace({
    query: {
      ...route.query,
      status: newVal === 'ALL' ? undefined : newVal
    }
  })
})

// ── Modal state ───────────────────────────────────────────────────────────
const isOrderModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)

// ── Page-level notifications ──────────────────────────────────────────────
const pageSuccessMessage = ref<string | null>(null)
const pageErrorMessage = ref<string | null>(null)

const showNotification = (msg: string, isError = false) => {
  if (isError) {
    pageErrorMessage.value = msg
    setTimeout(() => { pageErrorMessage.value = null }, 5000)
  } else {
    pageSuccessMessage.value = msg
    setTimeout(() => { pageSuccessMessage.value = null }, 4000)
  }
}

// ── Handlers ─────────────────────────────────────────────────────────────
const handleOpenModal = () => {
  clearMessages()
  selectedOrder.value = null
  isOrderModalOpen.value = true
}

const handleEditOrder = (order: Order) => {
  clearMessages()
  selectedOrder.value = order
  isOrderModalOpen.value = true
}

const handleCloseModal = () => {
  isOrderModalOpen.value = false
  selectedOrder.value = null
}

const handleSaveOrder = async (payload: CreateOrderPayload | UpdateOrderPayload) => {
  clearMessages()
  if (selectedOrder.value) {
    const updated = await updateOrder(selectedOrder.value.id, payload)
    if (updated) {
      isOrderModalOpen.value = false
      selectedOrder.value = null
      showNotification(t('orders.updateSuccess'))
      await fetchMyOrders()
    }
  } else {
    const created = await createOrder(payload as CreateOrderPayload)
    if (created) {
      isOrderModalOpen.value = false
      showNotification(t('orders.createSuccess'))
      await fetchMyOrders()
    }
  }
}

// ── Estimate Approval ─────────────────────────────────────────────────────
const processingEstimateId = ref<string | null>(null)
const estimateAction = ref<'accept' | 'cancel' | null>(null)

const handleEstimateAction = async (orderId: string, action: 'accept' | 'cancel') => {
  if (processingEstimateId.value) return
  processingEstimateId.value = orderId
  estimateAction.value = action

  try {
    if (action === 'accept') {
      await ordersService.acceptEstimate(orderId)
      showNotification(t('orders.estimateAccepted'))
    } else {
      await ordersService.cancelEstimate(orderId)
      showNotification(t('orders.estimateCancelled'))
    }
    await fetchMyOrders()
  } catch (err: any) {
    const msg = err?.data?.message || err?.message || t('auth.unknownError')
    showNotification(msg, true)
  } finally {
    processingEstimateId.value = null
    estimateAction.value = null
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(() => {
  const queryStatus = route.query.status as string
  if (queryStatus && ORDER_STATUSES.includes(queryStatus as OrderStatus)) {
    selectedStatus.value = queryStatus as OrderStatus
  }
  fetchSettings()
  fetchMyOrders()
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 [&>.popup]:!mt-0">
    <!-- ── Header ────────────────────────────────────────────────────────── -->
    <OrdersHeader @add-order="handleOpenModal" />

    <!-- ── Notifications ─────────────────────────────────────────────────── -->
    <SuccessBanner
      v-if="pageSuccessMessage"
      :title="pageSuccessMessage"
    />
    <AlertBanner
      v-if="pageErrorMessage || error"
      :message="pageErrorMessage || error"
    />

    <!-- ── Orders Table & Filter Card ────────────────────────────────────── -->
    <OrdersTable
      :orders="orders"
      :filtered-orders="filteredOrders"
      :is-loading="isLoading"
      :selected-status="selectedStatus"
      :tracking-number="trackingNumber"
      :status-counts="statusCounts"
      :processing-estimate-id="processingEstimateId"
      :estimate-action="estimateAction"
      @update:selected-status="selectedStatus = $event"
      @update:tracking-number="trackingNumber = $event"
      @reset-filter="resetFilter"
      @add-order="handleOpenModal"
      @edit-order="handleEditOrder"
      @estimate-action="handleEstimateAction"
    />

    <!-- ── Order Modal (Create / Edit) ─────────────────────────────────── -->
    <OrderModal
      :is-open="isOrderModalOpen"
      :order="selectedOrder"
      :is-submitting="isSubmitting"
      :error="error"
      @close="handleCloseModal"
      @submit="handleSaveOrder"
    />
  </div>
</template>
