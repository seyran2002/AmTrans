<template>
  <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 flex-wrap">
    <div class="w-full lg:w-auto">
      <!-- Mobile Select -->
      <div class="sm:hidden w-full">
        <label for="order-status-filter-mobile" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          {{ t('orders.filterByStatus') }}
        </label>
        <div class="relative">
          <select
            id="order-status-filter-mobile"
            :value="selectedStatus"
            @change="$emit('update:selectedStatus', ($event.target as HTMLSelectElement).value as FilterStatus)"
            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer pr-10"
          >
            <option value="ALL">{{ t('orders.allStatuses') }} ({{ totalOrders }})</option>
            <option
              v-for="st in ORDER_STATUSES"
              :key="st"
              :value="st"
            >
              {{ t(`orders.status.${st}`) }} ({{ statusCounts[st] || 0 }})
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Desktop / Tablet Pills -->
      <div class="hidden sm:flex items-center gap-1.5 flex-wrap">
        <span class="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {{ t('orders.filterByStatus') }}:
        </span>

        <!-- All Pill -->
        <button
          type="button"
          @click="$emit('update:selectedStatus', 'ALL')"
          :class="[
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
            selectedStatus === 'ALL'
              ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          ]"
        >
          <span>{{ t('orders.allStatuses') }}</span>
          <span
            :class="[
              'px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-colors',
              selectedStatus === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
            ]"
          >
            {{ totalOrders }}
          </span>
        </button>

        <!-- Status Pills -->
        <button
          v-for="st in ORDER_STATUSES"
          :key="st"
          type="button"
          @click="$emit('update:selectedStatus', st)"
          :class="[
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
            selectedStatus === st
              ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          ]"
        >
          <span>{{ t(`orders.status.${st}`) }}</span>
          <span
            v-if="(statusCounts[st] || 0) > 0"
            :class="[
              'px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-colors',
              selectedStatus === st ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
            ]"
          >
            {{ statusCounts[st] }}
          </span>
        </button>
      </div>
    </div>

    <!-- Right: Tracking Filter & Reset Action -->
    <div class="flex items-center gap-3 w-full lg:w-auto lg:ml-auto justify-between lg:justify-end flex-wrap sm:flex-nowrap">
      <!-- Tracking Number Search Input -->
      <div class="relative w-full sm:w-60">
        <input
          id="order-tracking-filter"
          type="text"
          :value="activeTracking"
          @input="onTrackingInput(($event.target as HTMLInputElement).value)"
          :placeholder="t('orders.filterByTracking')"
          class="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 placeholder:font-normal"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          v-if="activeTracking"
          type="button"
          @click="onTrackingInput('')"
          class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
          aria-label="Clear tracking search"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Active Filter Status and Reset Action -->
      <div v-if="hasActiveFilter" class="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0">
        <span class="text-xs font-semibold text-slate-500">
          <strong class="text-slate-900">{{ filteredCount }}</strong> / {{ totalOrders }}
        </span>
        <button
          type="button"
          @click="$emit('reset-filter')"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer active:scale-95"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{{ t('orders.clearFilter') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { ORDER_STATUSES, type OrderStatus, type FilterStatus } from '~/types/order'

interface Props {
  selectedStatus: FilterStatus
  statusCounts: Partial<Record<OrderStatus, number>>
  totalOrders: number
  filteredCount: number
  trackingNumber?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  trackingNumber: '',
  modelValue: ''
})

const emit = defineEmits<{
  (e: 'update:selectedStatus', value: FilterStatus): void
  (e: 'update:trackingNumber', value: string): void
  (e: 'update:modelValue', value: string): void
  (e: 'reset-filter'): void
}>()

const { t } = useI18n()

const activeTracking = computed(() => props.trackingNumber || props.modelValue || '')

const hasActiveFilter = computed(() => {
  return props.selectedStatus !== 'ALL' || Boolean(activeTracking.value.trim())
})

const onTrackingInput = (val: string) => {
  emit('update:trackingNumber', val)
  emit('update:modelValue', val)
}
</script>
