<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 [&>.popup]:!mt-0">
    <SuccessBanner v-if="successMessage" :title="t('verify.successTitle')" :message="successMessage" />
    
    <AlertBanner v-if="errorMessage" :message="errorMessage" />

    <!-- Segmented Entity Type Switch -->
    <EntityTypeSwitch
      v-model="form.isIndividual"
      :label="t('verify.entityType')"
      :individual-label="t('verify.individual')"
      :legal-entity-label="t('verify.legalEntity')"
    />

    <!-- Individual Fields -->
    <template v-if="form.isIndividual">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          id="firstName"
          v-model="form.firstName"
          :label="t('verify.firstName')"
          :placeholder="t('verify.firstNamePlaceholder')"
          :required="true"
          :error="errors.firstName"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </template>
        </BaseInput>

        <BaseInput
          id="lastName"
          v-model="form.lastName"
          :label="t('verify.lastName')"
          :placeholder="t('verify.lastNamePlaceholder')"
          :required="true"
          :error="errors.lastName"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </template>
        </BaseInput>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseSelect
          id="documentType"
          v-model="selectedDocumentType"
          :label="t('verify.documentType')"
          :placeholder="t('verify.documentTypePlaceholder')"
          :options="documentTypeOptions"
          :required="true"
          :error="errors.documentType"
        />
        <BaseInput
          id="documentNumber"
          v-model="form.documentNumber"
          :label="t('verify.documentNumber')"
          :placeholder="t('verify.documentNumberPlaceholder')"
          :required="true"
          :error="errors.documentNumber"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
            </svg>
          </template>
        </BaseInput>
      </div>
    </template>

    <!-- Legal Entity Fields -->
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput
          id="companyName"
          v-model="form.companyName"
          :label="t('verify.companyName')"
          :placeholder="t('verify.companyNamePlaceholder')"
          :required="true"
          :error="errors.companyName"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4" />
            </svg>
          </template>
        </BaseInput>

        <BaseInput
          id="taxpayerId"
          v-model="form.taxpayerId"
          :label="t('verify.taxpayerId')"
          :placeholder="t('verify.taxpayerIdPlaceholder')"
          :required="true"
          :error="errors.taxpayerId"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </template>
        </BaseInput>
      </div>
    </template>

    <!-- Common Fields: Address & Phone -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput
        id="address"
        v-model="form.address"
        :label="t('verify.address')"
        :placeholder="t('verify.addressPlaceholder')"
        :required="true"
        :error="errors.address"
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </template>
      </BaseInput>

      <PhoneInput
        v-model="form.phoneNumber"
        :label="t('verify.phoneNumber')"
        :required="true"
        :error="errors.phoneNumber"
      />
    </div>

    <!-- Telegram Integration Section -->
    <div class="p-5 bg-gradient-to-r from-sky-500/10 via-sky-400/5 to-indigo-500/10 border border-sky-500/25 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div>
        <h4 class="font-bold text-primary text-sm flex items-center gap-2">
          <svg class="w-5 h-5 text-sky-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          {{ t('verify.connectTelegramTitle') }}
        </h4>
        <p class="text-xs text-slate-500 font-medium mt-1">
          {{ t('verify.connectTelegramSubtitle') }}
        </p>
      </div>

      <div class="shrink-0 w-full sm:w-auto">
        <template v-if="isTelegramConnected">
          <div class="px-4 py-2.5 bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            {{ t('verify.telegramConnected') }}
          </div>
        </template>
        <template v-else>
          <a
            :href="telegramDeepLink"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-500/25 transition-all gap-2 active:scale-95"
          >
            <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            {{ t('verify.telegramBtnText') }}
          </a>
        </template>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="pt-2">
      <BaseButton
        type="submit"
        variant="secondary"
        size="lg"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        block
      >
        <span>{{ isSubmitting ? t('verify.submitting') : t('verify.submit') }}</span>
        <svg v-if="!isSubmitting" class="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </BaseButton>
    </div>
  </form>
</template>


<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import EntityTypeSwitch from '~/components/ui/EntityTypeSwitch.vue'
import PhoneInput from '~/components/ui/PhoneInput.vue'
import SuccessBanner from '~/components/ui/SuccessBanner.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useI18n } from '~/composables/useI18n'
import { useVerify, type VerifyUserResponse, type UpdateProfilePayload } from '~/composables/useVerify'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const props = defineProps<{
  user: VerifyUserResponse
}>()

const emit = defineEmits<{
  (e: 'success', updatedUser: VerifyUserResponse): void
}>()

