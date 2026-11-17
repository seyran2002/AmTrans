<template>
  <Transition name="fade-modal">
    <div
      v-if="isOpen"
      class="popup fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm !mt-0"
      @click.self="handleClose"
    >
      <div
        class="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 transform transition-all animate-scale-up flex flex-col max-h-[calc(100vh-70px)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        :aria-label="isEditing ? t('office.editOffice') : t('office.addOffice')"
      >
        <!-- Modal Header (Fixed / Sticky at Top) -->
        <div class="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div class="flex items-center gap-2.5 sm:gap-3">
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 shadow-xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 10V11m0 0h6M11 11H5" />
              </svg>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {{ isEditing ? t('office.editOffice') : t('office.addOffice') }}
              </h3>
              <p class="text-[11px] sm:text-xs text-slate-500 font-medium leading-normal mt-0.5">
                {{ isEditing ? t('office.editOfficeSubTitle') : t('office.addOfficeSubTitle') }}
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="handleClose"
            :disabled="isSubmitting"
            class="min-h-[36px] min-w-[36px] p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            :aria-label="t('office.cancel')"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form (Wraps Scrollable Body + Fixed Footer) -->
        <form @submit.prevent="handleSubmit" class="flex flex-col flex-1 min-h-0 overflow-hidden">
          <!-- Scrollable Body Area -->
          <div class="px-4 sm:px-6 py-3.5 sm:py-4 space-y-3 sm:space-y-3.5 flex-1 overflow-y-auto overscroll-contain">
            <!-- Alert Banner for Top Level Error -->
            <div v-if="error" class="animate-fade-in">
              <AlertBanner :message="error" />
            </div>

            <!-- Latin letters notice before input fields -->
            <p class="text-xs text-slate-500 font-medium">
              {{ t('latin') }}
            </p>

            <!-- Country Dropdown (Required) -->
            <BaseSelect
              id="office-country"
              v-model="form.countryId"
              :label="t('office.country')"
              :placeholder="t('office.selectCountry')"
              :options="countryOptions"
              :required="true"
              :error="touched.countryId ? errors.countryId : ''"
              @change="touched.countryId = true; validateForm()"
            />

            <!-- Province / State & City (2 columns on sm) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <BaseInput
                id="office-province"
                v-model="form.province"
                :label="t('office.province')"
                :placeholder="t('office.provincePlaceholder')"
                :required="true"
                :error="errors.province"
                :touched="touched.province"
                @blur="touched.province = true"
              />

              <BaseInput
                id="office-city"
                v-model="form.city"
                :label="t('office.city')"
                :placeholder="t('office.cityPlaceholder')"
                :required="true"
                :error="errors.city"
                :touched="touched.city"
                @blur="touched.city = true"
              />
            </div>

            <!-- Postal Code -->
            <BaseInput
              id="office-postal-code"
              v-model="form.postalCode"
              :label="t('office.postalCode')"
              :placeholder="t('office.postalCodePlaceholder')"
              :required="false"
              :error="errors.postalCode"
              :touched="touched.postalCode"
              @blur="touched.postalCode = true"
            />

            <!-- Full Address -->
            <div class="space-y-1 w-full">
              <label for="office-full-address" class="block text-xs font-bold uppercase tracking-wider text-primary/90">
                {{ t('office.fullAddress') }}
                <span class="text-tertiary ml-0.5 font-bold">*</span>
              </label>
              <textarea
                id="office-full-address"
                v-model="form.fullAddress"
                rows="2"
                :placeholder="t('office.fullAddressPlaceholder')"
                @blur="touched.fullAddress = true"
                :class="[
                  'w-full p-2.5 sm:p-3 text-xs sm:text-sm font-medium transition-all duration-200 outline-none rounded-xl text-slate-800 placeholder:text-slate-400/80 shadow-xs resize-none',
                  touched.fullAddress && errors.fullAddress
                    ? 'border-2 border-tertiary/80 bg-red-50/40 text-tertiary focus:border-tertiary focus:ring-4 focus:ring-tertiary/10'
                    : 'border border-slate-200/90 bg-white/90 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:shadow-xs'
                ]"
              ></textarea>
              <p v-if="touched.fullAddress && errors.fullAddress" class="text-xs text-tertiary font-semibold flex items-center gap-1.5 mt-1 animate-fade-in">
                <svg class="w-3.5 h-3.5 shrink-0 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{{ errors.fullAddress }}</span>
              </p>
            </div>

            <!-- Phone Number Input (Required) -->
            <PhoneInput
              v-model="form.phone"
              :label="t('office.phone')"
              :placeholder="t('office.phonePlaceholder')"
              :required="true"
              :error="touched.phone ? errors.phone : ''"
            />
          </div>

          <!-- Modal Footer (Fixed / Sticky at Bottom) -->
          <div class="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2.5 shrink-0">
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              :block="false"
              class="!min-h-[36px] !py-1.5 !px-4 text-xs"
              :disabled="isSubmitting"
              @click="handleClose"
            >
              {{ t('office.cancel') }}
            </BaseButton>

            <BaseButton
              type="submit"
              variant="primary"
              size="sm"
              :block="false"
              class="!min-h-[36px] !py-1.5 !px-5 text-xs"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? t('office.saving') : t('office.saveOffice') }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { reactive, watch, computed, onMounted, onUnmounted } from 'vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import PhoneInput from '~/components/ui/PhoneInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import { useI18n } from '~/composables/useI18n'
