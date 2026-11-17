<template>
  <Transition name="fade-modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center !mt-0 p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <div
        class="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 transform transition-all animate-scale-up flex flex-col max-h-[calc(100vh-70px)] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <!-- Modal Header (Fixed at Top) -->
        <div class="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {{ isEditing ? (canEditAllDetails ? t('orders.editOrder') : t('orders.editReceiver')) : t('orders.addOrder') }}
            </h3>
            <p class="text-[11px] sm:text-xs text-slate-500 font-medium leading-normal mt-0.5">
              {{ isEditing ? (canEditAllDetails ? t('orders.editOrderSubtitle') : t('orders.editReceiverSubtitle')) : t('orders.addOrderSubtitle') }}
            </p>
          </div>
          <button
            type="button"
            @click="handleClose"
            :disabled="isSubmitting"
            class="min-h-[36px] min-w-[36px] p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            :aria-label="t('orders.cancel')"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form (Wraps Scrollable Body + Fixed Footer) -->
        <form @submit.prevent="handleSubmit" novalidate class="flex flex-col flex-1 min-h-0 overflow-hidden">
          <!-- Scrollable Body Area -->
          <div class="px-4 sm:px-6 py-3.5 sm:py-4 space-y-3 sm:space-y-3.5 flex-1 overflow-y-auto overscroll-contain">
            <!-- Status notice when order is in a non-registered status -->
            <div v-if="isEditing && !canEditAllDetails" class="p-2.5 sm:p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl sm:rounded-2xl flex items-start gap-2.5">
              <div class="p-1 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-xs text-amber-900 leading-relaxed font-medium">
                {{ t('orders.restrictedNotice').replace('{status}', props.order?.status ? t(`orders.status.${props.order.status}`) : '') }}
              </div>
            </div>

            <!-- Error Banner -->
            <AlertBanner v-if="error" :message="error" />

            <!-- ── Recipient Section ─────────────────────────────────────── -->
            <OrderRecipientSelect
              v-model:recipient-type="form.recipientType"
              v-model:receiver-id="form.receiverId"
              :options="receiverOptions"
              :loading="receiversLoading"
              :disabled="isSubmitting"
              :error="errors.receiverId"
            />

            <!-- ── Offices Section ──────────────────────────────────────── -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <BaseSelect
                id="orderFromOfficeId"
                v-model="form.fromOfficeId"
                :label="t('orders.fromOffice')"
                :placeholder="t('orders.fromOfficePlaceholder')"
                :options="officeOptions"
                :required="canEditAllDetails"
                :error="errors.fromOfficeId"
                :disabled="isSubmitting || officesLoading || !canEditAllDetails"
              />

              <BaseSelect
                id="orderToOfficeId"
                v-model="form.toOfficeId"
                :label="t('orders.toOffice')"
                :placeholder="t('orders.toOfficePlaceholder')"
                :options="destinationOfficeOptions"
                :required="canEditAllDetails"
                :error="errors.toOfficeId"
                :disabled="isSubmitting || officesLoading || !canEditAllDetails"
              />
            </div>

            <!-- ── Route Tariff Display ─────────────────────────────────── -->
            <OrderRouteTariffDisplay
              v-if="hasSelectedRoute"
              :tariff="routeTariff"
              :estimated-price="effectiveEstimatedPrice"
              :loading="isRouteTariffLoading"
              :is-missing="isRouteTariffMissing && !effectiveEstimatedPrice"
              :error="routeTariffError"
              :route-label="selectedRouteLabel"
              :format-price="formatPrice"
              :is-locked="isLockedTariff"
              :tariff-rate-at-booking="props.order?.tariffRateAtBooking"
              @retry="loadTariffForCurrentRoute(true)"
            />

            <!-- ── Product Details ──────────────────────────────────────── -->
            <BaseInput
              id="orderMarketName"
              v-model="form.marketName"
              :label="t('orders.marketName')"
              :placeholder="t('orders.marketNamePlaceholder')"
              :required="canEditAllDetails"
              :error="errors.marketName"
              :disabled="isSubmitting || !canEditAllDetails"
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </template>
            </BaseInput>

            <!-- Price & Currency -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <BaseInput
                id="orderProductPrice"
                v-model="form.productPrice"
                type="number"
                :label="t('orders.productPrice')"
                :placeholder="t('orders.productPricePlaceholder')"
                :required="canEditAllDetails"
                :error="errors.productPrice"
                :disabled="isSubmitting || !canEditAllDetails"
              >
                <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </template>
              </BaseInput>

              <BaseSelect
                id="orderCurrency"
                v-model="form.currency"
                :label="t('orders.currency')"
                :placeholder="t('orders.currencyPlaceholder')"
                :options="currencyOptions"
                :required="canEditAllDetails"
                :error="errors.currency"
                :disabled="isSubmitting || !canEditAllDetails"
              />
            </div>

            <!-- Piece Count & Condition -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <BaseInput
                id="orderPieceCount"
                v-model="form.pieceCount"
                type="number"
                min="1"
                step="1"
                :label="t('orders.pieceCount')"
                :placeholder="t('orders.pieceCountPlaceholder')"
                :required="canEditAllDetails"
                :error="errors.pieceCount"
                :disabled="isSubmitting || !canEditAllDetails"
              >
                <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </template>
              </BaseInput>

              <ProductConditionSwitch
                v-model="form.isNew"
                :disabled="isSubmitting || !canEditAllDetails"
                :required="canEditAllDetails"
              />
            </div>

            <!-- ── Dimensions ───────────────────────────────────────────── -->
            <div>
              <p class="block text-xs font-bold uppercase tracking-wider text-primary/90 mb-1.5 sm:mb-2">
                {{ t('orders.dimensions') }}
                <span class="text-slate-400 normal-case font-normal ml-1">(cm / kg)</span>
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                <BaseInput
                  id="orderWeight"
                  v-model="form.weight"
                  type="number"
                  :label="t('orders.weight')"
                  :placeholder="t('orders.weightPlaceholder')"
                  :required="canEditAllDetails"
                  :error="errors.weight"
                  :disabled="isSubmitting || !canEditAllDetails"
                />
                <BaseInput
                  id="orderLength"
                  v-model="form.length"
                  type="number"
                  :label="t('orders.length')"
                  :placeholder="t('orders.lengthPlaceholder')"
                  :required="canEditAllDetails"
                  :error="errors.length"
                  :disabled="isSubmitting || !canEditAllDetails"
                />
                <BaseInput
                  id="orderWidth"
                  v-model="form.width"
                  type="number"
                  :label="t('orders.width')"
                  :placeholder="t('orders.widthPlaceholder')"
                  :required="canEditAllDetails"
                  :error="errors.width"
                  :disabled="isSubmitting || !canEditAllDetails"
                />
                <BaseInput
                  id="orderHeight"
                  v-model="form.height"
                  type="number"
                  :label="t('orders.height')"
                  :placeholder="t('orders.heightPlaceholder')"
                  :required="canEditAllDetails"
                  :error="errors.height"
                  :disabled="isSubmitting || !canEditAllDetails"
                />
              </div>
            </div>

            <!-- ── Order Price Calculation Card ────────────────────────── -->
            <OrderPriceCalculationCard
              :loading="isRouteTariffLoading || isSettingsLoading"
              :has-route="Boolean(form.fromOfficeId && form.toOfficeId)"
              :is-route-tariff-missing="isRouteTariffMissing && !effectiveEstimatedPrice"
              :volumetric-divisor="volumetricDivisor"
              :numeric-weight="numericWeight"
              :volumetric-weight="volumetricWeight"
              :chargeable-weight="chargeableWeight"
              :billable-weight="billableWeight"
              :is-volumetric-larger="isVolumetricLarger"
              :tariff-price-per-kg="tariffPricePerKg"
              :minimum-price="minimumPrice"
              :calculated-order-price="calculatedOrderPrice"
              :format-price="formatPrice"
              :is-locked="isLockedTariff"
              :tariff-rate-at-booking="props.order?.tariffRateAtBooking"
            />

            <!-- Product Description -->
            <BaseTextarea
              id="orderProductDescription"
              v-model="form.productDescription"
              :label="t('orders.productDescription')"
              :placeholder="t('orders.productDescriptionPlaceholder')"
              :required="canEditAllDetails"
              :error="errors.productDescription"
              :disabled="isSubmitting || !canEditAllDetails"
              :rows="2"
            />

            <!-- ── Optional Fields ─────────────────────────────────────── -->
            <!-- Comment -->
            <BaseTextarea
              id="orderComment"
              v-model="form.comment"
              :label="t('orders.comment')"
              :placeholder="t('orders.commentPlaceholder')"
              :disabled="isSubmitting || !canEditAllDetails"
              :rows="2"
            />

            <!-- Invoice File Upload -->
            <OrderInvoiceUpload
              v-model="form.invoice"
              :existing-invoice-url="props.order?.invoiceUrl"
              :can-edit="canEditAllDetails"
              :disabled="isSubmitting"
            />
          </div>

          <!-- ── Modal Footer (Fixed at Bottom) ────────────────────────── -->
          <div class="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-100 bg-slate-50/80 shrink-0 space-y-2.5">
            <!-- Agreement Checkbox -->
            <label class="flex items-start gap-2.5 cursor-pointer select-none group">
              <input
                id="orderAgreementCheckbox"
                v-model="isAgreed"
                type="checkbox"
                class="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30 focus:ring-2 cursor-pointer transition-colors"
                :disabled="isSubmitting"
              />
              <span class="text-[11px] sm:text-xs text-slate-600 leading-snug">
                {{ t('orders.agreementPrefix') }}
                <NuxtLink
                  to="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-primary hover:text-primary-dark underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                  @click.stop
                >
                  {{ t('orders.agreementPrivacy') }}
                </NuxtLink>
                {{ t('orders.agreementAnd') }}
                <NuxtLink
                  to="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold text-primary hover:text-primary-dark underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                  @click.stop
                >
                  {{ t('orders.agreementTerms') }}
                </NuxtLink>
                <span class="text-tertiary ml-0.5 font-bold">*</span>
              </span>
            </label>

            <!-- Buttons -->
            <div class="flex items-center justify-end gap-2.5">
              <BaseButton
                type="button"
                variant="outline"
                size="sm"
                :block="false"
                class="!min-h-[36px] !py-1.5 !px-4 text-xs"
                :disabled="isSubmitting"
                @click="handleClose"
              >
                {{ t('orders.cancel') }}
              </BaseButton>

              <BaseButton
                type="submit"
                variant="primary"
                size="sm"
                :block="false"
                class="!min-h-[36px] !py-1.5 !px-5 text-xs"
                :loading="isSubmitting"
                :disabled="isSubmitDisabled || !isAgreed"
              >
                {{ submitButtonText }}
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseTextarea from '~/components/ui/BaseTextarea.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import ProductConditionSwitch from '~/components/ui/ProductConditionSwitch.vue'
import OrderRecipientSelect from '~/components/dashboard/order/OrderRecipientSelect.vue'
import OrderRouteTariffDisplay from '~/components/dashboard/order/OrderRouteTariffDisplay.vue'
import OrderPriceCalculationCard from '~/components/dashboard/order/OrderPriceCalculationCard.vue'
import OrderInvoiceUpload from '~/components/dashboard/order/OrderInvoiceUpload.vue'