const { t } = useI18n()
const { updateProfile, checkTelegramStatus, isSubmitting } = useVerify()

const formatPhoneWithCountryCode = (phone: string): string => {
  if (!phone || !phone.trim()) return phone
  const raw = phone.trim()
  const parsed = parsePhoneNumberFromString(raw, 'AM')
  if (parsed && parsed.isValid()) {
    return parsed.number
  }
  return raw
}

const form = reactive({
  isIndividual: props.user.isIndividual !== undefined ? props.user.isIndividual : true,
  firstName: props.user.firstName || '',
  lastName: props.user.lastName || '',
  address: props.user.address || '',
  phoneNumber: formatPhoneWithCountryCode(props.user.phoneNumber || ''),
  documentNumber: props.user.documentNumber || '',
  companyName: props.user.companyName || '',
  taxpayerId: props.user.taxpayerId || ''
})

const selectedDocumentType = ref('Passport')

const documentTypeOptions = computed(() => [
  { value: 'Passport', label: t('verify.docPassport') },
  { value: 'IdCard', label: t('verify.docIdCard') },
  { value: 'Biometric', label: t('verify.docBiometric') },
  { value: 'Foreign', label: t('verify.docForeign') }
])

const errors = reactive<Record<string, string>>({})
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const isTelegramConnected = ref(!!props.user.telegramChatId)
const telegramBotUsername = 'AmTransBot';
const telegramDeepLink = computed(() => `https://t.me/${telegramBotUsername}?start=${props.user.id}`)

let pollTimer: any = null

const pollTelegramStatus = async () => {
  if (isTelegramConnected.value) return
  const res = await checkTelegramStatus(props.user.id)
  if (res && res.connected) {
    isTelegramConnected.value = true
    if (pollTimer) clearInterval(pollTimer)
  }
}

onMounted(() => {
  pollTimer = setInterval(pollTelegramStatus, 3000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

const validate = (): boolean => {
  // Clear errors
  Object.keys(errors).forEach(k => delete errors[k])
  errorMessage.value = null

  let valid = true

  if (!form.address || !form.address.trim()) {
    errors.address = t('verify.errAddressRequired')
    valid = false
  }

  if (!form.phoneNumber || !form.phoneNumber.trim()) {
    errors.phoneNumber = t('verify.errPhoneRequired')
    valid = false
  } else {
    const rawPhone = form.phoneNumber.trim()
    const parsed = parsePhoneNumberFromString(rawPhone, 'AM')
    if (parsed && parsed.isValid()) {
      form.phoneNumber = parsed.number
    } else {
      errors.phoneNumber = t('verify.errPhoneRequired')
      valid = false
    }
  }

  if (form.isIndividual) {
    if (!form.firstName || !form.firstName.trim()) {
      errors.firstName = t('verify.errFirstNameRequired')
      valid = false
    }
    if (!form.lastName || !form.lastName.trim()) {
      errors.lastName = t('verify.errLastNameRequired')
      valid = false
    }
    if (!selectedDocumentType.value) {
      errors.documentType = t('verify.errDocumentTypeRequired')
      valid = false
    }
    if (!form.documentNumber || !form.documentNumber.trim()) {
      errors.documentNumber = t('verify.errDocumentNumberRequired')
      valid = false
    }
  } else {
    if (!form.companyName || !form.companyName.trim()) {
      errors.companyName = t('verify.errCompanyNameRequired')
      valid = false
    }
    if (!form.taxpayerId || !form.taxpayerId.trim()) {
      errors.taxpayerId = t('verify.errTaxpayerIdRequired')
      valid = false
    }
  }

  return valid
}

const handleSubmit = async () => {
  if (!validate()) return

  const docLabel = documentTypeOptions.value.find(o => o.value === selectedDocumentType.value)?.label || selectedDocumentType.value

  const payload: UpdateProfilePayload = {
    isIndividual: form.isIndividual,
    address: form.address,
    phoneNumber: form.phoneNumber,
    ...(form.isIndividual ? {
      firstName: form.firstName,
      lastName: form.lastName,
      hyDocumentType: docLabel,
      enDocumentType: docLabel,
      ruDocumentType: docLabel,
      documentNumber: form.documentNumber
    } : {
      companyName: form.companyName,
      taxpayerId: form.taxpayerId
    })
  }

  const result = await updateProfile(props.user.id, payload)
  if (result) {
    successMessage.value = t('verify.successMessage')
    emit('success', result)
  }
}
</script>