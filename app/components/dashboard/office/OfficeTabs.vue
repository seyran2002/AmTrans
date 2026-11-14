<template>
  <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
    <!-- Tabs Switcher -->
    <div class="inline-flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60 self-start">
      <button
        type="button"
        @click="$emit('update:activeTab', 'countries')"
        :class="[
          'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2.5 cursor-pointer',
          activeTab === 'countries'
            ? 'bg-white text-primary shadow-sm border border-slate-200/80'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2 0 012-2h1.065M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
        <span>{{ t('office.tabCountries') }}</span>
        <span
          :class="[
            'px-2 py-0.5 rounded-full text-[11px] font-extrabold transition-colors',
            activeTab === 'countries' ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-600'
          ]"
        >
          {{ countriesCount }}
        </span>
      </button>

      <button
        type="button"
        @click="$emit('update:activeTab', 'offices')"
        :class="[
          'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2.5 cursor-pointer',
          activeTab === 'offices'
            ? 'bg-white text-primary shadow-sm border border-slate-200/80'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 10V11m0 0h6M11 11H5" />
        </svg>
        <span>{{ t('office.tabOffices') }}</span>
        <span
          :class="[
            'px-2 py-0.5 rounded-full text-[11px] font-extrabold transition-colors',
            activeTab === 'offices' ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-600'
          ]"
        >
          {{ officesCount }}
        </span>
      </button>
    </div>

    <!-- Search Input & Filters -->
    <div class="flex flex-col sm:flex-row items-center gap-3">
      <!-- Country Filter Dropdown (Offices tab only) -->
      <div v-if="activeTab === 'offices'" class="w-full sm:w-48">
        <select
          :value="selectedCountryFilter"
          @change="$emit('update:selectedCountryFilter', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Countries</option>
          <option v-for="c in countries" :key="c.id" :value="c.id">
            {{ getCountryName(c, currentLanguage) }}
          </option>
        </select>
      </div>

      <!-- Search Query Input -->
      <div class="relative w-full sm:w-64">
        <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search..."
          class="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import { getCountryName } from '~/composables/useOfficeHelpers'
import type { Country } from '~/types/office'

defineProps<{
  activeTab: 'countries' | 'offices'
  countriesCount: number
  officesCount: number
  countries: Country[]
  searchQuery: string
  selectedCountryFilter: string
  currentLanguage: string
}>()

defineEmits<{
  (e: 'update:activeTab', tab: 'countries' | 'offices'): void
  (e: 'update:searchQuery', query: string): void
  (e: 'update:selectedCountryFilter', countryId: string): void
}>()

const { t } = useI18n()
</script>
