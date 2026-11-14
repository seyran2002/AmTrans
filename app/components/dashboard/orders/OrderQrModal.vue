<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && order"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
        @keydown.esc="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')" />

        <!-- Dialog Card -->
        <div class="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-7 max-w-sm w-full z-10 border border-slate-200/60 text-center space-y-5 animate-fade-in">
          <!-- Close Button -->
          <button
            type="button"
            @click="$emit('close')"
            class="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header / Icon -->
          <div class="space-y-2">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20 shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900">
              {{ t('orders.qrModalTitle') }}
            </h3>
            <p v-if="order.trackingNumber" class="text-xs font-mono font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-xl inline-block border border-slate-200/60">
              {{ order.trackingNumber }}
            </p>
          </div>

          <!-- QR Code Image Area -->
          <div class="relative p-4 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block mx-auto">
            <div v-if="qrImageSrc" class="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <img
                :src="qrImageSrc"
                alt="Order QR Code"
                class="w-52 h-52 object-contain block mx-auto rounded-lg"
              />
            </div>
            <div v-else class="w-52 h-52 flex flex-col items-center justify-center text-slate-400 gap-2">
              <svg class="w-6 h-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span class="text-xs font-medium">{{ t('orders.loading') }}</span>
            </div>
          </div>

          <!-- Details & Actions -->
          <div class="space-y-3">
            <div v-if="order.productDescription || order.marketName" class="text-xs text-slate-500 truncate max-w-[260px] mx-auto">
              <span class="font-bold text-slate-700">{{ order.marketName }}</span>
              <span v-if="order.productDescription"> — {{ order.productDescription }}</span>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <button
                v-if="qrImageSrc"
                type="button"
                @click="downloadQr"
                class="flex-1 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{{ t('manageOrders.downloadLabel') || 'Download' }}</span>
              </button>
              <button
                type="button"
                @click="$emit('close')"
                class="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer active:scale-95"
              >
                {{ t('orders.cancel') || 'Close' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import type { Order } from '~/types/order'

const props = defineProps<{
  isOpen: boolean
  order: Order | null
}>()

defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const qrImageSrc = ref<string>('')

const resolveQrImage = async () => {
  if (!props.order) {
    qrImageSrc.value = ''
    return
  }

  // 1. If order has qrCode string provided (URL or base64 Data URL)
  if (props.order.qrCode) {
    qrImageSrc.value = props.order.qrCode
    return
  }

  // 2. Generate local QR Data URL as fallback
  try {
    const QRCode = (await import('qrcode')).default
    const encodeValue = props.order.trackingNumber || props.order.id
    const generated = await QRCode.toDataURL(encodeValue, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
    qrImageSrc.value = generated
  } catch (err) {
    console.error('Error generating QR code:', err)
  }
}

watch(
  () => [props.isOpen, props.order?.id, props.order?.qrCode],
  () => {
    if (props.isOpen && props.order) {
      resolveQrImage()
    }
  },
  { immediate: true }
)

const downloadQr = () => {
  if (!qrImageSrc.value || !props.order) return
  const link = document.createElement('a')
  link.target = '_blank'
  link.href = qrImageSrc.value
  link.download = `QR-${props.order.trackingNumber || props.order.id}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

