<template>
  <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {{ t('manageOrders.receiversList') }}
          </h2>
          <span class="text-xs text-slate-400 font-medium">
            {{ receivers.length }} {{ t('manageOrders.receiversCount') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Self Recipient Highlight (when no receiver is assigned) -->
    <div
      v-if="isSelfRecipient"
      class="p-4 rounded-2xl bg-amber-50/60 border-2 border-amber-300/80 space-y-2 relative overflow-hidden"
    >
      <!-- Selected badge -->
      <div class="absolute top-0 right-0">
        <span class="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-xl uppercase tracking-wider">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          {{ t('manageOrders.selectedForOrder') }}
        </span>
      </div>

      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <span class="text-sm font-extrabold text-amber-950">
            {{ t('manageOrders.selfReceiver') }}
          </span>
          <span class="text-xs text-amber-700 font-medium block mt-0.5">
            {{ t('manageOrders.selfReceiverHint') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Receivers List -->
    <div v-if="receivers.length > 0" class="space-y-2.5">
      <div
        v-for="receiver in receivers"
        :key="receiver.id"
        class="p-3.5 rounded-2xl border space-y-2 transition-all relative overflow-hidden"
        :class="isSelected(receiver.id)
          ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20'
          : 'bg-slate-50/80 border-slate-200/70 hover:border-slate-300'"
      >
        <!-- Selected badge for assigned receiver -->
        <div v-if="isSelected(receiver.id)" class="absolute top-0 right-0">
          <span class="inline-flex items-center gap-1 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-xl uppercase tracking-wider">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            {{ t('manageOrders.selectedForOrder') }}
          </span>
        </div>

        <!-- Receiver name & code -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-sm font-bold text-slate-900 truncate">
              {{ receiver.firstName }} {{ receiver.lastName }}
            </span>
          </div>

          <div v-if="receiver.code">
            <span
              class="px-2 py-0.5 rounded-md font-mono font-bold text-[11px] border shrink-0"
              :class="isSelected(receiver.id)
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-slate-100 text-slate-600 border-slate-200'"
            >
              {{ receiver.code }}
            </span>
          </div>
        </div>

        <!-- Receiver details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
          <!-- Phone -->
          <div v-if="receiver.phoneNumber" class="flex items-center gap-2 text-slate-600">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a :href="`tel:${receiver.phoneNumber}`" class="font-semibold text-primary hover:underline">
              {{ receiver.phoneNumber }}
            </a>
          </div>

          <!-- Document -->
          <div v-if="receiver.documentNumber" class="flex items-center gap-2 text-slate-600">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <span class="font-mono font-medium">
              {{ getDocTypeName(receiver) }}: {{ receiver.documentNumber }}
            </span>
          </div>

          <!-- Address -->
          <div v-if="receiver.address" class="flex items-start gap-2 text-slate-600 col-span-1 sm:col-span-2">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="leading-relaxed font-medium line-clamp-2">{{ receiver.address }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- No Receivers -->
    <div
      v-else-if="!isSelfRecipient"
      class="text-center py-6 text-xs text-slate-400 italic"
    >
      {{ t('manageOrders.noReceivers') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import type { Receiver } from '~/types/receiver'

interface Props {
  receivers: Receiver[]
  selectedReceiverId?: string | null
}

const props = defineProps<Props>()
const { t, currentLanguage } = useI18n()

/** True when the order has no assigned receiver → the owner themselves is the recipient */
const isSelfRecipient = computed<boolean>(() => {
  return !props.selectedReceiverId
})

const isSelected = (receiverId: string): boolean => {
  return !!props.selectedReceiverId && props.selectedReceiverId === receiverId
}

const getDocTypeName = (receiver: Receiver): string => {
  if (currentLanguage.value === 'hy' && receiver.hyDocumentType) return receiver.hyDocumentType
  if (currentLanguage.value === 'ru' && receiver.ruDocumentType) return receiver.ruDocumentType
  return receiver.enDocumentType || t('manageOrders.document')
}
</script>
