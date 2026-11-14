<template>
  <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {{ t('manageOrders.qrCodeTitle') }}
          </h2>
          <span class="text-xs text-slate-400 font-medium">
            {{ t('manageOrders.qrCodeSubtitle') }}
          </span>
        </div>
      </div>

      <!-- Download as Image Button -->
      <BaseButton
        v-if="displayQrCode || order.qrCode"
        type="button"
        size="sm"
        variant="primary"
        :block="false"
        :loading="isDownloading"
        :disabled="isQrLoading"
        @click="downloadCard"
      >
        <svg v-if="!isDownloading" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>{{ isDownloading ? t('manageOrders.saving') : t('manageOrders.downloadLabel') }}</span>
      </BaseButton>
    </div>

    <!-- ── Printable Panel (rendered in UI + captured as download image) ──── -->
    <div ref="printableRef" class="printable-card rounded-2xl overflow-hidden border border-slate-200/80 bg-white">
      <!-- QR Code Display Area -->
      <div class="printable-qr-area flex flex-col items-center justify-center p-6 bg-slate-50/80 text-center">
        <div v-if="displayQrCode" class="relative p-3 bg-white rounded-2xl shadow-sm border border-slate-200/80 inline-block">
          <img
            ref="qrImgRef"
            :src="displayQrCode"
            data-qr-image="true"
            alt="Order QR Code"
            class="w-44 h-44 object-contain rounded-lg block"
            loading="eager"
          />
          <span class="block text-xs font-mono font-bold text-slate-600 mt-2 tracking-wider">
            {{ order.trackingNumber || '' }}
          </span>
        </div>

        <div v-else-if="isQrLoading" class="w-44 h-44 flex flex-col items-center justify-center text-slate-400 gap-2 py-8">
          <svg class="w-6 h-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span class="text-[11px] font-medium">{{ t('manageOrders.saving') }}</span>
        </div>

        <div v-else class="text-xs text-slate-400 italic py-8">
          {{ t('manageOrders.emptyTitle') }}
        </div>
      </div>

      <!-- ── Shipment Summary Fields ────────────────────────────────────── -->
      <div class="px-4 pb-4 space-y-2.5">
        <!-- Route: From Office (Country, City) → To Office (Country, City) -->
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <!-- Departure / Origin -->
          <div class="flex items-center gap-2.5">
            <div class="w-6 h-6 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" fill="currentColor" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {{ t('manageOrders.originOffice') }}
              </p>
              <p class="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                {{ fromLabel }}
              </p>
            </div>
          </div>

          <!-- Connecting Divider Arrow -->
          <div class="flex items-center pl-2.5 gap-2">
            <div class="w-0.5 h-3 bg-slate-300 ml-0.5" />
            <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Destination / Arrival -->
          <div class="flex items-center gap-2.5">
            <div class="w-6 h-6 rounded-lg bg-amber-50 text-secondary flex items-center justify-center shrink-0 border border-amber-200/60">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {{ t('manageOrders.destinationOffice') }}
              </p>
              <p class="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                {{ toLabel }}
              </p>
            </div>
          </div>
        </div>

        <!-- Package Metrics: Pieces · Actual Weight · Volumetric Weight -->
        <div class="flex items-stretch gap-2">
          <!-- Number of Pieces -->
          <div class="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center space-y-0.5">
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight break-words hyphens-auto">
              {{ t('orders.pieceCount') }}
            </p>
            <p class="text-base font-extrabold text-slate-900 leading-tight">
              {{ order.pieceCount ?? 1 }}
            </p>
            <p class="text-[10px] font-medium text-slate-400">
              {{ t('orders.pieces') }}
            </p>
          </div>

          <!-- Actual Weight -->
          <div class="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center space-y-0.5">
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight break-words hyphens-auto">
              {{ t('manageOrders.weight') }}
            </p>
            <p class="text-base font-extrabold text-slate-900 leading-tight">
              {{ order.weight }}
            </p>
            <p class="text-[10px] font-medium text-slate-400">
              kg
            </p>
          </div>

          <!-- Volumetric Weight -->
          <div class="flex-1 p-2 rounded-xl bg-blue-50/60 border border-blue-200/70 text-center space-y-0.5">
            <p class="text-[9px] font-bold text-primary uppercase tracking-wider leading-tight break-words hyphens-auto">
              {{ t('manageOrders.volumetricWeight') }}
            </p>
            <p class="text-base font-extrabold text-primary leading-tight">
              {{ volumetricWeight }}
            </p>
            <p class="text-[10px] font-medium text-primary/70">
              kg
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Link Box with Copy Button (outside printable card) -->
    <div class="space-y-1.5 text-xs">
      <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
        {{ t('manageOrders.route') }} URL
      </span>
      <div class="flex items-center gap-1.5 bg-slate-50 rounded-xl p-1.5 border border-slate-200/70">
        <input
          type="text"
          readonly
          :value="orderPageUrl"
          class="bg-transparent text-slate-600 font-mono text-[11px] px-2 py-1 w-full focus:outline-hidden select-all truncate"
        />
        <button
          type="button"
          @click="copyUrl"
          class="px-2.5 py-1 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
          :class="copied ? 'bg-emerald-600 text-white' : 'bg-primary text-white hover:bg-primary/90'"
        >
          {{ copied ? t('manageOrders.copied') : t('manageOrders.copyLink') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useSystemSettings } from '~/composables/useSystemSettings'
import BaseButton from '~/components/ui/BaseButton.vue'
import type { Order, OrderOffice } from '~/types/order'

interface Props {
  order: Order
}

const props = defineProps<Props>()
const { t, currentLanguage } = useI18n()
const copied = ref(false)
const isDownloading = ref(false)
const isQrLoading = ref(true)
const displayQrCode = ref<string>('')

// ─── Refs for capture ────────────────────────────────────────────────────────
const printableRef = ref<HTMLElement | null>(null)
const qrImgRef = ref<HTMLImageElement | null>(null)

// ─── System settings for volumetric divisor ──────────────────────────────────
const { volumetricDivisor, fetchSettings } = useSystemSettings()

onMounted(async () => {
  await Promise.all([
    fetchSettings().catch(() => {}),
    loadQrCode()
  ])
})

watch(
  () => [props.order.id, props.order.qrCode],
  () => {
    loadQrCode()
  }
)

const volumetricWeight = computed<string>(() => {
  const l = Number(props.order.length) || 0
  const w = Number(props.order.width) || 0
  const h = Number(props.order.height) || 0
  if (!l || !w || !h) return '0.00'
  return ((l * w * h) / volumetricDivisor.value).toFixed(2)
})

// ─── Route labels (supports active locale) ───────────────────────────────────
const getCountryName = (country?: { enName?: string; hyName?: string; ruName?: string } | null): string => {
  if (!country) return ''
  if (currentLanguage.value === 'hy' && country.hyName) return country.hyName
  if (currentLanguage.value === 'ru' && country.ruName) return country.ruName
  return country.enName || ''
}

const buildOfficeLabel = (office?: OrderOffice | null): string => {
  if (!office) return '—'
  const country = getCountryName(office.country)
  const city = office.city || ''
  const province = office.province || ''

  const location = (city && province && city.toLowerCase() !== province.toLowerCase())
    ? `${city}, ${province}`
    : (city || province || '')

  const parts = [country, location].filter(Boolean)
  return parts.join(', ') || office.fullAddress || '—'
}

const fromLabel = computed(() => buildOfficeLabel(props.order.fromOffice))
const toLabel   = computed(() => buildOfficeLabel(props.order.toOffice))

// ─── URL copy ────────────────────────────────────────────────────────────────
const orderPageUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/dashboard/manage-orders/${props.order.id}`
  }
  return `/dashboard/manage-orders/${props.order.id}`
})

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(orderPageUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback
  }
}

// ─── QR Code Loader (Data URL immune to CORS) ────────────────────────────────
const loadQrCode = async () => {
  isQrLoading.value = true
  const raw = props.order.qrCode

  // 1. If backend order qrCode is already a base64 Data URL, use it directly
  if (raw && raw.startsWith('data:image/')) {
    displayQrCode.value = raw
    isQrLoading.value = false
    return
  }

  // 2. Generate crisp high-resolution QR code locally using 'qrcode'
  // This guarantees an origin-clean base64 Data URL with zero CORS issues, instant loading, and no canvas tainting.
  try {
    const QRCode = (await import('qrcode')).default
    const urlToEncode = orderPageUrl.value || (typeof window !== 'undefined' ? `${window.location.origin}/dashboard/manage-orders/${props.order.id}` : props.order.id)
    const generated = await QRCode.toDataURL(urlToEncode, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
    displayQrCode.value = generated
  } catch (err) {
    console.error('Failed to generate local QR code:', err)
    if (raw) {
      displayQrCode.value = raw
    }
  } finally {
    isQrLoading.value = false
  }
}

// ─── Download Card with QR Code Guaranteed ──────────────────────────────────
const downloadCard = async () => {
  if (!printableRef.value || isDownloading.value) return
  isDownloading.value = true

  try {
    // 1. Ensure QR Code data URL is loaded
    if (!displayQrCode.value || isQrLoading.value) {
      await loadQrCode()
    }

    // 2. Ensure original image is fully loaded and decoded in DOM
    if (qrImgRef.value) {
      if (!qrImgRef.value.complete) {
        await new Promise<void>((resolve) => {
          qrImgRef.value!.onload = () => resolve()
          qrImgRef.value!.onerror = () => resolve()
          setTimeout(resolve, 800)
        })
      }
      if ('decode' in qrImgRef.value) {
        await qrImgRef.value.decode().catch(() => {})
      }
    }

    await nextTick()

    // 3. Pre-measure exact element coordinates before html2canvas
    const cardEl = printableRef.value
    const imgEl = qrImgRef.value
    const cardRect = cardEl.getBoundingClientRect()
    const imgRect = imgEl?.getBoundingClientRect()

    const { default: html2canvas } = await import('html2canvas')

    const canvas = await html2canvas(cardEl, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
    })

    // 4. Guaranteed Direct Draw: Stamp the QR code directly onto the output canvas.
    // Always use a fresh Image() loaded from the base64 data URL — never from imgEl.
    // Drawing imgEl directly can fail silently after html2canvas runs (canvas taint / iframe context).
    if (imgRect && cardRect.width > 0 && imgRect.width > 0 && displayQrCode.value) {
      const scaleX = canvas.width / cardRect.width
      const scaleY = canvas.height / cardRect.height
      const x = (imgRect.left - cardRect.left) * scaleX
      const y = (imgRect.top - cardRect.top) * scaleY
      const w = imgRect.width * scaleX
      const h = imgRect.height * scaleY

      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Always create a fresh Image from the data URL — guaranteed to be same-origin, no taint
        const freshQrImg = new Image()
        freshQrImg.src = displayQrCode.value
        await new Promise<void>((resolve) => {
          if (freshQrImg.complete && freshQrImg.naturalWidth > 0) {
            resolve()
          } else {
            freshQrImg.onload = () => resolve()
            freshQrImg.onerror = () => resolve()
            setTimeout(resolve, 800)
          }
        })
        if (freshQrImg.naturalWidth > 0) {
          // Clear to white first, then draw QR code
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(x, y, w, h)
          ctx.drawImage(freshQrImg, x, y, w, h)
        }
      }
    }

    // 5. Trigger image download
    const link = document.createElement('a')
    const orderIdPrefix = (props.order.id || 'order').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 8).toUpperCase()
    link.download = `amtrans-order-${orderIdPrefix || 'QR'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('Download QR card failed:', err)
  } finally {
    isDownloading.value = false
  }
}
</script>
