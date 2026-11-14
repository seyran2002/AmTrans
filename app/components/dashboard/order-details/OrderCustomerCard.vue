<template>
  <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {{ t('manageOrders.customerInfo') }}
          </h2>
          <span class="text-xs text-slate-400 font-medium">
            {{ t('manageOrders.customer') }}
          </span>
        </div>
      </div>

      <!-- Entity Type Badge -->
      <BaseBadge :variant="owner.isIndividual === false ? 'info' : 'secondary'" size="sm">
        {{ owner.isIndividual === false ? t('manageOrders.legalEntity') : t('manageOrders.individual') }}
      </BaseBadge>
    </div>

    <!-- Customer Identity -->
    <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
      <!-- Name & Code Row -->
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="text-base font-extrabold text-slate-900 truncate">
            {{ displayName }}
          </div>
          <div v-if="owner.companyName && owner.isIndividual === false" class="text-xs text-slate-500 font-medium mt-0.5 truncate">
            {{ owner.companyName }}
          </div>
        </div>

        <!-- User Code Badge -->
        <div v-if="owner.code" class="text-right shrink-0">
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            {{ t('manageOrders.userCode') }}
          </span>
          <span class="inline-block px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-mono font-extrabold text-xs">
            {{ owner.code }}
          </span>
        </div>
      </div>

      <!-- Contact Details Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
        <!-- Email -->
        <div v-if="owner.email" class="flex items-center gap-2 text-slate-600">
          <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a :href="`mailto:${owner.email}`" class="font-semibold text-primary hover:underline truncate">
            {{ owner.email }}
          </a>
        </div>

        <!-- Phone -->
        <div v-if="owner.phoneNumber" class="flex items-center gap-2 text-slate-600">
          <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <a :href="`tel:${owner.phoneNumber}`" class="font-semibold text-primary hover:underline">
            {{ owner.phoneNumber }}
          </a>
        </div>
      </div>
    </div>

    <!-- Document Information -->
    <div class="space-y-2 text-xs">
      <!-- Document Type & Number -->
      <div v-if="documentTypeName || owner.documentNumber" class="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
        <div class="flex items-center gap-2 text-slate-600 min-w-0">
          <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          <span class="font-medium truncate">{{ documentTypeName || t('manageOrders.document') }}</span>
        </div>
        <span v-if="owner.documentNumber" class="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
          {{ owner.documentNumber }}
        </span>
      </div>

      <!-- Taxpayer ID (for legal entities) -->
      <div v-if="owner.taxpayerId" class="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
        <span class="text-slate-500 font-medium">{{ t('manageOrders.taxpayerId') }}</span>
        <span class="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
          {{ owner.taxpayerId }}
        </span>
      </div>

      <!-- Address -->
      <div v-if="owner.address" class="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-2 text-slate-600">
        <svg class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="font-medium leading-relaxed">{{ owner.address }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import type { OrderUser } from '~/types/order'

interface Props {
  owner: OrderUser
}

const props = defineProps<Props>()
const { t, currentLanguage } = useI18n()

const displayName = computed<string>(() => {
  const u = props.owner
  if (u.firstName || u.lastName) {
    return [u.firstName, u.lastName].filter(Boolean).join(' ')
  }
  if (u.companyName) return u.companyName
  return u.email || '—'
})

const documentTypeName = computed<string>(() => {
  const u = props.owner
  if (currentLanguage.value === 'hy' && u.hyDocumentType) return u.hyDocumentType
  if (currentLanguage.value === 'ru' && u.ruDocumentType) return u.ruDocumentType
  return u.enDocumentType || ''
})
</script>
