<template>
  <div
    :class="[
      'bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden',
      order.status === 'PENDING_ESTIMATE'
        ? 'border-amber-300/90 bg-amber-50/20 hover:border-amber-400'
        : 'border-slate-200/90 hover:border-slate-300'
    ]"
  >
    <!-- Top Status Accent Bar -->
    <div
      :class="[
        'absolute top-0 left-0 right-0 h-1.5 transition-colors',
        statusAccentClass(order.status)
      ]"
    />

    <div>
      <!-- ── Card Header: ID, Status, Date ───────────────────────────────── -->
      <div class="flex items-start justify-between gap-3 pt-1 mb-4">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <NuxtLink
              :to="`/dashboard/manage-orders/${order.id}`"
              class="font-mono text-xs font-bold text-slate-600 hover:text-primary uppercase tracking-wider bg-slate-100 hover:bg-primary/10 px-2 py-0.5 rounded-lg border border-slate-200/60 transition-colors"
            >
              #{{ order.id.slice(0, 8).toUpperCase() }}
            </NuxtLink>
            <BaseBadge :variant="statusBadgeVariant(order.status)">
              <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(order.status)" />
              {{ t(`orders.status.${order.status}`) }}
            </BaseBadge>
          </div>
          <span class="text-[11px] font-medium text-slate-400 mt-1 block">
            {{ formatDate(order.createdAt) }}
          </span>
        </div>

        <!-- Price -->
        <div class="text-right shrink-0">
          <template v-if="order.status === 'PENDING_ESTIMATE'">
            <div v-if="order.estimatedPrice">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                {{ t('manageOrders.estimatedPriceTag') }}
              </span>
              <div class="text-base sm:text-lg font-extrabold text-amber-600 tracking-tight">
                {{ formatCurrency(order.estimatedPrice, 'AMD') }}
              </div>
            </div>
            <div v-else>
              <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-100/90 border border-amber-300/80 px-2.5 py-1 rounded-xl shadow-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {{ t('manageOrders.needsEstimate') }}
              </span>
            </div>
          </template>
          <template v-else-if="order.tariffRateAtBooking">
            <span class="text-[10px] font-bold uppercase tracking-wider text-primary block flex items-center justify-end gap-1">
              <svg class="w-3 h-3 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              {{ t('manageOrders.lockedPrice') }}
            </span>
            <div class="text-base sm:text-lg font-extrabold text-primary tracking-tight">
              {{ formatCurrency(effectivePrice, 'AMD') }}
            </div>
            <span class="text-[10px] font-semibold text-slate-500 block">
              {{ formatCurrency(Number(order.estimatedPrice || order.tariffRateAtBooking), "AMD") }}/kg
            </span>
          </template>
          <template v-else>
            <div class="text-base sm:text-lg font-extrabold text-primary tracking-tight">
              {{ (order.totalPrice || order.price) && Number(order.totalPrice ?? order.price) ? formatCurrency(Number(order.totalPrice ?? order.price), "AMD") : '—' }}
            </div>
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {{ formatCurrency(Number(order.estimatedPrice || order.tariffRateAtBooking), "AMD") }}/kg
            </span>
          </template>
        </div>
      </div>

      <!-- ── Route Flow ─────────────────────────────────────────────────── -->
      <div class="p-3 rounded-2xl bg-slate-50/80 border border-slate-100/90 mb-4 text-xs font-semibold">
        <div class="flex items-center justify-between gap-2 text-slate-700">
          <!-- Origin Office -->
          <div class="flex items-center gap-1.5 min-w-0">
            <div class="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <div class="truncate">
              <span class="text-slate-900 font-bold block truncate">{{ order.fromOffice?.city || '—' }}</span>
              <span class="text-[10px] text-slate-400 font-medium block truncate">
                {{ formatCountryName(order.fromOffice?.country) }}
              </span>
            </div>
          </div>

          <!-- Arrow -->
          <div class="text-slate-300 shrink-0 px-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>

          <!-- Destination Office -->
          <div class="flex items-center gap-1.5 min-w-0 text-right justify-end">
            <div class="truncate">
              <span class="text-slate-900 font-bold block truncate">{{ order.toOffice?.city || '—' }}</span>
              <span class="text-[10px] text-slate-400 font-medium block truncate">
                {{ formatCountryName(order.toOffice?.country) }}
              </span>
            </div>
            <div class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Product Details & Store ────────────────────────────────────── -->
      <div class="space-y-2 mb-4">
        <!-- Store Name -->
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 rounded-md bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-slate-900 truncate" :title="order.marketName">
            {{ order.marketName }}
          </span>
        </div>

        <!-- Description -->
        <p class="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed" :title="order.productDescription">
          {{ order.productDescription }}
        </p>

        <!-- Package Specs: Pieces, Weight & Dimensions -->
        <div class="grid grid-cols-2 gap-2 pt-1 text-xs">
          <div class="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 min-w-0">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span class="text-slate-500 font-medium truncate">{{ t('orders.colPieces') }}:</span>
            <span class="text-slate-800 font-bold ml-auto">{{ order.pieceCount ?? 1 }}</span>
          </div>

          <div class="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 min-w-0" :title="billableWeight > Number(order.weight) ? `${t('manageOrders.billableWeight')}: ${billableWeight} kg (min 5kg)` : undefined">
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <span class="text-slate-500 font-medium truncate">{{ t('manageOrders.weight') }}:</span>
            <span class="text-slate-800 font-bold ml-auto flex items-center gap-1">
              {{ order.weight }} kg
              <span v-if="billableWeight > Number(order.weight)" class="text-xs text-amber-700 font-semibold">({{ billableWeight }} kg)</span>
            </span>
          </div>
        </div>
        <div class="flex text-xs items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 min-w-0">
          <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span class="text-slate-500 font-medium truncate">{{ t('manageOrders.dimensions') }}:</span>
          <span class="text-slate-800 font-bold ml-auto truncate" :title="`${order.length}×${order.width}×${order.height} cm`">
            {{ order.length }}×{{ order.width }}×{{ order.height }}
          </span>
        </div>

        <!-- Optional Comment -->
        <div v-if="order.comment" class="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
          <svg class="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span class="italic leading-relaxed break-words">{{ order.comment }}</span>
        </div>
      </div>

      <!-- ── Recipient / Owner Details Section ───────────────────────────── -->
      <div class="mt-4 pt-3.5 border-t border-slate-100 space-y-3">
        <!-- Target Header & Type Badge -->
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ t('manageOrders.recipient') }}
          </span>

          <BaseBadge :variant="order.receiver ? 'info' : 'secondary'" size="sm">
            {{ order.receiver ? t('manageOrders.assignedReceiver') : t('manageOrders.accountHolder') }}
          </BaseBadge>
        </div>

        <!-- CASE A: Dedicated Receiver is assigned -->
        <div v-if="order.receiver" class="space-y-2">
          <div class="p-3 rounded-2xl bg-blue-50/40 border border-blue-100/80 space-y-1.5">

            <div class="flex items-center justify-between">
              <!-- Receiver Name -->
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-slate-900 truncate">
                  {{ order.receiver.firstName }} {{ order.receiver.lastName }}
                </span>
              </div>

              <!-- Prominent User Code Chip -->
              <span v-if="order.receiver.code" class="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-bold text-[11px] border border-primary/20">
                {{ order.receiver.code }}
              </span>
            </div>

            <!-- Receiver Phone -->
            <div class="flex items-center gap-2 text-xs text-slate-600">
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a :href="`tel:${order.receiver.phoneNumber}`" class="font-semibold text-primary hover:underline">
                {{ order.receiver.phoneNumber }}
              </a>
            </div>

            <!-- Receiver Address -->
            <div class="flex items-start gap-2 text-xs text-slate-600">
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="line-clamp-2 leading-relaxed">{{ order.receiver.address }}</span>
            </div>
          </div>

          <!-- Customer Owner Info sub-block -->
          <div v-if="order.user" class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
            <div class="flex items-center justify-between gap-1">
              <span class="text-slate-400 font-bold uppercase tracking-wider">{{ t('manageOrders.customer') }}</span>
              <!-- Prominent User Code Chip -->
              <span v-if="order.user.code" class="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-bold text-[11px] border border-primary/20">
                {{ order.user.code }}
              </span>
            </div>
            <div class="font-bold text-slate-800 truncate">
              {{ getUserDisplayName(order.user) }}
            </div>
            <div class="flex items-center gap-3 text-slate-500 font-medium flex-wrap">
              <span v-if="order.user.email" class="truncate">{{ order.user.email }}</span>
              <span v-if="order.user.phoneNumber">· {{ order.user.phoneNumber }}</span>
            </div>
          </div>
        </div>

        <!-- CASE B: Receiver is null -> User Account Holder is the recipient -->
        <div v-else-if="order.user" class="p-3.5 rounded-2xl bg-amber-50/30 border border-amber-200/50 space-y-2.5">
          <!-- User Name and Code -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-sm font-bold text-slate-900 block">
                {{ getUserDisplayName(order.user) }}
              </span>
              <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                {{ order.user.isIndividual === false ? t('manageOrders.legalEntity') : t('manageOrders.individual') }}
              </span>
            </div>

            <!-- Prominent Identifier Code Badge -->
            <div v-if="order.user.code" class="text-right">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                {{ t('manageOrders.userCode') }}
              </span>
              <span class="inline-block px-2.5 py-1 rounded-lg bg-secondary/15 text-secondary border border-secondary/30 font-mono font-extrabold text-xs">
                {{ order.user.code }}
              </span>
            </div>
          </div>

          <!-- Contact Details (Phone & Email) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            <!-- Phone -->
            <div class="flex items-center gap-1.5 text-slate-600">
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a v-if="order.user.phoneNumber" :href="`tel:${order.user.phoneNumber}`" class="font-semibold text-primary hover:underline truncate">
                {{ order.user.phoneNumber }}
              </a>
              <span v-else class="text-slate-400">—</span>
            </div>

            <!-- Email -->
            <div class="flex items-center gap-1.5 text-slate-600">
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="truncate" :title="order.user.email">{{ order.user.email }}</span>
            </div>
          </div>

          <!-- Document / Taxpayer info -->
          <div class="p-2 rounded-xl bg-white/80 border border-slate-100 text-[11px] space-y-1">
            <!-- Individual Document -->
            <div v-if="order.user.documentNumber || getUserDocType(order.user)" class="flex items-center justify-between gap-2">
              <span class="text-slate-500 font-medium">
                {{ getUserDocType(order.user) || t('manageOrders.document') }}:
              </span>
              <span class="font-mono font-bold text-slate-800">
                {{ order.user.documentNumber || '—' }}
              </span>
            </div>

            <!-- Taxpayer ID (For company) -->
            <div v-if="order.user.taxpayerId" class="flex items-center justify-between gap-2">
              <span class="text-slate-500 font-medium">{{ t('manageOrders.taxpayerId') }}:</span>
              <span class="font-mono font-bold text-slate-800">{{ order.user.taxpayerId }}</span>
            </div>
          </div>
        </div>

        <!-- Fallback if neither receiver nor user exists -->
        <div v-else class="text-xs text-slate-400 italic">
          —
        </div>
      </div>
    </div>

    <!-- ── Card Footer: Invoice Link & Actions ─────────────────────────── -->
    <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
      <a
        v-if="order.invoiceUrl"
        :href="order.invoiceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors py-1 cursor-pointer"
      >
        <svg class="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>{{ t('manageOrders.viewInvoice') }}</span>
      </a>
      <span v-else />

      <NuxtLink
        :to="`/dashboard/manage-orders/${order.id}`"
        :class="[
          'inline-flex items-center gap-1.5 text-xs font-bold transition-colors py-1 group/btn',
          order.status === 'PENDING_ESTIMATE' && !order.estimatedPrice
            ? 'text-amber-700 hover:text-amber-800'
            : 'text-primary hover:text-primary-dark'
        ]"
      >
        <span>{{ order.status === 'PENDING_ESTIMATE' && !order.estimatedPrice ? t('manageOrders.provideEstimate') : t('manageOrders.viewOrder') }}</span>
        <svg class="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import BaseBadge, { type BadgeVariant } from '~/components/ui/BaseBadge.vue'
