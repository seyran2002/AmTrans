<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useSystemSettings } from '~/composables/useSystemSettings'
import { useTariffs } from '~/composables/useTariffs'
import { useOffices } from '~/composables/useOffices'
import BaseButton from '~/components/ui/BaseButton.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import SuccessBanner from '~/components/ui/SuccessBanner.vue'
import TariffTable from '~/components/dashboard/tariff/TariffTable.vue'
import TariffModal from '~/components/dashboard/tariff/TariffModal.vue'
import DeleteTariffModal from '~/components/dashboard/tariff/DeleteTariffModal.vue'
import type { Tariff, CreateTariffPayload, UpdateTariffPayload } from '~/types/tariff'

definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'dashboard'
})

const { t } = useI18n()

// ── System Settings ─────────────────────────────────────────────────────────
const {
  settings,
  isLoading,
  isSaving,
  error,
  fetchSettings,
  saveSettings,
  clearMessages
} = useSystemSettings()

// Local form state
const volumetricDivisorInput = ref<string>('')
const touched = ref(false)

// Page-level notifications
const pageSuccessMessage = ref<string | null>(null)
const pageErrorMessage = ref<string | null>(null)

const showNotification = (msg: string, isError = false) => {
  if (isError) {
    pageErrorMessage.value = msg
    setTimeout(() => { pageErrorMessage.value = null }, 5000)
  } else {
    pageSuccessMessage.value = msg
    setTimeout(() => { pageSuccessMessage.value = null }, 4000)
  }
}

// Sync input when settings load
const syncFormFromSettings = () => {
  if (settings.value) {
    volumetricDivisorInput.value = String(settings.value.volumetricDivisor)
  }
}

// Validation
const validationError = computed<string>(() => {
  if (!touched.value) return ''
  const val = Number(volumetricDivisorInput.value)
  if (!volumetricDivisorInput.value.trim()) return t('systemSettings.errRequired')
  if (!Number.isInteger(val) || val < 1) return t('systemSettings.errPositiveInt')
  if (val > 100000) return t('systemSettings.errTooLarge')
  return ''
})

const isFormValid = computed(() => {
  const val = Number(volumetricDivisorInput.value)
  return Number.isInteger(val) && val >= 1 && val <= 100000
})

const isDirty = computed(() => {
  if (!settings.value) return false
  return Number(volumetricDivisorInput.value) !== settings.value.volumetricDivisor
})

const handleSave = async () => {
  touched.value = true
  if (!isFormValid.value) return

  clearMessages()
  const success = await saveSettings({ volumetricDivisor: Number(volumetricDivisorInput.value) })

  if (success) {
    showNotification(t('systemSettings.saveSuccess'))
    touched.value = false
  } else if (error.value) {
    showNotification(error.value, true)
  }
}

// ── Tariffs ──────────────────────────────────────────────────────────────────
const {
  tariffs,
  isLoading: isTariffsLoading,
  isSubmitting: isTariffSubmitting,
  isDeleting: isTariffDeleting,
  error: tariffError,
  clearMessages: clearTariffMessages,
  fetchTariffs,
  createTariff,
  updateTariff,
  deleteTariff
} = useTariffs()

const {
  offices,
  fetchOffices
} = useOffices()

// Modal state
const isTariffModalOpen = ref(false)
const isDeleteTariffModalOpen = ref(false)
const selectedTariff = ref<Tariff | null>(null)

const handleOpenCreateTariffModal = () => {
  selectedTariff.value = null
  clearTariffMessages()
  isTariffModalOpen.value = true
}

const handleOpenEditTariffModal = (tariff: Tariff) => {
  selectedTariff.value = tariff
  clearTariffMessages()
  isTariffModalOpen.value = true
}

const handleCloseTariffModal = () => {
  isTariffModalOpen.value = false
  selectedTariff.value = null
  clearTariffMessages()
}

const handleOpenDeleteTariffModal = (tariff: Tariff) => {
  selectedTariff.value = tariff
  clearTariffMessages()
  isDeleteTariffModalOpen.value = true
}

const handleCloseDeleteTariffModal = () => {
  isDeleteTariffModalOpen.value = false
  selectedTariff.value = null
  clearTariffMessages()
}

const handleSaveCreateTariff = async (payload: CreateTariffPayload) => {
  const result = await createTariff(payload)
  if (result) {
    isTariffModalOpen.value = false
    selectedTariff.value = null
    showNotification(t('tariffs.createSuccess'))
  }
}

const handleSaveEditTariff = async (payload: UpdateTariffPayload) => {
  if (!selectedTariff.value) return

  // If no fields changed, just close
  if (Object.keys(payload).length === 0) {
    isTariffModalOpen.value = false
    selectedTariff.value = null
    return
  }

  const result = await updateTariff(selectedTariff.value.id, payload)
  if (result) {
    isTariffModalOpen.value = false
    selectedTariff.value = null
    showNotification(t('tariffs.updateSuccess'))
  }
}