import { useI18n } from '~/composables/useI18n'
import { useOffices } from '~/composables/useOffices'
import { useReceivers } from '~/composables/useReceivers'
import { useTariffs } from '~/composables/useTariffs'
import { useSystemSettings } from '~/composables/useSystemSettings'
import { useOrderForm } from '~/composables/useOrderForm'
import { useOrderCalculation } from '~/composables/useOrderCalculation'
import type { Order, CreateOrderPayload, UpdateOrderPayload } from '~/types/order'

// ─── Props & Emits ─────────────────────────────────────────────────────────
const props = defineProps<{
  isOpen: boolean
  order?: Order | null
  isSubmitting?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: CreateOrderPayload | UpdateOrderPayload): void
}>()

// ─── Composables ────────────────────────────────────────────────────────────
const { t } = useI18n()
const { offices, isLoading: officesLoading, fetchOffices } = useOffices()
const { receivers, isLoading: receiversLoading, fetchReceivers } = useReceivers()
const {
  routeTariff,
  isRouteTariffLoading,
  routeTariffError,
  isRouteTariffMissing,
  clearRouteTariff,
  fetchTariffByRoute
} = useTariffs()
const { settings, isLoading: isSettingsLoading, fetchSettings } = useSystemSettings()

const {
  form,
  errors,
  resetForm,
  populateForm,
  validate,
  buildPayload
} = useOrderForm()

