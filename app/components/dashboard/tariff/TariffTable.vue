<template>
  <div>
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-3 py-4">
      <div v-for="i in 3" :key="i" class="h-16 bg-slate-50 rounded-2xl animate-pulse w-full" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!isLoading && tariffs.length === 0"
      :title="t('tariffs.emptyTitle')"
      :subtitle="t('tariffs.emptySubtitle')"
      :action-text="t('tariffs.addTariff')"
      action-variant="secondary"
      @action="$emit('add')"
    >
      <template #icon>
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </template>
    </EmptyState>

    <!-- Tariffs Table -->
    <div v-else class="overflow-x-auto -mx-6 sm:mx-0">
      <table class="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
            <th class="py-4 px-6 rounded-l-2xl">{{ t('tariffs.originOffice') }}</th>
            <th class="py-4 px-6">{{ t('tariffs.destinationOffice') }}</th>
            <th class="py-4 px-6">{{ t('tariffs.pricePerKg') }}</th>
            <th class="py-4 px-6 text-right rounded-r-2xl">{{ t('tariffs.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm font-medium text-slate-700">
          <tr
            v-for="tariff in tariffs"
            :key="tariff.id"
            class="hover:bg-slate-50/80 transition-colors group"
          >
            <!-- Origin Office -->
            <td class="py-4 px-6">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm overflow-hidden shrink-0">
                  <img
                    v-if="getCountryFlag(tariff.fromOffice?.country) && isFlagImageUrl(getCountryFlag(tariff.fromOffice?.country))"
                    :src="getCountryFlag(tariff.fromOffice?.country)!"
                    alt="Origin Flag"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ getCountryFlag(tariff.fromOffice?.country) || '🏳️' }}</span>
                </div>
                <div>
                  <div class="font-bold text-slate-900">
                    {{ formatOfficeName(tariff.fromOffice) }}
                  </div>
                  <div class="text-xs text-slate-400 font-medium">
                    {{ getCountryDisplayName(tariff.fromOffice) }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Destination Office -->
            <td class="py-4 px-6">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm overflow-hidden shrink-0">
                  <img
                    v-if="getCountryFlag(tariff.toOffice?.country) && isFlagImageUrl(getCountryFlag(tariff.toOffice?.country))"
                    :src="getCountryFlag(tariff.toOffice?.country)!"
                    alt="Destination Flag"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ getCountryFlag(tariff.toOffice?.country) || '🏳️' }}</span>
                </div>
                <div>
                  <div class="font-bold text-slate-900">
                    {{ formatOfficeName(tariff.toOffice) }}
                  </div>
                  <div class="text-xs text-slate-400 font-medium">
                    {{ getCountryDisplayName(tariff.toOffice) }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Price Per Kg -->
            <td class="py-4 px-6">
              <div class="inline-flex items-baseline gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/15 rounded-xl">
                <span class="font-extrabold text-primary text-base">
                  {{ formatPrice(tariff.pricePerKg) }}
                </span>
                <span class="text-xs font-bold text-primary/70">AMD / kg</span>
              </div>
            </td>

            <!-- Actions -->
            <td class="py-4 px-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <!-- Edit Button -->
                <button
                  type="button"
                  @click="$emit('edit', tariff)"
                  class="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer"
                  :title="t('tariffs.edit')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <!-- Delete Button -->
                <button
                  type="button"
                  @click="$emit('delete', tariff)"
                  class="p-2 text-slate-500 hover:text-tertiary hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  :title="t('tariffs.delete')"
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
import { useI18n } from '~/composables/useI18n'
import { isFlagImageUrl, getCountryFlag, getCountryName } from '~/composables/useOfficeHelpers'
import EmptyState from '~/components/ui/EmptyState.vue'
import type { Tariff } from '~/types/tariff'
import type { Office } from '~/types/office'

defineProps<{
  tariffs: Tariff[]
  isLoading: boolean
}>()

defineEmits<{
  (e: 'add'): void
  (e: 'edit', tariff: Tariff): void
  (e: 'delete', tariff: Tariff): void
}>()

const { t, currentLanguage } = useI18n()

const formatPrice = (price: number | string): string => {
  const num = Number(price) || 0
  return num.toLocaleString()
}

const formatOfficeName = (office?: Office): string => {
  if (!office) return '—'
  return [office.city, office.province].filter(Boolean).join(', ')
}

const getCountryDisplayName = (office?: Office): string => {
  if (!office) return '—'
  if (office.country) {
    return getCountryName(office.country, currentLanguage.value)
  }
  return office.countryName || '—'
}
</script>