const handleConfirmDeleteTariff = async () => {
  if (!selectedTariff.value) return
  const success = await deleteTariff(selectedTariff.value.id)
  if (success) {
    isDeleteTariffModalOpen.value = false
    selectedTariff.value = null
    showNotification(t('tariffs.deleteSuccess'))
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchSettings()
  syncFormFromSettings()
  await Promise.all([fetchTariffs(), fetchOffices()])
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 [&>.popup]:!mt-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
          {{ t('systemSettings.pageTitle') }}
        </h1>
        <p class="text-slate-600 font-medium text-sm mt-1">
          {{ t('systemSettings.pageSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Page-level Notifications -->
    <SuccessBanner v-if="pageSuccessMessage" :title="pageSuccessMessage" />
    <AlertBanner v-if="pageErrorMessage" :message="pageErrorMessage" />

    <!-- ── Volumetric Weight Card ──────────────────────────────────────────── -->
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
      <div class="h-6 bg-slate-100 rounded-xl animate-pulse w-48" />
      <div class="h-4 bg-slate-50 rounded-xl animate-pulse w-72" />
      <div class="h-14 bg-slate-50 rounded-2xl animate-pulse w-full max-w-sm" />
      <div class="h-12 bg-slate-100 rounded-2xl animate-pulse w-40" />
    </div>

    <!-- Settings Card -->
    <div v-else class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 [&>.popup]:!mt-0">
      <!-- Card Header -->
      <div class="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </div>
        <div>
          <h2 class="text-base font-bold text-slate-900">{{ t('systemSettings.volumetricCardTitle') }}</h2>
          <p class="text-xs text-slate-500 font-medium mt-0.5">{{ t('systemSettings.volumetricCardSubtitle') }}</p>
        </div>
      </div>

      <!-- Formula hint -->
      <div class="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/15">
        <svg class="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xs text-primary/80 font-medium leading-relaxed">
          {{ t('systemSettings.formulaHint') }}
        </p>
      </div>

      <!-- Input Field -->
      <div class="max-w-sm space-y-1.5">
        <label for="volumetric-divisor" class="block text-xs font-bold uppercase tracking-wider text-primary/90">
          {{ t('systemSettings.volumetricDivisorLabel') }}
          <span class="text-tertiary ml-0.5 font-bold">*</span>
        </label>

        <div class="relative group">
          <!-- Weight icon prefix -->
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>

          <input
            id="volumetric-divisor"
            v-model="volumetricDivisorInput"
            type="number"
            min="1"
            max="100000"
            step="1"
            :placeholder="t('systemSettings.volumetricDivisorPlaceholder')"
            :disabled="isSaving"
            @blur="touched = true"
            :class="[
              'w-full pl-11 pr-4 py-3.5 text-sm font-medium transition-all duration-200 outline-none rounded-2xl text-slate-800 placeholder:text-slate-400/80 shadow-sm',
              isSaving ? 'opacity-60 cursor-not-allowed bg-slate-100/80 border-slate-200' : '',
              touched && validationError
                ? 'border-2 border-tertiary/80 bg-red-50/40 text-tertiary focus:border-tertiary focus:ring-4 focus:ring-tertiary/10'
                : 'border border-slate-200/90 bg-white/90 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:shadow-md'
            ]"
          />
        </div>

        <!-- Validation Error -->
        <p v-if="touched && validationError" class="text-xs text-tertiary font-semibold flex items-center gap-1.5 mt-1 animate-fade-in">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ validationError }}</span>
        </p>

        <!-- Helper text -->
        <p v-else class="text-[11px] text-slate-400 font-medium mt-1">
          {{ t('systemSettings.volumetricDivisorHint') }}
        </p>
      </div>

      <!-- Save Button -->
      <div class="flex items-center gap-4 pt-2 border-t border-slate-100">
        <BaseButton
          type="button"
          variant="primary"
          size="md"
          :block="false"
          :loading="isSaving"
          :disabled="isSaving || !isFormValid || !isDirty"
          @click="handleSave"
        >
          <svg v-if="!isSaving" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ isSaving ? t('systemSettings.saving') : t('systemSettings.saveButton') }}</span>
        </BaseButton>

        <!-- Saved indicator -->
        <span v-if="!isDirty && settings" class="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          {{ t('systemSettings.upToDate') }}
        </span>
      </div>
    </div>

    <!-- ── Tariff Management Card ──────────────────────────────────────────── -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 [&>.popup]:!mt-0">

      <!-- Card Header -->
      <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900">{{ t('tariffs.cardTitle') }}</h2>
            <p class="text-xs text-slate-500 font-medium mt-0.5">{{ t('tariffs.cardSubtitle') }}</p>
          </div>
        </div>

        <BaseButton
          id="add-tariff-btn"
          type="button"
          variant="secondary"
          size="sm"
          :block="false"
          :disabled="isTariffsLoading"
          @click="handleOpenCreateTariffModal"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{{ t('tariffs.addTariff') }}</span>
        </BaseButton>
      </div>

      <!-- Tariff Error Banner -->
      <AlertBanner v-if="tariffError" :message="tariffError" />

      <!-- Tariff Table Component -->
      <TariffTable
        :tariffs="tariffs"
        :is-loading="isTariffsLoading"
        @add="handleOpenCreateTariffModal"
        @edit="handleOpenEditTariffModal"
        @delete="handleOpenDeleteTariffModal"
      />
    </div>
  </div>

  <!-- ── Tariff Form Modal (Create / Edit) ──────────────────────────────────── -->
  <TariffModal
    :is-open="isTariffModalOpen"
    :tariff="selectedTariff"
    :offices="offices"
    :is-submitting="isTariffSubmitting"
    :error="tariffError"
    @close="handleCloseTariffModal"
    @save-create="handleSaveCreateTariff"
    @save-edit="handleSaveEditTariff"
  />

  <!-- ── Delete Confirmation Modal ─────────────────────────────────────────── -->
  <DeleteTariffModal
    :is-open="isDeleteTariffModalOpen"
    :tariff="selectedTariff"
    :is-deleting="isTariffDeleting"
    :error="tariffError"
    @close="handleCloseDeleteTariffModal"
    @confirm="handleConfirmDeleteTariff"
  />
</template>
