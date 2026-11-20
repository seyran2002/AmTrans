<template>
  <div class="max-w-7xl mx-auto space-y-4 sm:space-y-6 [&>.popup]:!mt-0">

    <!-- ── Loading Skeleton ────────────────────────────────────────────── -->
    <div v-if="isLoading" class="space-y-4 sm:space-y-6 [&>.popup]:!mt-0">
      <!-- Header skeleton -->
      <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 animate-pulse space-y-4">
        <div class="flex items-center gap-3">
          <div class="h-8 w-28 bg-slate-100 rounded-xl" />
          <div class="h-6 w-20 bg-slate-100 rounded-full" />
        </div>
        <div class="flex justify-between items-center">
          <div class="h-6 w-64 bg-slate-100 rounded-lg" />
          <div class="h-12 w-32 bg-slate-100 rounded-2xl" />
        </div>
      </div>

      <!-- Cards skeleton grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 animate-pulse space-y-4"
        >
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-slate-100 rounded-xl" />
            <div class="h-4 w-32 bg-slate-100 rounded" />
          </div>
          <div class="h-24 bg-slate-50 rounded-2xl" />
          <div class="space-y-2">
            <div class="h-3 w-3/4 bg-slate-100 rounded" />
            <div class="h-3 w-1/2 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Error State ─────────────────────────────────────────────────── -->
    <template v-else-if="error">
      <div class="flex items-center gap-3 mb-4">
        <NuxtLink
          :to="localePath('/dashboard/manage-orders')"
          class="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary transition-colors bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 group"
        >
          <svg class="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ t('manageOrders.backToOrders') }}</span>
        </NuxtLink>
      </div>
      <AlertBanner :message="error" />
    </template>

    <!-- ── Order Not Found ─────────────────────────────────────────────── -->
    <template v-else-if="!order">
      <div class="flex items-center gap-3 mb-4">
        <NuxtLink
          :to="localePath('/dashboard/manage-orders')"
          class="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary transition-colors bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 group"
        >
          <svg class="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ t('manageOrders.backToOrders') }}</span>
        </NuxtLink>
      </div>

      <EmptyState
        :title="t('manageOrders.orderNotFound')"
        :subtitle="t('manageOrders.orderNotFoundHint')"
        icon="package"
      />
    </template>

    <!-- ── Order Details Layout ────────────────────────────────────────── -->
    <template v-else>
      <!-- Header -->
      <OrderDetailsHeader
        :order="order"
        :is-loading="isLoading"
        @refresh="handleRefresh"
        @updated="handleOrderUpdated"
      />

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Left Column (2/3 width on lg) -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-6 [&>.popup]:!mt-0">
          <!-- Route Card -->
          <OrderRouteCard
            :from-office="order.fromOffice"
            :to-office="order.toOffice"
          />

          <!-- Package Details Card -->
          <OrderPackageCard :order="order" @updated="handlePackageUpdated" />

          <!-- Customer Card -->
          <OrderCustomerCard
            v-if="order.user"
            :owner="order.user"
          />

          <!-- Receivers Card -->
          <OrderReceiversCard
            v-if="order.user?.receivers"
            :receivers="order.user.receivers"
            :selected-receiver-id="order.receiverId"
          />
        </div>

        <!-- Right Column (1/3 width on lg) -->
        <div class="space-y-4 sm:space-y-6 [&>.popup]:!mt-0">
          <!-- QR Code & Invoice Card -->
          <OrderQrCard :order="order" />
        </div>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useManageOrders } from '~/composables/useManageOrders'
import { useI18n } from '~/composables/useI18n'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import OrderDetailsHeader from '~/components/dashboard/order-details/OrderDetailsHeader.vue'
import OrderRouteCard from '~/components/dashboard/order-details/OrderRouteCard.vue'
import OrderPackageCard from '~/components/dashboard/order-details/OrderPackageCard.vue'
import OrderQrCard from '~/components/dashboard/order-details/OrderQrCard.vue'
import OrderCustomerCard from '~/components/dashboard/order-details/OrderCustomerCard.vue'
import OrderReceiversCard from '~/components/dashboard/order-details/OrderReceiversCard.vue'

definePageMeta({
  middleware: ['auth', 'admin-or-operator'],
  layout: 'dashboard'
})

const localePath = useLocalePath()
const route = useRoute()
const { t } = useI18n()
const {
  currentOrder: order,
  isLoading,
  error,
  fetchOrderById
} = useManageOrders()

const orderId = route.params.orderId as string

const handleRefresh = async () => {
  await fetchOrderById(orderId)
}

const handleOrderUpdated = (updatedOrder: any) => {
  if (order.value && updatedOrder) {
    order.value = { ...order.value, ...updatedOrder }
  }
}

const handlePackageUpdated = async () => {
  await fetchOrderById(orderId)
}

onMounted(async () => {
  await fetchOrderById(orderId)
})
</script>
