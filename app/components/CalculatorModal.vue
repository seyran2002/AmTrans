<template>
  <Transition name="fade-modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center !mt-0 pb-[70px] p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <div
        class="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 transform transition-all animate-scale-up flex flex-col max-h-[calc(100vh-130px)] max-h-[calc(100dvh-130px)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        :aria-label="t('calculator.title')"
      >
        <!-- Modal Header (Fixed / Sticky at Top) -->
        <div class="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div class="flex items-center gap-2.5 sm:gap-3">
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.5h6" />
              </svg>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {{ t('calculator.title') }}
              </h3>
              <p class="text-[11px] sm:text-xs text-slate-600 font-medium leading-normal mt-0.5">
                {{ t('calculator.subtitle') }}
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="handleClose"
            class="min-h-[36px] min-w-[36px] p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center cursor-pointer"
            :aria-label="t('calculator.close')"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Scrollable Calculator Body -->
        <div class="px-4 sm:px-6 py-3.5 sm:py-4 space-y-3 sm:space-y-3.5 flex-1 overflow-y-auto overscroll-contain">
          <!-- ── Route Selection ────────────────────────────────────────── -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <BaseSelect
              id="calcFromOfficeId"
              v-model="form.fromOfficeId"
              :label="t('calculator.fromOffice')"
              :placeholder="t('calculator.fromOfficePlaceholder')"
              :options="officeOptions"
              :disabled="officesLoading"
            />

            <BaseSelect
              id="calcToOfficeId"
              v-model="form.toOfficeId"
              :label="t('calculator.toOffice')"
              :placeholder="t('calculator.toOfficePlaceholder')"
              :options="destinationOfficeOptions"
              :disabled="officesLoading"
            />
          </div>

          <!-- ── Route Tariff Status ──────────────────────────────────── -->
          <!-- Loading -->
          <div
            v-if="isRouteTariffLoading"
            class="p-2.5 sm:p-3 bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl flex items-center gap-2.5 text-xs text-slate-600 font-medium animate-pulse"
          >
            <svg class="w-4 h-4 animate-spin text-primary shrink-0" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{{ t('calculator.loadingTariff') }}</span>
          </div>

          <!-- Active Tariff Available -->
          <div
            v-else-if="tariffPricePerKg !== null"
            class="p-2.5 sm:p-3 bg-primary/[0.04] border border-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-between gap-2.5"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <div class="truncate">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-bold text-primary uppercase tracking-wider">
                    {{ selectedRouteLabel || t('calculator.tariffRate') }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                  {{ t('calculator.minimumPrice').replace('{amount}', formatPrice(minimumPrice) + ' AMD') }}
                </p>
              </div>
            </div>

            <div class="shrink-0 text-right">
              <div class="inline-flex items-baseline gap-1 px-2.5 py-1 bg-white border border-primary/20 rounded-xl shadow-xs">
                <span class="text-sm sm:text-base font-extrabold text-primary">
                  {{ formatPrice(tariffPricePerKg) }}
                </span>
                <span class="text-[11px] font-bold text-primary">AMD / kg</span>
              </div>
            </div>
          </div>

          <!-- Tariff Missing for Route -->
          <div
            v-else-if="hasSelectedRoute && isRouteTariffMissing"
            class="p-2.5 sm:p-3 bg-amber-50 border border-amber-200/80 rounded-xl sm:rounded-2xl flex items-center gap-2 text-xs text-amber-800 font-medium"
          >
            <svg class="w-4 h-4 text-amber-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ t('calculator.noTariffForRoute') }}</span>
          </div>

          <!-- Prompt: Select route -->
          <div
            v-else-if="!hasSelectedRoute"
            class="p-2.5 sm:p-3 bg-slate-50 border border-slate-200/70 rounded-xl sm:rounded-2xl flex items-center gap-2 text-xs text-slate-600 font-medium"
          >
            <svg class="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ t('calculator.selectRoutePrompt') }}</span>
          </div>

          <!-- ── Dimensions & Weight ────────────────────────────────────── -->
          <div>
            <div class="flex items-center justify-between mb-1.5 sm:mb-2">
              <p class="text-xs font-bold uppercase tracking-wider text-primary">
                {{ t('calculator.dimensions') }}
                <span class="text-slate-600 normal-case font-medium ml-1">(cm / kg)</span>
              </p>
              <span
                v-if="volumetricDivisor"
                class="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200"
                :title="t('calculator.volumetricFormula').replace('{divisor}', String(volumetricDivisor))"
              >
                Divisor: {{ volumetricDivisor }}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              <BaseInput
                id="calcWeight"
                v-model="form.weight"
                type="number"
                min="0"
                step="0.01"
                :label="t('calculator.weight')"
                :placeholder="t('calculator.weightPlaceholder')"
              />
              <BaseInput
                id="calcLength"
                v-model="form.length"
                type="number"
                min="0"
                step="0.1"
                :label="t('calculator.length')"
                :placeholder="t('calculator.lengthPlaceholder')"
              />
              <BaseInput
                id="calcWidth"
                v-model="form.width"
                type="number"
                min="0"
                step="0.1"
                :label="t('calculator.width')"
                :placeholder="t('calculator.widthPlaceholder')"
              />
              <BaseInput
                id="calcHeight"
                v-model="form.height"
                type="number"
                min="0"
                step="0.1"
                :label="t('calculator.height')"
                :placeholder="t('calculator.heightPlaceholder')"
              />
            </div>
          </div>

          <!-- ── Calculation Results Card ───────────────────────────────── -->
          <div
            v-if="hasFullInput && tariffPricePerKg !== null"
            class="bg-gradient-to-br from-slate-50 to-primary/[0.03] border border-slate-200/90 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xs space-y-2.5 sm:space-y-3"
          >
            <!-- Weight Breakdown 3-col Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              <!-- Actual Weight -->
              <div
                :class="[
                  'p-2.5 rounded-xl border transition-all',
                  !isVolumetricLarger
                    ? 'bg-primary/5 border-primary/25 ring-1 ring-primary/20'
                    : 'bg-white border-slate-200'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-semibold text-slate-700">{{ t('calculator.actualWeight') }}</span>
                  <span v-if="!isVolumetricLarger" class="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {{ t('calculator.largerWeightApplied') }}
                  </span>
                </div>
                <p class="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  {{ numericWeight?.toFixed(2) }} <span class="text-xs font-semibold text-slate-600">kg</span>
                </p>
              </div>

              <!-- Volumetric Weight -->
              <div
                :class="[
                  'p-2.5 rounded-xl border transition-all',
                  isVolumetricLarger
                    ? 'bg-primary/5 border-primary/25 ring-1 ring-primary/20'
                    : 'bg-white border-slate-200'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-semibold text-slate-700">{{ t('calculator.volumetricWeight') }}</span>
                  <span v-if="isVolumetricLarger" class="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {{ t('calculator.largerWeightApplied') }}
                  </span>
                </div>
                <p class="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  {{ volumetricWeight?.toFixed(2) }} <span class="text-xs font-semibold text-slate-600">kg</span>
                </p>
              </div>

              <!-- Billable Weight (Minimum 5kg Enforced) -->
              <div class="p-2.5 rounded-xl bg-primary/10 border border-primary/30">
                <div class="flex items-center justify-between gap-1">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-primary">{{ t('calculator.billableWeight') }}</span>
                  <span
                    v-if="billableWeight !== null && chargeableWeight !== null && billableWeight > chargeableWeight"
                    class="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded whitespace-nowrap"
                  >
                    min 5 kg
                  </span>
                </div>
                <p class="text-sm sm:text-base font-black text-primary mt-0.5">
                  {{ billableWeight?.toFixed(2) }} <span class="text-xs font-bold text-primary">kg</span>
                </p>
              </div>
            </div>

            <!-- Minimum Weight Rule Notice (when weight is under 5kg) -->
            <div
              v-if="chargeableWeight !== null && chargeableWeight < 5"
              class="flex items-center gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1.5 font-medium"
            >
              <svg class="w-4 h-4 text-amber-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {{ t('calculator.minWeightApplied') }}
              </span>
            </div>

            <!-- Rate Banner & Final Calculated Price -->
            <div class="pt-2.5 border-t border-slate-200/80 flex flex-col gap-2">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 text-xs text-slate-700 font-medium flex-wrap">
                  <span>{{ t('calculator.tariffRate') }}:</span>
                  <span class="font-bold text-slate-900">
                    {{ formatPrice(tariffPricePerKg) }} AMD / kg
                  </span>
                  <span class="text-slate-600 font-bold">×</span>
                  <span class="font-bold text-slate-900">{{ billableWeight?.toFixed(2) }} kg</span>
                </div>

                <div class="flex items-baseline justify-between sm:justify-end gap-2">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {{ t('calculator.calculatedShippingPrice') }}:
                  </span>
                  <div class="inline-flex items-baseline gap-1 px-2.5 py-1 bg-primary text-white rounded-lg shadow-xs">
                    <span class="text-sm sm:text-base font-black tracking-tight">
                      {{ formatPrice(calculatedOrderPrice) }}
                    </span>
                    <span class="text-[11px] font-bold text-white">AMD</span>
                  </div>
                </div>
              </div>

              <!-- Minimum price notice -->
              <div
                v-if="minimumPrice !== null"
                class="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1"
              >
                <svg class="w-3.5 h-3.5 shrink-0 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">
                  {{ t('calculator.minimumPrice').replace('{amount}', formatPrice(minimumPrice) + ' AMD') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Prompt: Enter dimensions -->
          <div
            v-else-if="tariffPricePerKg !== null && !hasFullInput"
            class="p-2.5 sm:p-3 bg-slate-50 border border-slate-200/70 rounded-xl sm:rounded-2xl flex items-center gap-2 text-xs text-slate-600 font-medium"
          >
            <svg class="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ t('calculator.enterDimensionsPrompt') }}</span>
          </div>
        </div>

        <!-- ── Modal Footer (Fixed / Sticky at Bottom) ────────────────── -->
        <div class="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
          <button
            type="button"
            @click="resetForm"
            class="min-h-[36px] text-xs font-bold text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none flex items-center justify-center"
          >
            {{ t('calculator.reset') }}
          </button>

          <BaseButton
            type="button"
            variant="outline"
            size="sm"
            :block="false"
            class="!min-h-[36px] !py-1.5 !px-4 text-xs"
            @click="handleClose"
          >
            {{ t('calculator.close') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

import { useI18n } from '~/composables/useI18n'
import { useOffices } from '~/composables/useOffices'
import { useTariffs } from '~/composables/useTariffs'
import { useSystemSettings } from '~/composables/useSystemSettings'
import { useOrderCalculation } from '~/composables/useOrderCalculation'
import type { Country } from '~/types/office'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// ─── Composables ────────────────────────────────────────────────────────────
const { t, currentLanguage } = useI18n()
const { offices, isLoading: officesLoading, fetchOffices } = useOffices()
const {
  routeTariff,
  isRouteTariffLoading,
  isRouteTariffMissing,
  clearRouteTariff,
  fetchTariffByRoute
} = useTariffs()
const { settings, fetchSettings } = useSystemSettings()

// ─── Form State ─────────────────────────────────────────────────────────────
const form = reactive({
  fromOfficeId: '',
  toOfficeId: '',
  weight: '',
  length: '',
  width: '',
  height: ''
})

const resetForm = () => {
  form.fromOfficeId = ''
  form.toOfficeId = ''
  form.weight = ''
  form.length = ''
  form.width = ''
  form.height = ''
  clearRouteTariff()
  activeRouteKey = ''
}

// ─── Calculation Composable ────────────────────────────────────────────────
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
} = useOrderCalculation(form, routeTariff, settings)

// ─── Derived State & Options ───────────────────────────────────────────────
const officeOptions = computed(() =>
  offices.value.map(o => ({
    value: o.id,
    label: [o.fullAddress, o.country?.[`${currentLanguage.value}Name` as keyof Country]].filter(Boolean).join(', ')
  }))
)

const destinationOfficeOptions = computed(() =>
  offices.value
    .filter(o => o.id !== form.fromOfficeId)
    .map(o => ({
      value: o.id,
      label: [o.fullAddress, o.country?.[`${currentLanguage.value}Name` as keyof Country]].filter(Boolean).join(', ')
    }))
)

const hasSelectedRoute = computed(() =>
  Boolean(form.fromOfficeId && form.toOfficeId && form.fromOfficeId !== form.toOfficeId)
)

const hasFullInput = computed(() =>
  Boolean(
    numericWeight.value !== null &&
    volumetricWeight.value !== null &&
    hasSelectedRoute.value
  )
)

const selectedRouteLabel = computed(() => {
  const from = offices.value.find(o => o.id === form.fromOfficeId)
  const to = offices.value.find(o => o.id === form.toOfficeId)
  if (!from || !to) return ''
  const fromCity = from.city || from.province || ''
  const toCity = to.city || to.province || ''
  return fromCity && toCity ? `${fromCity} → ${toCity}` : ''
})

// ─── Route Tariff Fetching ──────────────────────────────────────────────────
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
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

// ─── Watchers & Lifecycle ──────────────────────────────────────────────────
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

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      lockScroll()
      await Promise.all([
        fetchOffices(),
        fetchSettings()
      ])
      if (hasSelectedRoute.value) {
        loadTariffForCurrentRoute()
      }
    } else {
      unlockScroll()
      resetForm()
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

const handleClose = () => {
  emit('close')
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
