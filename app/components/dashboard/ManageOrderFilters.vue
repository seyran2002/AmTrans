<template>
  <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
    <!-- Top Row: Main Filters Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      <!-- 1. Filter by User Code (Identifier Code) -->
      <div>
        <BaseInput
          id="filter-user-code"
          :model-value="filters.userCode"
          @update:model-value="filters.userCode = $event"
          :label="t('manageOrders.filterCode')"
          :placeholder="t('manageOrders.filterCodePlaceholder')"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
          </template>
        </BaseInput>
      </div>

      <!-- 2. Filter by Document Type -->
      <div>
        <BaseSelect
          id="filter-doc-type"
          :model-value="filters.documentType"
          @update:model-value="filters.documentType = $event"
          :label="t('manageOrders.filterDocType')"
          :options="documentTypeOptions"
        />
      </div>

      <!-- 3. Filter by Document Number -->
      <div>
        <BaseInput
          id="filter-doc-number"
          :model-value="filters.documentNumber"
          @update:model-value="filters.documentNumber = $event"
          :label="t('manageOrders.filterDocNumber')"
          :placeholder="t('manageOrders.filterDocNumberPlaceholder')"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </template>
        </BaseInput>
      </div>

      <!-- 4. Filter by Tracking Number -->
      <div>
        <BaseInput
          id="filter-tracking-number"
          :model-value="filters.trackingNumber"
          @update:model-value="filters.trackingNumber = $event"
          :label="t('manageOrders.filterTracking')"
          :placeholder="t('manageOrders.filterTrackingPlaceholder')"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </template>
        </BaseInput>
      </div>

      <!-- 5. Quick Search Query (Order ID, names, phone) -->
      <div>
        <BaseInput
          id="filter-search-query"
          :model-value="filters.searchQuery"
          @update:model-value="filters.searchQuery = $event"
          :label="t('manageOrders.search')"
          :placeholder="t('manageOrders.searchPlaceholder')"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </BaseInput>
      </div>
    </div>

    <!-- Bottom Row: Status Filter Pills, Counts & Reset Action -->
    <div class="pt-2 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 flex-wrap">
      <!-- Status Pills -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">
          {{ t('manageOrders.filterStatus') }}:
        </span>

        <button
          type="button"
          @click="filters.status = ''"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
            filters.status === ''
              ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
          ]"
        >
          {{ t('manageOrders.allStatuses') }}
        </button>

        <button
          v-for="st in statusOptions"
          :key="st"
          type="button"
          @click="filters.status = st"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
            filters.status === st
              ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
          ]"
        >
          {{ t(`orders.status.${st}`) }}
        </button>
      </div>

      <!-- Right Action & Counts -->
      <div class="flex items-center gap-3 ml-auto">
        <!-- Results Counter -->
        <span class="text-xs font-semibold text-slate-500">
          <strong class="text-slate-800">{{ filteredCount }}</strong> / {{ totalCount }} {{ t('manageOrders.totalOrders').toLowerCase() }}
        </span>

        <!-- Reset Button (shown when any filter is active) -->
        <button
          v-if="activeCount > 0"
          type="button"
          @click="$emit('reset')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tertiary/10 text-tertiary hover:bg-tertiary/15 border border-tertiary/20 text-xs font-bold transition-all cursor-pointer active:scale-95"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{{ t('manageOrders.resetFilters') }}</span>
          <span class="px-1.5 py-0.2 rounded-full bg-tertiary text-white text-[10px]">
            {{ activeCount }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect, { type SelectOption } from '~/components/ui/BaseSelect.vue'
import type { ManageOrdersFilters } from '~/composables/useManageOrders'
import type { OrderStatus } from '~/types/order'

interface Props {
  filters: ManageOrdersFilters
  activeCount: number
  totalCount: number
  filteredCount: number
}

defineProps<Props>()
defineEmits<{
  (e: 'reset'): void
}>()

const { t } = useI18n()

const statusOptions: OrderStatus[] = [
  'UNDER_REVIEW',
  'PENDING_ESTIMATE',
  'REGISTERED',
  'CANCELLED',
  'REJECTED',
  'FOREIGN_WAREHOUSE',
  'IN_TRANSIT',
  'ARRIVED',
  'READY',  
  'DELIVERED'
]

const documentTypeOptions = computed<SelectOption[]>(() => [
  { value: '', label: t('manageOrders.allDocTypes') },
  { value: 'Passport', label: t('manageOrders.docPassport') },
  { value: 'IdCard', label: t('manageOrders.docIdCard') },
  { value: 'Biometric', label: t('manageOrders.docBiometric') }
])
</script>
