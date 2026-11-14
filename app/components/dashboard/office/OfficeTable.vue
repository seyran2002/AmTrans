<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3 py-4">
      <div v-for="i in 4" :key="i" class="h-16 bg-slate-50 rounded-2xl animate-pulse w-full"></div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!isLoading && offices.length === 0"
      :title="t('office.emptyOfficesTitle')"
      :subtitle="t('office.emptyOfficesSubtitle')"
      :action-text="t('office.addOffice')"
      action-variant="secondary"
      @action="$emit('add')"
    >
      <template #icon>
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 10V11m0 0h6M11 11H5" />
        </svg>
      </template>
    </EmptyState>

    <!-- Offices Table -->
    <div v-else class="overflow-x-auto -mx-6 sm:mx-0">
      <table class="w-full text-left border-collapse min-w-[850px]">
        <thead>
          <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
            <th class="py-4 px-6 rounded-l-2xl">{{ t('office.country') }}</th>
            <th class="py-4 px-6">City & Province</th>
            <th class="py-4 px-6">{{ t('office.fullAddress') }}</th>
            <th class="py-4 px-6">{{ t('office.postalCode') }}</th>
            <th class="py-4 px-6">{{ t('office.phone') }}</th>
            <th
              :class="[
                'py-4 px-6 text-center',
                !isAdmin ? 'rounded-r-2xl' : ''
              ]"
            >
              {{ t('office.operatorsColumn') }}
            </th>
            <th v-if="isAdmin" class="py-4 px-6 text-right rounded-r-2xl">{{ t('office.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm font-medium text-slate-700">
          <tr
            v-for="office in offices"
            :key="office.id"
            class="hover:bg-slate-50/80 transition-colors group"
          >
            <!-- Country -->
            <td class="py-4 px-6 font-bold text-slate-900">
              <div class="flex items-center gap-2.5">
                <div class="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm overflow-hidden shrink-0">
                  <img
                    v-if="getCountryFlag(findOfficeCountry(countries, office.countryId)) && isFlagImageUrl(getCountryFlag(findOfficeCountry(countries, office.countryId)))"
                    :src="getCountryFlag(findOfficeCountry(countries, office.countryId))!"
                    alt="Flag"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ getCountryFlag(findOfficeCountry(countries, office.countryId)) || '🏳️' }}</span>
                </div>
                <span class="text-sm font-bold text-slate-900">
                  {{ findOfficeCountry(countries, office.countryId) ? getCountryName(findOfficeCountry(countries, office.countryId)!, currentLanguage) : '—' }}
                </span>
              </div>
            </td>

            <!-- City & Province -->
            <td class="py-4 px-6">
              <div class="font-bold text-slate-900">{{ office.city }}</div>
              <div class="text-xs text-slate-500 font-medium">{{ office.province }}</div>
            </td>

            <!-- Full Address -->
            <td class="py-4 px-6 text-slate-700 max-w-xs truncate" :title="office.fullAddress">
              {{ office.fullAddress }}
            </td>

            <!-- Postal Code -->
            <td class="py-4 px-6">
              <span class="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {{ office.postalCode }}
              </span>
            </td>

            <!-- Phone -->
            <td class="py-4 px-6 font-semibold text-slate-800">
              {{ office.phone }}
            </td>

            <!-- Operators Count -->
            <td class="py-4 px-6 text-center">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ office.operators?.length ?? 0 }}
              </span>
            </td>

            <!-- Actions (ADMIN only) -->
            <td v-if="isAdmin" class="py-4 px-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <!-- Operators Button -->
                <button
                  type="button"
                  @click="$emit('operators', office)"
                  class="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"
                  :title="t('office.operators')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                <!-- Edit Button -->
                <button
                  type="button"
                  @click="$emit('edit', office)"
                  class="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"
                  :title="t('office.edit')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <!-- Delete Button -->
                <button
                  type="button"
                  @click="$emit('delete', office)"
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
import { getCountryName, getCountryFlag, isFlagImageUrl, findOfficeCountry } from '~/composables/useOfficeHelpers'
import EmptyState from '~/components/ui/EmptyState.vue'
import type { Country, Office } from '~/types/office'

defineProps<{
  offices: Office[]
  countries: Country[]
  isLoading: boolean
  currentLanguage: string
}>()

defineEmits<{
  (e: 'operators', office: Office): void
  (e: 'edit', office: Office): void
  (e: 'delete', office: Office): void
  (e: 'add'): void
}>()

const { t } = useI18n()
const { user: currentUser } = useAuth()
const isAdmin = computed(() => currentUser.value?.role?.toUpperCase() === 'ADMIN')
</script>