import type { Order, OrderStatus, OrderUser } from '~/types/order'

interface Props {
  order: Order
}

const props = defineProps<Props>()
const { t, currentLanguage } = useI18n()

const billableWeight = computed<number>(() => {
  if (props.order.billableWeight !== undefined && props.order.billableWeight !== null && Number(props.order.billableWeight) > 0) {
    return Number(props.order.billableWeight)
  }
  const actual = Number(props.order.weight) || 0
  const l = Number(props.order.length) || 0
  const w = Number(props.order.width) || 0
  const h = Number(props.order.height) || 0
  const vol = (l > 0 && w > 0 && h > 0) ? (l * w * h) / 5000 : 0
  const chargeable = Math.max(actual, vol)
  return Math.max(chargeable, 5)
})

const effectivePrice = computed<number>(() => {
  if (props.order.totalPrice !== undefined && props.order.totalPrice !== null && Number(props.order.totalPrice) > 0) {
    return Number(props.order.totalPrice)
  }
  if (props.order.price !== undefined && props.order.price !== null && Number(props.order.price) > 0) {
    return Number(props.order.price)
  }
  if (props.order.tariffRateAtBooking) {
    return Math.round(props.order.tariffRateAtBooking * billableWeight.value)
  }
  return 0
})

// ── Helpers ──────────────────────────────────────────────────────────────
const formatCurrency = (price: number, currency: string): string => {
  return `${price.toLocaleString()} ${currency}`
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString(
    currentLanguage.value === 'hy' ? 'hy-AM' : currentLanguage.value === 'ru' ? 'ru-RU' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  )
}

