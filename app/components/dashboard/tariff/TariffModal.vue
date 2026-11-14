<template>
  <Transition name="fade-modal">
    <div
      v-if="isOpen"
      class="popup fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
      @click.self="handleClose"
    >
      <div
        class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transform transition-all animate-scale-up my-8"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900">
                {{ tariff ? t('tariffs.editTariff') : t('tariffs.addTariff') }}
              </h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">
                {{ tariff ? t('tariffs.edit') : t('tariffs.addTariff') }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="handleClose"
            :disabled="isSubmitting"
            class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Alert Error Banner inside Modal -->
        <div v-if="error" class="mb-5">
          <AlertBanner :message="error" />
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Origin Office -->
          <BaseSelect
            id="tariff-from-office"
            v-model="form.fromOfficeId"
            :options="originOfficeOptions"
            :label="t('tariffs.originOffice')"
            :placeholder="t('tariffs.selectOriginOffice')"
            :required="true"
            :disabled="isSubmitting"
            :error="touched.fromOfficeId ? errors.fromOfficeId : ''"
            @update:model-value="onFromOfficeChange"
          />

          <!-- Destination Office -->
          <BaseSelect
            id="tariff-to-office"
            v-model="form.toOfficeId"
            :options="destinationOfficeOptions"
            :label="t('tariffs.destinationOffice')"
            :placeholder="t('tariffs.selectDestinationOffice')"
            :required="true"
            :disabled="isSubmitting"
            :error="touched.toOfficeId ? errors.toOfficeId : ''"
            @update:model-value="onToOfficeChange"
          />

          <!-- Price per kg (AMD) -->
          <BaseInput
            id="tariff-price-per-kg"
            v-model="form.pricePerKg"
            type="number"
            min="0.01"
            step="0.01"
            :label="t('tariffs.pricePerKg')"
            :placeholder="t('tariffs.pricePerKgPlaceholder')"
            :required="true"
            :disabled="isSubmitting"
            :error="touched.pricePerKg ? errors.pricePerKg : ''"
            :touched="touched.pricePerKg"
            @blur="touched.pricePerKg = true; validateForm()"
          >
            <template #icon>
              <span class="text-xs font-bold text-slate-400 uppercase">AMD</span>
            </template>
          </BaseInput>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <BaseButton
              type="button"
              variant="outline"
              size="md"
              :block="false"
              :disabled="isSubmitting"
              @click="handleClose"
            >
              {{ t('tariffs.cancel') }}
            </BaseButton>

            <BaseButton
              type="submit"
              variant="primary"
              size="md"
              :block="false"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? t('tariffs.saving') : t('tariffs.save') }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect, { type SelectOption } from '~/components/ui/BaseSelect.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import type { Tariff, CreateTariffPayload, UpdateTariffPayload } from '~/types/tariff'
import type { Office } from '~/types/office'

const props = defineProps<{
  isOpen: boolean
  tariff?: Tariff | null
  offices: Office[]
  isSubmitting: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save-create', payload: CreateTariffPayload): void
  (e: 'save-edit', payload: UpdateTariffPayload): void
}>()

const { t, currentLanguage } = useI18n()

const form = reactive({
  fromOfficeId: '',
  toOfficeId: '',
  pricePerKg: ''
})

const errors = reactive({
  fromOfficeId: '',
  toOfficeId: '',
  pricePerKg: ''
})

const touched = reactive({
  fromOfficeId: false,
  toOfficeId: false,
  pricePerKg: false
})

const formatOfficeOption = (office: Office): string => {
  const country = office.country
  const countryName = country
    ? (currentLanguage.value === 'hy'
        ? (country.hyName || country.enName)
        : currentLanguage.value === 'ru'
          ? (country.ruName || country.enName)
          : (country.enName || country.hyName))
    : (office.countryName || '')
  return [office.city, office.province, countryName].filter(Boolean).join(', ')
}

const originOfficeOptions = computed<SelectOption[]>(() =>
  props.offices.map(o => ({
    value: o.id,
    label: formatOfficeOption(o)
  }))
)

const destinationOfficeOptions = computed<SelectOption[]>(() =>
  props.offices
    .filter(o => !form.fromOfficeId || o.id !== form.fromOfficeId)
    .map(o => ({
      value: o.id,
      label: formatOfficeOption(o)
    }))
)

const resetForm = () => {
  if (props.tariff) {
    form.fromOfficeId = props.tariff.fromOfficeId || ''
    form.toOfficeId = props.tariff.toOfficeId || ''
    form.pricePerKg = props.tariff.pricePerKg !== undefined ? String(props.tariff.pricePerKg) : ''
  } else {
    form.fromOfficeId = ''
    form.toOfficeId = ''
    form.pricePerKg = ''
  }

  errors.fromOfficeId = ''
  errors.toOfficeId = ''
  errors.pricePerKg = ''

  touched.fromOfficeId = false
  touched.toOfficeId = false
  touched.pricePerKg = false
}

watch(
  () => [props.isOpen, props.tariff],
  () => {
    if (props.isOpen) {
      resetForm()
    }
  },
  { immediate: true }
)

const onFromOfficeChange = (val: string) => {
  form.fromOfficeId = val
  touched.fromOfficeId = true
  if (form.toOfficeId === val) {
    form.toOfficeId = ''
  }
  validateForm()
}

const onToOfficeChange = (val: string) => {
  form.toOfficeId = val
  touched.toOfficeId = true
  validateForm()
}

const validateForm = (): boolean => {
  let isValid = true

  // From office
  if (!form.fromOfficeId) {
    errors.fromOfficeId = t('tariffs.errFromOfficeRequired')
    isValid = false
  } else {
    errors.fromOfficeId = ''
  }

  // To office
  if (!form.toOfficeId) {
    errors.toOfficeId = t('tariffs.errToOfficeRequired')
    isValid = false
  } else if (form.fromOfficeId && form.fromOfficeId === form.toOfficeId) {
    errors.toOfficeId = t('tariffs.errSameOffice')
    isValid = false
  } else {
    errors.toOfficeId = ''
  }

  // Price
  const price = Number(form.pricePerKg)
  if (!form.pricePerKg || String(form.pricePerKg).trim() === '') {
    errors.pricePerKg = t('tariffs.errPriceRequired')
    isValid = false
  } else if (isNaN(price) || price <= 0) {
    errors.pricePerKg = t('tariffs.errPricePositive')
    isValid = false
  } else {
    errors.pricePerKg = ''
  }

  return isValid
}

const handleSubmit = () => {
  touched.fromOfficeId = true
  touched.toOfficeId = true
  touched.pricePerKg = true

  if (!validateForm()) return

  if (props.tariff) {
    // Edit mode: send only changed fields
    const changedFields: UpdateTariffPayload = {}

    if (form.fromOfficeId !== props.tariff.fromOfficeId) {
      changedFields.fromOfficeId = form.fromOfficeId
    }
    if (form.toOfficeId !== props.tariff.toOfficeId) {
      changedFields.toOfficeId = form.toOfficeId
    }
    if (Number(form.pricePerKg) !== Number(props.tariff.pricePerKg)) {
      changedFields.pricePerKg = Number(form.pricePerKg)
    }

    emit('save-edit', changedFields)
  } else {
    // Create mode
    emit('save-create', {
      fromOfficeId: form.fromOfficeId,
      toOfficeId: form.toOfficeId,
      pricePerKg: Number(form.pricePerKg)
    })
  }
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
