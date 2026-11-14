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
          <div>
            <h3 class="text-xl font-bold text-slate-900">
              {{ receiver ? t('receivers.editReceiver') : t('receivers.addReceiver') }}
            </h3>
            <p class="text-xs text-slate-500 font-medium mt-0.5">
              {{ receiver ? t('receivers.edit') : t('receivers.addReceiver') }}
            </p>
          </div>
          <button
            type="button"
            @click="handleClose"
            :disabled="isSubmitting"
            class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
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

        <!-- Modal Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- First Name & Last Name -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseInput
              id="receiverFirstName"
              v-model="form.firstName"
              :label="t('receivers.firstName')"
              :placeholder="t('receivers.firstNamePlaceholder')"
              :required="true"
              :error="errors.firstName"
              :disabled="isSubmitting"
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </template>
            </BaseInput>

            <BaseInput
              id="receiverLastName"
              v-model="form.lastName"
              :label="t('receivers.lastName')"
              :placeholder="t('receivers.lastNamePlaceholder')"
              :required="true"
              :error="errors.lastName"
              :disabled="isSubmitting"
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </template>
            </BaseInput>
          </div>

          <!-- Document Type & Document Number -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseSelect
              id="receiverDocumentType"
              v-model="form.documentTypeKey"
              :label="t('receivers.documentType')"
              :placeholder="t('receivers.documentTypePlaceholder')"
              :options="documentTypeOptions"
              :required="true"
              :error="errors.documentType"
              :disabled="isSubmitting"
            />

            <BaseInput
              id="receiverDocumentNumber"
              v-model="form.documentNumber"
              :label="t('receivers.documentNumber')"
              :placeholder="t('receivers.documentNumberPlaceholder')"
              :required="true"
              :error="errors.documentNumber"
              :disabled="isSubmitting"
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                </svg>
              </template>
            </BaseInput>
          </div>

          <!-- Address -->
          <BaseInput
            id="receiverAddress"
            v-model="form.address"
            :label="t('receivers.address')"
            :placeholder="t('receivers.addressPlaceholder')"
            :required="true"
            :error="errors.address"
            :disabled="isSubmitting"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </template>
          </BaseInput>

          <!-- Phone Number -->
          <PhoneInput
            v-model="form.phoneNumber"
            :label="t('receivers.phoneNumber')"
            :placeholder="'+374 99 123456'"
            :required="true"
            :error="errors.phoneNumber"
          />

          <!-- Modal Actions -->
          <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
            <BaseButton
              type="button"
              variant="outline"
              size="md"
              :block="false"
              :disabled="isSubmitting"
              @click="handleClose"
            >
              {{ t('receivers.cancel') }}
            </BaseButton>

            <BaseButton
              type="submit"
              variant="primary"
              size="md"
              :block="false"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? t('receivers.saving') : t('receivers.save') }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import PhoneInput from '~/components/ui/PhoneInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import { useI18n } from '~/composables/useI18n'
import type { Receiver, CreateReceiverPayload } from '~/types/receiver'

const props = defineProps<{
  isOpen: boolean
  receiver?: Receiver | null
  isSubmitting?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: CreateReceiverPayload): void
}>()

const { t } = useI18n()

const deriveDocumentTypeKey = (hyVal?: string, enVal?: string, ruVal?: string, fallbackType?: string): string => {
  const combined = [hyVal, enVal, ruVal, fallbackType].filter(Boolean).join('|').toLowerCase()
  if (combined.includes('biometric') || combined.includes('կենսաչափ') || combined.includes('биометр')) return 'Biometric'
  if (combined.includes('idcard') || combined.includes('id card') || combined.includes('նույնական') || combined.includes('идентификацион')) return 'IdCard'
  if (combined.includes('foreign') || combined.includes('иностранный') || combined.includes('օտարերկրյա')) return 'Foreign'
  if (combined.includes('passport') || combined.includes('անձնագ') || combined.includes('паспорт')) return 'Passport'
  return 'Passport'
}

const getDocumentTypesByKey = (key: string) => {
  switch (key) {
    case 'Passport':
      return {
        hyDocumentType: 'ՀՀ Անձնագիր',
        enDocumentType: 'RA Passport',
        ruDocumentType: 'Паспорт РА'
      }
    case 'IdCard':
      return {
        hyDocumentType: 'ՀՀ Նույնականացման քարտ',
        enDocumentType: 'RA ID Card',
        ruDocumentType: 'Идентификационная карта РА'
      }
    case 'Biometric':
      return {
        hyDocumentType: 'ՀՀ Կենսաչափական անձնագիր',
        enDocumentType: 'RA Biometric Passport',
        ruDocumentType: 'Биометрический паспорт РА'
      }
    case 'Foreign':
    default:
      return {
        hyDocumentType: 'Օտարերկրյա անձնագիր',
        enDocumentType: 'Foreign Passport',
        ruDocumentType: 'Иностранный паспорт'
      }
  }
}

const form = reactive({
  firstName: '',
  lastName: '',
  documentTypeKey: 'Passport',
  documentNumber: '',
  address: '',
  phoneNumber: ''
})

const errors = reactive<Record<string, string>>({})

const documentTypeOptions = computed(() => [
  { value: 'Passport', label: t('verify.docPassport') },
  { value: 'IdCard', label: t('verify.docIdCard') },
  { value: 'Biometric', label: t('verify.docBiometric') },
  { value: 'Foreign', label: t('verify.docForeign') }
])

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      Object.keys(errors).forEach(key => delete errors[key])
      if (props.receiver) {
        form.firstName = props.receiver.firstName || ''
        form.lastName = props.receiver.lastName || ''
        form.documentTypeKey = deriveDocumentTypeKey(
          props.receiver.hyDocumentType,
          props.receiver.enDocumentType,
          props.receiver.ruDocumentType,
          props.receiver.documentType
        )
        form.documentNumber = props.receiver.documentNumber || ''
        form.address = props.receiver.address || ''
        form.phoneNumber = props.receiver.phoneNumber || ''
      } else {
        form.firstName = ''
        form.lastName = ''
        form.documentTypeKey = 'Passport'
        form.documentNumber = ''
        form.address = ''
        form.phoneNumber = ''
      }
    }
  },
  { immediate: true }
)

const validate = (): boolean => {
  Object.keys(errors).forEach(key => delete errors[key])
  let isValid = true

  if (!form.firstName.trim()) {
    errors.firstName = t('receivers.errFirstName')
    isValid = false
  }

  if (!form.lastName.trim()) {
    errors.lastName = t('receivers.errLastName')
    isValid = false
  }

  if (!form.documentTypeKey) {
    errors.documentType = t('receivers.errDocumentType')
    isValid = false
  }

  if (!form.documentNumber.trim()) {
    errors.documentNumber = t('receivers.errDocumentNumber')
    isValid = false
  }

  if (!form.address.trim()) {
    errors.address = t('receivers.errAddress')
    isValid = false
  }

  if (!form.phoneNumber.trim()) {
    errors.phoneNumber = t('receivers.errPhone')
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (props.isSubmitting) return
  if (!validate()) return

  const docTypes = getDocumentTypesByKey(form.documentTypeKey)

  emit('submit', {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    hyDocumentType: docTypes.hyDocumentType,
    enDocumentType: docTypes.enDocumentType,
    ruDocumentType: docTypes.ruDocumentType,
    documentNumber: form.documentNumber.trim(),
    address: form.address.trim(),
    phoneNumber: form.phoneNumber.trim()
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
