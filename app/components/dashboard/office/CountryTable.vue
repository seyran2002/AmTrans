<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3 py-4">
      <div v-for="i in 4" :key="i" class="h-16 bg-slate-50 rounded-2xl animate-pulse w-full"></div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!isLoading && countries.length === 0"
      :title="t('office.emptyCountriesTitle')"
      :subtitle="t('office.emptyCountriesSubtitle')"
      :action-text="t('office.addCountry')"
      action-variant="secondary"
      @action="$emit('add')"
    >
      <template #icon>
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2 0 012-2h1.065M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      </template>
    </EmptyState>

    <!-- Countries Table -->
    <div v-else class="overflow-x-auto -mx-6 sm:mx-0">
      <table class="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
            <th class="py-4 px-6 rounded-l-2xl">Country & Flag</th>
            <th class="py-4 px-6">Armenian (HY)</th>
            <th class="py-4 px-6">Russian (RU)</th>
            <th class="py-4 px-6">English (EN)</th>
            <th
              :class="[
                'py-4 px-6 text-center',
                !isAdmin ? 'rounded-r-2xl' : ''
              ]"
            >
              Offices
            </th>
            <th v-if="isAdmin" class="py-4 px-6 text-right rounded-r-2xl">{{ t('office.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm font-medium text-slate-700">
          <tr
            v-for="country in countries"
            :key="country.id"
            class="hover:bg-slate-50/80 transition-colors group"
          >
            <!-- Flag & Primary Display -->
            <td class="py-4 px-6 font-bold text-slate-900">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl overflow-hidden shrink-0 shadow-xs">
                  <img
                    v-if="getCountryFlag(country) && isFlagImageUrl(getCountryFlag(country))"
                    :src="getCountryFlag(country)!"
                    alt="Flag"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ getCountryFlag(country) || '🏳️' }}</span>
                </div>
                <div>
                  <div class="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{{ getCountryName(country, currentLanguage) }}</span>
                    <span
                      v-if="country.code"
                      class="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200"
                    >
                      {{ country.code }}
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <!-- Armenian Name -->
            <td class="py-4 px-6 font-medium text-slate-800">
              {{ country.hyName }}
            </td>

            <!-- Russian Name -->
            <td class="py-4 px-6 font-medium text-slate-800">
              {{ country.ruName }}
            </td>

            <!-- English Name -->
            <td class="py-4 px-6 font-medium text-slate-800">
              {{ country.enName }}
            </td>

            <!-- Total Offices Count -->
            <td class="py-4 px-6 text-center">
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 10V11m0 0h6M11 11H5" />
                </svg>
                {{ countOfficesInCountry(offices, country.id) }}
              </span>
            </td>

            <!-- Actions (ADMIN only) -->
            <td v-if="isAdmin" class="py-4 px-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <!-- Delete Button -->
                <button
                  type="button"
                  @click="$emit('delete', country)"
                  class="p-2 text-slate-500 hover:text-tertiary hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  :title="t('office.delete')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useAuth } from '~/composables/useAuth'
import { getCountryName, getCountryFlag, isFlagImageUrl, countOfficesInCountry } from '~/composables/useOfficeHelpers'
import EmptyState from '~/components/ui/EmptyState.vue'
import type { Country, Office } from '~/types/office'

defineProps<{
  countries: Country[]
  offices: Office[]
  isLoading: boolean
  currentLanguage: string
}>()

defineEmits<{
  (e: 'delete', country: Country): void
  (e: 'add'): void
}>()

const { t } = useI18n()
const { user: currentUser } = useAuth()
const isAdmin = computed(() => currentUser.value?.role?.toUpperCase() === 'ADMIN')
</script>