// ─── Route & Estimated Tariff Resolution ───────────────────────────────────
const isOrderRoute = computed(() => {
  if (!props.order) return false
  const orderFromId = props.order.fromOffice?.id || props.order.fromOfficeId
  const orderToId = props.order.toOffice?.id || props.order.toOfficeId
  return Boolean(orderFromId && orderToId && form.fromOfficeId === orderFromId && form.toOfficeId === orderToId)
})

const effectiveEstimatedPrice = computed<number | null>(() => {
  if (!isOrderRoute.value) return null
  const ep = Number(props.order?.estimatedPrice)
  return !isNaN(ep) && ep > 0 ? ep : null
})

const isLockedTariff = computed(() => {
  return Boolean(isOrderRoute.value && props.order?.tariffRateAtBooking)
})

const effectiveTariff = computed(() => {
  if (isLockedTariff.value && props.order?.tariffRateAtBooking) {
    return {
      pricePerKg: props.order.tariffRateAtBooking,
      isLocked: true
    }
  }
  if (routeTariff.value) {
    return routeTariff.value
  }
  if (effectiveEstimatedPrice.value !== null) {
    return {
      pricePerKg: effectiveEstimatedPrice.value,
      isEstimated: true
    }
  }
  return null
})

const {
  formatPrice,
  volumetricDivisor,
  numericWeight,
  volumetricWeight,
  chargeableWeight,
  billableWeight,
  isVolumetricLarger,
  tariffPricePerKg,
  minimumPrice,
  calculatedOrderPrice
} = useOrderCalculation(form, effectiveTariff, settings)

