<template>
  <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {{ t('manageOrders.routeInfo') }}
          </h2>
          <span class="text-xs text-slate-400 font-medium">
            {{ fromOffice?.city || '—' }} → {{ toOffice?.city || '—' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Offices Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
      <!-- ── Origin Office ────────────────────────────────────────────────── -->
      <div class="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-primary" />
            {{ t('manageOrders.originOffice') }}
          </span>
          <span class="text-xs font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md">
            {{ fromCountryName }}
          </span>
        </div>

        <div>
          <div class="text-base font-extrabold text-slate-900">
            {{ fromOffice?.city || '—' }}
          </div>
          <div class="text-xs text-slate-500 font-medium mt-0.5">
            {{ fromOffice?.province }}, {{ fromCountryName }}
          </div>
        </div>

        <div class="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs">
          <!-- Full Address -->
          <div class="flex items-start gap-2 text-slate-600">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="leading-relaxed font-medium">{{ fromOffice?.fullAddress || '—' }}</span>
          </div>

          <!-- Phone -->
          <div v-if="fromOffice?.phone" class="flex items-center gap-2 text-slate-600">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a :href="`tel:${fromOffice.phone}`" class="font-semibold text-primary hover:underline">
              {{ fromOffice.phone }}
            </a>
          </div>

          <!-- Postal Code -->
          <div v-if="fromOffice?.postalCode" class="text-[11px] text-slate-400 font-mono">
            {{ t('addresses.postalCode') }}: {{ fromOffice.postalCode }}
          </div>
        </div>
      </div>

      <!-- ── Destination Office ────────────────────────────────────────────── -->
      <div class="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500" />
            {{ t('manageOrders.destinationOffice') }}
          </span>
          <span class="text-xs font-bold text-emerald-700 font-mono bg-emerald-100 px-2 py-0.5 rounded-md">
            {{ toCountryName }}
          </span>
        </div>

        <div>
          <div class="text-base font-extrabold text-slate-900">
            {{ toOffice?.city || '—' }}
          </div>
          <div class="text-xs text-slate-500 font-medium mt-0.5">
            {{ toOffice?.province }}, {{ toCountryName }}
          </div>
        </div>

        <div class="space-y-1.5 pt-2 border-t border-emerald-200/60 text-xs">
          <!-- Full Address -->
          <div class="flex items-start gap-2 text-slate-600">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="leading-relaxed font-medium">{{ toOffice?.fullAddress || '—' }}</span>
          </div>

          <!-- Phone -->
          <div v-if="toOffice?.phone" class="flex items-center gap-2 text-slate-600">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a :href="`tel:${toOffice.phone}`" class="font-semibold text-primary hover:underline">
              {{ toOffice.phone }}
            </a>
          </div>

          <!-- Postal Code -->
          <div v-if="toOffice?.postalCode" class="text-[11px] text-slate-400 font-mono">
            {{ t('addresses.postalCode') }}: {{ toOffice.postalCode }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import type { OrderOffice } from '~/types/order'

interface Props {
  fromOffice?: OrderOffice
  toOffice?: OrderOffice
}

const props = defineProps<Props>()
const { t, currentLanguage } = useI18n()

const getCountryName = (country?: { enName?: string; hyName?: string; ruName?: string }): string => {
  if (!country) return '—'
  if (currentLanguage.value === 'hy' && country.hyName) return country.hyName
  if (currentLanguage.value === 'ru' && country.ruName) return country.ruName
  return country.enName || '—'
}

const fromCountryName = computed(() => getCountryName(props.fromOffice?.country))
const toCountryName = computed(() => getCountryName(props.toOffice?.country))
</script>