import type { Office, Country, CreateOfficePayload } from '~/types/office'

const props = defineProps<{
  isOpen: boolean
  office?: Office | null
  countries: Country[]
  isSubmitting?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: CreateOfficePayload): void
}>()

const { t, currentLanguage } = useI18n()

const isEditing = computed(() => !!props.office)

const countryOptions = computed(() => {
  return props.countries.map(c => {
    const langKey = `${currentLanguage.value}Name` as keyof typeof c
    const name = (c[langKey] as string) || c.enName || c.hyName || c.ruName
    return {
      value: c.id,
      label: name
    }
  })
})

const form = reactive<{
  countryId: string
  province: string
  city: string
  postalCode: string
  fullAddress: string
  phone: string
}>({
  countryId: '',
  province: '',
  city: '',
  postalCode: '',
  fullAddress: '',
  phone: ''
})

const touched = reactive<{
  countryId: boolean
  province: boolean
  city: boolean
  postalCode: boolean
  fullAddress: boolean
  phone: boolean
}>({
  countryId: false,
  province: false,
  city: false,
  postalCode: false,
  fullAddress: false,
  phone: false
})

const errors = reactive<{
  countryId: string
  province: string
  city: string
  postalCode: string
  fullAddress: string
  phone: string
}>({
  countryId: '',
  province: '',
  city: '',
  postalCode: '',
  fullAddress: '',
  phone: ''
})

const resetForm = () => {
  if (props.office) {
    form.countryId = props.office.countryId || ''
    form.province = props.office.province || ''
    form.city = props.office.city || ''
    form.postalCode = props.office.postalCode || ''
    form.fullAddress = props.office.fullAddress || ''
    form.phone = props.office.phone || ''
  } else {
    form.countryId = props.countries[0]?.id || ''
    form.province = ''
    form.city = ''
    form.postalCode = ''
    form.fullAddress = ''
    form.phone = ''
  }

  touched.countryId = false
  touched.province = false
  touched.city = false
  touched.postalCode = false
  touched.fullAddress = false
  touched.phone = false

  errors.countryId = ''
  errors.province = ''
  errors.city = ''
  errors.postalCode = ''
  errors.fullAddress = ''
  errors.phone = ''
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
  (newIsOpen) => {
    if (newIsOpen) {
      lockScroll()
      resetForm()
    } else {
      unlockScroll()
    }
  },
  { immediate: true }
)

watch(
  () => [props.office, props.countries],
  () => {
    if (props.isOpen) {
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

const validateForm = (): boolean => {
  let isValid = true

  if (!form.countryId) {
    errors.countryId = t('office.errCountryRequired')
    isValid = false
  } else {
    errors.countryId = ''
  }

  if (!form.province.trim()) {
    errors.province = t('office.errProvinceRequired')
    isValid = false
  } else {
    errors.province = ''
  }

  if (!form.city.trim()) {
    errors.city = t('office.errCityRequired')
    isValid = false
  } else {
    errors.city = ''
  }

  errors.postalCode = ''

  if (!form.fullAddress.trim()) {
    errors.fullAddress = t('office.errFullAddressRequired')
    isValid = false
  } else {
    errors.fullAddress = ''
  }

  if (!form.phone.trim() || form.phone.trim().length < 5) {
    errors.phone = t('office.errPhoneRequired')
    isValid = false
  } else {
    errors.phone = ''
  }

  return isValid
}

const handleSubmit = () => {
  touched.countryId = true
  touched.province = true
  touched.city = true
  touched.postalCode = true
  touched.fullAddress = true
  touched.phone = true

  if (!validateForm()) return

  emit('submit', {
    countryId: form.countryId,
    province: form.province.trim(),
    city: form.city.trim(),
    postalCode: form.postalCode.trim() || undefined,
    fullAddress: form.fullAddress.trim(),
    phone: form.phone.trim()
  })
}

const handleClose = () => {
  if (!props.isSubmitting) {
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
