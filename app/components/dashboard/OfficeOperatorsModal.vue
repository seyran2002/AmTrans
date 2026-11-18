<template>
  <Transition name="fade-modal">
    <div
      v-if="isOpen"
      class="popup fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
      @click.self="handleClose"
    >
      <div
        class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 transform transition-all animate-scale-up my-8"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">{{ t('office.operatorsModalTitle') }}</h3>
              <p class="text-xs text-slate-500 font-medium mt-0.5">
                {{ office ? `${office.city}, ${office.country?.enName}` : '' }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="handleClose"
            class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 space-y-5">

          <!-- Success Banner -->
          <div
            v-if="successMsg"
            class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2.5 font-semibold"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            {{ successMsg }}
          </div>

          <!-- Error Banner -->
          <AlertBanner v-if="errorMsg" :message="errorMsg" />

          <!-- Add Operator Section -->
          <div class="space-y-3">
            <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              {{ t('office.addOperator') }}
            </label>

            <!-- Loading available operators -->
            <div v-if="isFetchingOperators" class="h-11 bg-slate-100 rounded-xl animate-pulse w-full" />

            <!-- No available operators message -->
            <p
              v-else-if="availableOperators.length === 0"
              class="text-xs text-slate-500 font-medium py-2"
            >
              {{ t('office.noAvailableOperators') }}
            </p>

            <!-- Searchable select + Add button -->
            <div v-else class="flex gap-2">
              <div class="relative flex-1">
                <!-- Search icon -->
                <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  v-model="operatorSearch"
                  type="text"
                  :placeholder="t('office.searchOperatorPlaceholder')"
                  class="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                  @focus="showDropdown = true"
                  @blur="handleBlur"
                />
                <!-- Dropdown -->
                <div
                  v-if="showDropdown && filteredAvailableOperators.length > 0"
                  class="absolute z-10 mt-1 w-full bg-white rounded-2xl border border-slate-200 shadow-xl max-h-48 overflow-y-auto"
                >
                  <button
                    v-for="op in filteredAvailableOperators"
                    :key="op.id"
                    type="button"
                    @mousedown.prevent="selectOperator(op)"
                    class="w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors flex items-center gap-3 cursor-pointer first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <div class="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                      {{ operatorInitials(op) }}
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-slate-900">{{ operatorName(op) }}</div>
                      <div class="text-[11px] text-slate-400 font-medium">{{ op.email }}</div>
                    </div>
                  </button>
                </div>
              </div>

              <BaseButton
                type="button"
                variant="primary"
                size="sm"
                :block="false"
                :loading="isAssigning"
                :disabled="!selectedOperator || isAssigning"
                @click="handleAssign"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ t('office.add') }}
              </BaseButton>
            </div>

            <!-- Selected operator chip -->
            <div v-if="selectedOperator" class="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl">
              <div class="w-6 h-6 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">
                {{ operatorInitials(selectedOperator) }}
              </div>
              <span class="text-xs font-semibold text-primary flex-1">{{ operatorName(selectedOperator) }}</span>
              <button
                type="button"
                @click="selectedOperator = null; operatorSearch = ''"
                class="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-slate-100" />

          <!-- Assigned Operators List -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {{ t('office.assignedOperators') }}
              </label>
              <span class="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                {{ assignedOperators.length }}
              </span>
            </div>

            <!-- Loading state -->
            <div v-if="isFetchingOperators" class="space-y-2">
              <div v-for="i in 2" :key="i" class="h-12 bg-slate-50 rounded-xl animate-pulse" />
            </div>

            <!-- Empty assigned -->
            <div
              v-else-if="assignedOperators.length === 0"
              class="text-center py-6 px-4"
            >
              <div class="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-2.5">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-slate-600">{{ t('office.noOperatorsAssigned') }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ t('office.noOperatorsAssignedHint') }}</p>
            </div>

            <!-- Operator rows -->
            <div v-else class="space-y-2">
              <div
                v-for="op in assignedOperators"
                :key="op.id"
                class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors group"
              >
                <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold border border-primary/20">
                  {{ operatorInitials(op) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-slate-900 truncate">{{ operatorName(op) }}</div>
                  <div class="text-xs text-slate-400 font-medium truncate">{{ op.email }}</div>
                </div>
                <!-- Remove button -->
                <button
                  type="button"
                  @click="openRemoveConfirm(op)"
                  class="p-1.5 text-slate-400 hover:text-tertiary hover:bg-red-50 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  :title="t('office.removeOperator')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 pb-6">
          <BaseButton
            type="button"
            variant="outline"
            size="md"
            :block="true"
            @click="handleClose"
          >
            {{ t('office.close') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Remove Operator Confirmation Dialog -->
  <Transition name="fade-modal">
    <div
      v-if="removeConfirmOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      @click.self="removeConfirmOpen = false"
    >
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-center animate-scale-up">
        <div class="w-12 h-12 bg-red-100 text-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
          </svg>
        </div>
        <h4 class="text-lg font-bold text-slate-900 mb-2">{{ t('office.confirmRemoveOperatorTitle') }}</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          {{ t('office.confirmRemoveOperatorMessage') }}
        </p>
        <div v-if="operatorToRemove" class="mb-5 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
              {{ operatorInitials(operatorToRemove) }}
            </div>
            <div>
              <div class="text-sm font-semibold text-slate-900">{{ operatorName(operatorToRemove) }}</div>
              <div class="text-xs text-slate-400">{{ operatorToRemove.email }}</div>
            </div>
          </div>
        </div>
        <AlertBanner v-if="removeError" :message="removeError" />
        <div class="flex items-center justify-center gap-3 mt-4">
          <BaseButton
            type="button"
            variant="outline"
            size="md"
            :block="false"
            :disabled="isRemoving"
            @click="removeConfirmOpen = false"
          >
            {{ t('office.cancel') }}
          </BaseButton>
          <BaseButton
            type="button"
            variant="tertiary"
            size="md"
            :block="false"
            :loading="isRemoving"
            :disabled="isRemoving"
            @click="handleRemoveConfirmed"
          >
            {{ isRemoving ? t('office.removing') : t('office.removeOperator') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useOffices } from '~/composables/useOffices'
import type { Office, OperatorUser } from '~/types/office'
import BaseButton from '~/components/ui/BaseButton.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'

const props = defineProps<{
  isOpen: boolean
  office: Office | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const { t, currentLanguage } = useI18n()
const { fetchOperators, assignOperator, removeOperator, offices } = useOffices()

// UI state
const isFetchingOperators = ref(false)
const isAssigning = ref(false)
const isRemoving = ref(false)

const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const removeError = ref<string | null>(null)

const allAvailableOperators = ref<OperatorUser[]>([])
const operatorSearch = ref('')
const selectedOperator = ref<OperatorUser | null>(null)
const showDropdown = ref(false)

const removeConfirmOpen = ref(false)
const operatorToRemove = ref<OperatorUser | null>(null)

// Current office from the reactive offices list (refreshed after assign/remove)
const currentOffice = computed<Office | null>(() => {
  if (!props.office) return null
  return offices.value.find(o => o.id === props.office!.id) ?? props.office
})

const assignedOperators = computed<OperatorUser[]>(() => {
  return currentOffice.value?.operators ?? []
})

// Available operators = all fetched operators minus already assigned
const availableOperators = computed<OperatorUser[]>(() => {
  const assignedIds = new Set(assignedOperators.value.map(o => o.id))
  return allAvailableOperators.value.filter(op => !assignedIds.has(op.id))
})

const filteredAvailableOperators = computed<OperatorUser[]>(() => {
  const q = operatorSearch.value.toLowerCase().trim()
  if (!q) return availableOperators.value
  return availableOperators.value.filter(op =>
    operatorName(op).toLowerCase().includes(q) ||
    op.email.toLowerCase().includes(q) ||
    (op.code?.toLowerCase().includes(q) ?? false)
  )
})

// Helpers
const operatorName = (op: OperatorUser): string => {
  const full = [op.firstName, op.lastName].filter(Boolean).join(' ')
  return full || op.email
}

const operatorInitials = (op: OperatorUser): string => {
  if (op.firstName && op.lastName) return `${op.firstName[0]}${op.lastName[0]}`.toUpperCase()
  if (op.firstName) return (op.firstName[0] || "").toUpperCase()
  return (op.email[0] || "").toUpperCase()
}

const showSuccess = (msg: string) => {
  successMsg.value = msg
  setTimeout(() => { successMsg.value = null }, 4000)
}

const parse409Error = (err: any): string | null => {
  const status = err?.status ?? err?.response?.status
  if (status !== 409) return null

  const data = err?.data ?? err?.response?._data
  const officeData = data?.office ?? data?.data?.office ?? null
  const city = officeData?.city ?? ''
  const country = officeData?.country
  const countryName = country?.[`${currentLanguage.value}Name` as keyof typeof country] ?? country?.enName ?? officeData?.countryName ?? ''

  if (currentLanguage.value === 'ru') {
    return city && countryName
      ? `Этот оператор уже закреплён за офисом: ${city}, ${countryName}.`
      : t('office.operatorAlreadyAssignedGenericRu')
  }
  if (currentLanguage.value === 'en') {
    return city && countryName
      ? `This operator is already assigned to ${city}, ${countryName}.`
      : t('office.operatorAlreadyAssignedGenericEn')
  }
  // hy (default)
  return city && countryName
    ? `Այս օպերատորն արդեն կցված է, մեկ այլ գրասենյակի։ ${city}, ${countryName}.`
    : t('office.operatorAlreadyAssignedGenericHy')
}

// Dropdown handlers
const handleBlur = () => {
  setTimeout(() => { showDropdown.value = false }, 150)
}

const selectOperator = (op: OperatorUser) => {
  selectedOperator.value = op
  operatorSearch.value = operatorName(op)
  showDropdown.value = false
}

// Assign operator action
const handleAssign = async () => {
  if (!selectedOperator.value || !props.office || isAssigning.value) return

  isAssigning.value = true
  errorMsg.value = null

  try {
    await assignOperator(props.office.id, selectedOperator.value.id)
    await loadAvailableOperators()
    selectedOperator.value = null
    operatorSearch.value = ''
    showSuccess(t('office.operatorAssignedSuccess'))
    emit('updated')
  } catch (err: any) {
    const msg409 = parse409Error(err)
    if (msg409) {
      errorMsg.value = msg409
    } else {
      const serverMsg = err?.data?.message ?? err?.response?._data?.message ?? err?.message
      errorMsg.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : t('office.operatorAssignError'))
    }
  } finally {
    isAssigning.value = false
  }
}

const openRemoveConfirm = (op: OperatorUser) => {
  operatorToRemove.value = op
  removeError.value = null
  removeConfirmOpen.value = true
}

const handleRemoveConfirmed = async () => {
  if (!operatorToRemove.value || !props.office || isRemoving.value) return

  isRemoving.value = true
  removeError.value = null

  try {
    await removeOperator(props.office.id, operatorToRemove.value.id)
    await loadAvailableOperators()
    removeConfirmOpen.value = false
    operatorToRemove.value = null
    showSuccess(t('office.operatorRemovedSuccess'))
    emit('updated')
  } catch (err: any) {
    const serverMsg = err?.data?.message ?? err?.response?._data?.message ?? err?.message
    removeError.value = Array.isArray(serverMsg)
      ? serverMsg.join(', ')
      : (typeof serverMsg === 'string' ? serverMsg : t('office.operatorRemoveError'))
  } finally {
    isRemoving.value = false
  }
}

const loadAvailableOperators = async () => {
  isFetchingOperators.value = true
  try {
    allAvailableOperators.value = await fetchOperators()
  } finally {
    isFetchingOperators.value = false
  }
}

const handleClose = () => {
  if (isAssigning.value || isRemoving.value) return
  errorMsg.value = null
  successMsg.value = null
  selectedOperator.value = null
  operatorSearch.value = ''
  showDropdown.value = false
  emit('close')
}

// Load operators when modal opens
watch(() => props.isOpen, (open) => {
  if (open) {
    errorMsg.value = null
    successMsg.value = null
    selectedOperator.value = null
    operatorSearch.value = ''
    loadAvailableOperators()
  }
})
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