// ─── Edit Mode State ───────────────────────────────────────────────────────
const isEditing = computed(() => !!props.order)
const isUnderReview = computed(() => !props.order || props.order.status === 'UNDER_REVIEW' || props.order.status === 'PENDING_ESTIMATE')
const canEditAllDetails = computed(() => !isEditing.value || isUnderReview.value)

// ─── Agreement State ───────────────────────────────────────────────────────
const isAgreed = ref(false)

// ─── Submit Button State ───────────────────────────────────────────────────
const submitButtonText = computed(() => {
  if (props.isSubmitting) {
    if (isRouteTariffMissing.value && !effectiveEstimatedPrice.value) return t('orders.requestingShippingPrice')
    if (isEditing.value) return t('orders.saving')
    return t('orders.submitting')
  }
  if (isRouteTariffMissing.value && !effectiveEstimatedPrice.value) return t('orders.requestShippingPrice')
  if (isEditing.value) return t('orders.saveChanges')
  return t('orders.submit')
})

const isSubmitDisabled = computed(() => {
  if (props.isSubmitting) return true
  if (!isAgreed.value) return true
  if (hasSelectedRoute.value && isRouteTariffLoading.value) return true
  if (hasSelectedRoute.value && routeTariffError.value) return true
  return false
})

// ─── Derived Options ────────────────────────────────────────────────────────
const officeOptions = computed(() =>
  offices.value.map(o => ({
    value: o.id,
    label: [o.city, o.country?.enName
].filter(Boolean).join(', ')
  }))
)

const destinationOfficeOptions = computed(() =>
  offices.value
    .filter(o => o.id !== form.fromOfficeId)
    .map(o => ({
      value: o.id,
      label: [o.city, o.country?.enName].filter(Boolean).join(', ')
    }))
)

const receiverOptions = computed(() =>
  receivers.value.map(r => ({
    value: r.id,
    label: `${r.firstName} ${r.lastName}`
  }))
)

const currencyOptions = computed(() => [
  { value: 'USD', label: 'USD – US Dollar' },
  { value: 'EUR', label: 'EUR – Euro' },
  { value: 'AED', label: 'AED – UAE Dirham' },
  { value: 'RUB', label: 'RUB – Russian Ruble' },
  { value: 'AMD', label: 'AMD – Armenian Dram' }
])

const hasSelectedRoute = computed(() =>
  Boolean(form.fromOfficeId && form.toOfficeId && form.fromOfficeId !== form.toOfficeId)
)

