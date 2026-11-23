<template>
  <div class="max-w-7xl mx-auto space-y-4 sm:space-y-6 [&>.popup]:!mt-0">

    <!-- ── Page Header ──────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-primary tracking-tight leading-tight">
          {{ t('manageOrders.title') }}
        </h1>
        <p class="text-slate-500 text-xs sm:text-sm font-medium mt-0.5 sm:mt-1">
          {{ t('manageOrders.subtitle') }}
        </p>
      </div>

      <!-- Office Selector & Refresh Action -->
      <div class="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto flex-wrap">
        <!-- Office Selector (For ADMIN or when multiple offices available) -->
        <div v-if="availableOffices.length > 1 || isAdmin" class="w-full sm:w-auto sm:min-w-[220px]">
          <BaseSelect
            id="manage-office-select"
            :model-value="activeOfficeId || ''"
            @update:model-value="handleOfficeChange"
            :options="officeSelectOptions"
            :placeholder="t('manageOrders.selectOffice')"
          />
        </div>

        <!-- Single Office Badge (When user has 1 assigned office and is not switching) -->
        <div
          v-else-if="activeOffice"
          class="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-2 text-xs font-bold text-slate-800"
        >
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span class="text-slate-400 font-medium">{{ t('manageOrders.office') }}:</span>
          <span>{{ formatOfficeName(activeOffice) }}</span>
        </div>

        <!-- Refresh Button -->
        <BaseButton
          type="button"
          variant="outline"
          size="md"
          :disabled="isLoading || !activeOfficeId"
          class="w-full sm:w-auto !min-h-[40px] sm:!min-h-[44px]"
          @click="handleRefresh"
        >
          <svg
            :class="['w-4 h-4 text-primary shrink-0', isLoading ? 'animate-spin' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="inline">Refresh</span>
        </BaseButton>
      </div>
    </div>

    <!-- ── Error Banner ─────────────────────────────────────────────────── -->
    <AlertBanner v-if="error" :message="error" />

    <!-- ── No Office Assigned Warning ────────────────────────────────────── -->
    <div
      v-if="!activeOfficeId && !isLoading"
      class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-50/80 border border-amber-200 text-amber-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
    >
      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-bold text-amber-950 mb-0.5">
          {{ t('manageOrders.noOfficeAssigned') }}
        </h3>
        <p class="text-xs text-amber-800 leading-relaxed">
          {{ t('manageOrders.noOfficeAssignedHint') }}
        </p>
      </div>
    </div>

    <!-- ── Filters Component ─────────────────────────────────────────────── -->
    <ManageOrderFilters
      v-if="activeOfficeId"
      :filters="filters"
      :active-count="activeFiltersCount"
      :total-count="orders.length"
      :filtered-count="filteredOrders.length"
      @reset="resetFilters"
    />

    <!-- ── Loading Skeleton Grid ─────────────────────────────────────────── -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="h-80 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 animate-pulse space-y-4"
      >
        <div class="flex justify-between items-center">
          <div class="h-5 w-24 bg-slate-100 rounded-lg" />
          <div class="h-6 w-20 bg-slate-100 rounded-full" />
        </div>
        <div class="h-16 bg-slate-50 rounded-2xl" />
        <div class="space-y-2">
          <div class="h-4 w-3/4 bg-slate-100 rounded" />
          <div class="h-3 w-1/2 bg-slate-100 rounded" />
        </div>
        <div class="h-20 bg-slate-50 rounded-2xl" />
      </div>
    </div>

    <!-- ── Empty State: Filtered Out ─────────────────────────────────────── -->
    <div
      v-else-if="activeOfficeId && orders.length > 0 && filteredOrders.length === 0"
      class="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto"
    >
      <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-primary/20">
        <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </div>
      <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-1">
        {{ t('manageOrders.emptyTitle') }}
      </h3>
      <p class="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6 leading-relaxed max-w-sm mx-auto">
        {{ t('manageOrders.emptyFilteredSubtitle') }}
      </p>
      <BaseButton
        type="button"
        variant="secondary"
        size="md"
        :block="false"
        class="w-full sm:w-auto !min-h-[40px] sm:!min-h-[44px]"
        @click="resetFilters"
      >
        <svg class="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>{{ t('manageOrders.resetFilters') }}</span>
      </BaseButton>
    </div>

    <!-- ── Empty State: No Orders in this Office ─────────────────────────── -->
    <div
      v-else-if="activeOfficeId && orders.length === 0"
      class="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto"
    >
      <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-primary/20">
        <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-1">
        {{ t('manageOrders.emptyTitle') }}
      </h3>
      <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
        {{ t('manageOrders.emptySubtitle') }}
      </p>
    </div>

    <!-- ── Orders Cards Grid ─────────────────────────────────────────────── -->
    <div
      v-else-if="filteredOrders.length > 0"
      class="space-y-4 sm:space-y-6 [&>.popup]:!mt-0"
    >
      <!-- ── Highlighted Pending Tariff Estimates Section ──────────────────── -->
      <div
        v-if="pendingEstimateOrders.length > 0"
        class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-primary/[0.04] border-2 border-amber-300/80 shadow-sm space-y-3 sm:space-y-4"
      >
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300/80 shadow-2xs">
              <svg class="w-5 h-5 text-amber-700 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base sm:text-lg font-black text-amber-950 tracking-tight">
                  {{ t('manageOrders.pendingEstimatesTitle') }}
                </h2>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-white shadow-2xs">
                  {{ pendingEstimateOrders.length }}
                </span>
              </div>
              <p class="text-xs text-amber-900/80 font-medium mt-0.5">
                {{ t('manageOrders.pendingEstimatesSubtitle') }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-6">
          <ManageOrderCard
            v-for="order in pendingEstimateOrders"
            :key="order.id"
            :order="order"
          />
        </div>
      </div>

      <!-- ── Standard / Other Orders Section ──────────────────────────────── -->
      <div
        v-if="standardOrders.length > 0"
        class="space-y-3 sm:space-y-4"
      >
        <h3
          v-if="pendingEstimateOrders.length > 0"
          class="text-xs font-bold uppercase tracking-wider text-slate-500 px-1"
        >
          {{ t('manageOrders.allOtherOrders') }} ({{ standardOrders.length }})
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-6">
          <ManageOrderCard
            v-for="order in standardOrders"
            :key="order.id"
            :order="order"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'
import { useOffices } from '~/composables/useOffices'
import { useManageOrders } from '~/composables/useManageOrders'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseSelect, { type SelectOption } from '~/components/ui/BaseSelect.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import ManageOrderFilters from '~/components/dashboard/ManageOrderFilters.vue'
import ManageOrderCard from '~/components/dashboard/ManageOrderCard.vue'
import type { Office } from '~/types/office'

definePageMeta({
  middleware: ['auth', 'admin-or-operator'],
  layout: 'dashboard'
})

const { user } = useAuth()
const { t, currentLanguage } = useI18n()
const { offices, fetchOffices } = useOffices()
const {
  orders,
  isLoading,
  error,
  filters,
  filteredOrders,
  activeFiltersCount,
  fetchOrdersByOffice,
  resetFilters
} = useManageOrders()

const pendingEstimateOrders = computed(() => {
  return filteredOrders.value.filter(o => o.status === 'PENDING_ESTIMATE')
})

const standardOrders = computed(() => {
  return filteredOrders.value.filter(o => o.status !== 'PENDING_ESTIMATE')
})

const activeOfficeId = ref<string | null>(null)

const isAdmin = computed(() => {
  return user.value?.role?.toUpperCase() === 'ADMIN'
})

const availableOffices = computed<Office[]>(() => {
  return offices.value || []
})

const activeOffice = computed<Office | undefined>(() => {
  if (!activeOfficeId.value) return undefined
  return availableOffices.value.find(o => o.id === activeOfficeId.value)
})

const formatOfficeName = (office?: Office): string => {
  if (!office) return '—'
  const country = office.country
  const countryName = currentLanguage.value === 'hy'
    ? (country?.hyName || country?.enName || '')
    : currentLanguage.value === 'ru'
      ? (country?.ruName || country?.enName || '')
      : (country?.enName || '')
  return [office.fullAddress, countryName].filter(Boolean).join(', ')
}

const officeSelectOptions = computed<SelectOption[]>(() => {
  return availableOffices.value.map(office => ({
    value: office.id,
    label: formatOfficeName(office)
  }))
})

const handleOfficeChange = async (newOfficeId: string) => {
  if (!newOfficeId || newOfficeId === activeOfficeId.value) return
  activeOfficeId.value = newOfficeId
  await fetchOrdersByOffice(newOfficeId)
}

const handleRefresh = async () => {
  if (activeOfficeId.value) {
    await fetchOrdersByOffice(activeOfficeId.value)
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(async () => {
  // 1. Fetch available offices (for display & selection)
  const allOffices = await fetchOffices()

  // 2. Resolve initial office ID:
  //    First priority: user's assigned officeId (e.g. for OPERATOR)
  //    Second priority: user.office?.id
  //    Third priority (if ADMIN): first office in system
  const userAssignedOfficeId = user.value?.officeId || user.value?.office?.id || null

  if (userAssignedOfficeId) {
    activeOfficeId.value = userAssignedOfficeId
  } else if (isAdmin.value && allOffices && allOffices.length > 0) {
    activeOfficeId.value = allOffices[0]?.id || "";
  }

  // 3. If officeId resolved and not null, fetch orders by office!
  if (activeOfficeId.value) {
    await fetchOrdersByOffice(activeOfficeId.value)
  }
})
</script>