const formatCountryName = (country?: { enName?: string; hyName?: string; ruName?: string }): string => {
  if (!country) return ''
  if (currentLanguage.value === 'hy' && country.hyName) return country.hyName
  if (currentLanguage.value === 'ru' && country.ruName) return country.ruName
  return country.enName || ''
}

const getUserDisplayName = (u: OrderUser): string => {
  if (u.isIndividual === false && u.companyName) {
    return u.companyName
  }
  const parts = [u.firstName, u.lastName].filter(Boolean)
  if (parts.length > 0) return parts.join(' ')
  return u.email?.split('@')[0] || 'User'
}

const getUserDocType = (u: OrderUser): string => {
  if (currentLanguage.value === 'hy' && u.hyDocumentType) return u.hyDocumentType
  if (currentLanguage.value === 'ru' && u.ruDocumentType) return u.ruDocumentType
  if (currentLanguage.value === 'en' && u.enDocumentType) return u.enDocumentType
  return u.enDocumentType || u.hyDocumentType || u.ruDocumentType || ''
}

// ── Status Styling ────────────────────────────────────────────────────────
const statusBadgeVariant = (status: OrderStatus): BadgeVariant => {
  switch (status) {
    case 'PENDING_ESTIMATE':
      return 'warning'
    case 'REGISTERED':
      return 'info'
    case 'IN_TRANSIT':
      return 'warning'
    case 'ARRIVED':
      return 'primary'
    case 'DELIVERED':
      return 'success'
    case 'CANCELLED':
      return 'danger'
    default:
      return 'default'
  }
}

const statusDotClass = (status: OrderStatus): string => {
  switch (status) {
    case 'PENDING_ESTIMATE':
      return 'bg-amber-500 animate-pulse'
    case 'REGISTERED':
      return 'bg-blue-500'
    case 'IN_TRANSIT':
      return 'bg-amber-500'
    case 'ARRIVED':
      return 'bg-primary'
    case 'DELIVERED':
      return 'bg-emerald-500'
    case 'CANCELLED':
      return 'bg-red-500'
    default:
      return 'bg-slate-400'
  }
}

const statusAccentClass = (status: OrderStatus): string => {
  switch (status) {
    case 'PENDING_ESTIMATE':
      return 'bg-amber-500'
    case 'REGISTERED':
      return 'bg-blue-500'
    case 'IN_TRANSIT':
      return 'bg-amber-500'
    case 'ARRIVED':
      return 'bg-primary'
    case 'DELIVERED':
      return 'bg-emerald-500'
    case 'CANCELLED':
      return 'bg-tertiary'
    default:
      return 'bg-slate-300'
  }
}
</script>