const selectedRouteLabel = computed(() => {
  const from = offices.value.find(o => o.id === form.fromOfficeId)
  const to = offices.value.find(o => o.id === form.toOfficeId)
  if (!from || !to) return ''
  const fromCity = from.city || from.province || ''
  const toCity = to.city || to.province || ''
  return fromCity && toCity ? `${fromCity} → ${toCity}` : ''
})

// ─── Tariff Route Fetching ──────────────────────────────────────────────────
let latestTariffRequestId = 0
let activeRouteKey = ''

const loadTariffForCurrentRoute = async (force = false) => {
  const fromId = form.fromOfficeId
  const toId = form.toOfficeId

  if (!fromId || !toId || fromId === toId) {
    activeRouteKey = ''
    clearRouteTariff()
    return
  }

  const routeKey = `${fromId}->${toId}`
  if (!force && routeKey === activeRouteKey && (routeTariff.value || isRouteTariffLoading.value || isRouteTariffMissing.value)) {
    return
  }

  activeRouteKey = routeKey
  clearRouteTariff()

  const currentRequestId = ++latestTariffRequestId
  await fetchTariffByRoute(fromId, toId)

  if (
    currentRequestId !== latestTariffRequestId ||
    form.fromOfficeId !== fromId ||
    form.toOfficeId !== toId
  ) {
    clearRouteTariff()
    activeRouteKey = ''
  }
}

// ─── Background Page Scroll Lock ───────────────────────────────────────────
let originalOverflow = ''
let originalPaddingRight = ''
let isScrollLocked = false

const lockScroll = () => {
  if (!import.meta.client || isScrollLocked) return
  originalOverflow = document.body.style.overflow
  originalPaddingRight = document.body.style.paddingRight

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
  document.body.style.overflow = 'hidden'
  isScrollLocked = true
}

const unlockScroll = () => {
  if (!import.meta.client || !isScrollLocked) return
  document.body.style.overflow = originalOverflow
  document.body.style.paddingRight = originalPaddingRight
  isScrollLocked = false
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen && !props.isSubmitting) {
    handleClose()
  }
}

// ─── Watchers & Lifecycle ──────────────────────────────────────────────────
watch(
  () => props.isOpen,
  async (isOpen) => {
    isAgreed.value = false
    if (isOpen) {
      lockScroll()
      populateForm(props.order)
      loadTariffForCurrentRoute()
      await Promise.all([
        fetchOffices(),
        fetchReceivers(),
        fetchSettings()
      ])
    } else {
      unlockScroll()
      activeRouteKey = ''
      clearRouteTariff()
      resetForm()
    }
  },
  { immediate: false }
)

watch(
  () => props.order,
  (newOrder) => {
    if (props.isOpen) {
      populateForm(newOrder)
      loadTariffForCurrentRoute()
    }
  }
)

watch(
  [() => form.fromOfficeId, () => form.toOfficeId],
  () => {
    loadTariffForCurrentRoute()
  }
)

watch(
  () => form.fromOfficeId,
  () => {
    if (form.toOfficeId === form.fromOfficeId) {
      form.toOfficeId = ''
    }
  }
)

onMounted(() => {
  if (props.isOpen) {
    lockScroll()
  }
  if (import.meta.client) {
    window.addEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  unlockScroll()
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeydown)
  }
})

// ─── Submit & Close ──────────────────────────────────────────────────────────
const handleSubmit = () => {
  if (props.isSubmitting) return
  if (!isAgreed.value) return
  if (!validate(canEditAllDetails.value)) return
  if (hasSelectedRoute.value && isRouteTariffLoading.value) return

  // If a tariff exists for the route (standard or estimated), price calculation is required
  if (effectiveTariff.value && (calculatedOrderPrice.value === null || calculatedOrderPrice.value === undefined)) {
    return
  }

  // When route tariff is missing and no estimated price exists, shipping price is optional and passed as null so inquiry is created with PENDING_ESTIMATE status
  const shippingPrice = (isRouteTariffMissing.value && !effectiveEstimatedPrice.value)
    ? null
    : calculatedOrderPrice.value

  const payload = buildPayload(
    isEditing.value,
    canEditAllDetails.value,
    shippingPrice
  )
  emit('submit', payload)
}

const handleClose = () => {
  if (!props.isSubmitting) {
    isAgreed.value = false
    emit('close')
  }
}
</script>

<style scoped>
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.25s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
