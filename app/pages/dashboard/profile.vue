<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import EntityTypeSwitch from '~/components/ui/EntityTypeSwitch.vue'
import PhoneInput from '~/components/ui/PhoneInput.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import SuccessBanner from '~/components/ui/SuccessBanner.vue'
import PasswordRequirements from '~/components/ui/PasswordRequirements.vue'
import { useI18n } from '~/composables/useI18n'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useVerify, type UpdateProfilePayload } from '~/composables/useVerify'
import { evaluatePasswordCriteria, isPasswordValidForRegister } from '~/composables/useAuthValidation'

definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

const config = useRuntimeConfig()
const { t } = useI18n()
const { user } = useAuth()
const { apiFetch } = useApi()
const { updateProfile, checkTelegramStatus, isSubmitting, error: verifyError } = useVerify()

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatPhoneWithCountryCode = (phone: string): string => {
  if (!phone || !phone.trim()) return phone
  const raw = phone.trim()
  const parsed = parsePhoneNumberFromString(raw, 'AM')
  if (parsed && parsed.isValid()) return parsed.number
  return raw
}

/**
 * Derive the internal document type key from stored hy/en/ru document type label.
 * Returns one of 'Passport' | 'IdCard' | 'Biometric' | 'Foreign'
 */
const deriveDocumentTypeKey = (hyVal?: string, enVal?: string, ruVal?: string): string => {
  const combined = [hyVal, enVal, ruVal].filter(Boolean).join('|').toLowerCase()
  if (combined.includes('biometric') || combined.includes('կենսաչափ') || combined.includes('биометр')) return 'Biometric'
  if (combined.includes('idcard') || combined.includes('id card') || combined.includes('նույնական') || combined.includes('идентификацион')) return 'IdCard'
  if (combined.includes('foreign') || combined.includes('иностранный')) return 'Foreign'
  if (combined.includes('passport') || combined.includes('անձնագ') || combined.includes('паспорт')) return 'Passport'
  return 'Passport'
}

// ─── Profile Form ────────────────────────────────────────────────────────────

const profileForm = reactive({
  isIndividual: user.value?.isIndividual !== undefined ? user.value.isIndividual : true,
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  address: user.value?.address || '',
  phoneNumber: formatPhoneWithCountryCode(user.value?.phoneNumber || ''),
  documentNumber: user.value?.documentNumber || '',
  companyName: user.value?.companyName || '',
  taxpayerId: user.value?.taxpayerId || ''
})

const selectedDocumentType = ref(
  deriveDocumentTypeKey(user.value?.hyDocumentType, user.value?.enDocumentType, user.value?.ruDocumentType)
)

// Keep form in sync if user state changes externally (e.g. SSR hydration)
watch(user, (newUser) => {
  if (!newUser) return
  profileForm.isIndividual = newUser.isIndividual !== undefined ? newUser.isIndividual : true
  profileForm.firstName = newUser.firstName || ''
  profileForm.lastName = newUser.lastName || ''
  profileForm.address = newUser.address || ''
  profileForm.phoneNumber = formatPhoneWithCountryCode(newUser.phoneNumber || '')
  profileForm.documentNumber = newUser.documentNumber || ''
  profileForm.companyName = newUser.companyName || ''
  profileForm.taxpayerId = newUser.taxpayerId || ''
  selectedDocumentType.value = deriveDocumentTypeKey(newUser.hyDocumentType, newUser.enDocumentType, newUser.ruDocumentType)
}, { deep: true })

const profileErrors = reactive<Record<string, string>>({})
const profileErrorMessage = ref<string | null>(null)
const profileSuccessMessage = ref<string | null>(null)

const documentTypeOptions = computed(() => [
  { value: 'Passport', label: t('verify.docPassport') },
  { value: 'IdCard', label: t('verify.docIdCard') },
  { value: 'Biometric', label: t('verify.docBiometric') },
  { value: 'Foreign', label: t('verify.docForeign') }
])

const validateProfile = (): boolean => {
  Object.keys(profileErrors).forEach(k => delete profileErrors[k])
  profileErrorMessage.value = null
  let valid = true

  if (!profileForm.address || !profileForm.address.trim()) {
    profileErrors.address = t('verify.errAddressRequired')
    valid = false
  }

  if (!profileForm.phoneNumber || !profileForm.phoneNumber.trim()) {
    profileErrors.phoneNumber = t('verify.errPhoneRequired')
    valid = false
  } else {
    const parsed = parsePhoneNumberFromString(profileForm.phoneNumber.trim(), 'AM')
    if (parsed && parsed.isValid()) {
      profileForm.phoneNumber = parsed.number
    } else {
      profileErrors.phoneNumber = t('verify.errPhoneRequired')
      valid = false
    }
  }

  if (profileForm.isIndividual) {
    if (!profileForm.firstName || !profileForm.firstName.trim()) {
      profileErrors.firstName = t('verify.errFirstNameRequired')
      valid = false
    }
    if (!profileForm.lastName || !profileForm.lastName.trim()) {
      profileErrors.lastName = t('verify.errLastNameRequired')
      valid = false
    }
    if (!selectedDocumentType.value) {
      profileErrors.documentType = t('verify.errDocumentTypeRequired')
      valid = false
    }
    if (!profileForm.documentNumber || !profileForm.documentNumber.trim()) {
      profileErrors.documentNumber = t('verify.errDocumentNumberRequired')
      valid = false
    }
  } else {
    if (!profileForm.companyName || !profileForm.companyName.trim()) {
      profileErrors.companyName = t('verify.errCompanyNameRequired')
      valid = false
    }
    if (!profileForm.taxpayerId || !profileForm.taxpayerId.trim()) {
      profileErrors.taxpayerId = t('verify.errTaxpayerIdRequired')
      valid = false
    }
  }

  return valid
}

const handleSaveProfile = async () => {
  if (!validateProfile()) return
  if (!user.value?.id) return

  profileSuccessMessage.value = null

  const payload: UpdateProfilePayload = {
    isIndividual: profileForm.isIndividual,
    address: profileForm.address,
    phoneNumber: profileForm.phoneNumber,
    ...(profileForm.isIndividual ? {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      hyDocumentType: selectedDocumentType.value === 'Passport' ? 'ՀՀ Անձնագիր'
        : selectedDocumentType.value === 'IdCard' ? 'ՀՀ Նույնականացման քարտ'
        : selectedDocumentType.value === 'Biometric' ? 'ՀՀ Կենսաչափական անձնագիր'
        : 'Օտարերկրյա անձնագիր',
      enDocumentType: selectedDocumentType.value === 'Passport' ? 'RA Passport'
        : selectedDocumentType.value === 'IdCard' ? 'RA ID Card'
        : selectedDocumentType.value === 'Biometric' ? 'RA Biometric Passport'
        : 'Foreign Passport',
      ruDocumentType: selectedDocumentType.value === 'Passport' ? 'Паспорт РА'
        : selectedDocumentType.value === 'IdCard' ? 'Идентификационная карта РА'
        : selectedDocumentType.value === 'Biometric' ? 'Биометрический паспорт РА'
        : 'Иностранный паспорт',
      documentNumber: profileForm.documentNumber
    } : {
      companyName: profileForm.companyName,
      taxpayerId: profileForm.taxpayerId
    })
  }

  const result = await updateProfile(user.value.id, payload)
  if (result) {
    user.value = { ...user.value, ...result }
    profileSuccessMessage.value = t('profile.saveSuccess')
    profileErrorMessage.value = null
    setTimeout(() => { profileSuccessMessage.value = null }, 5000)
  } else {
    profileErrorMessage.value = verifyError.value || 'Failed to update profile.'
  }
}

// ─── Telegram ────────────────────────────────────────────────────────────────

const isTelegramConnected = ref(!!user.value?.telegramChatId)
const isTelegramDisconnecting = ref(false)
const telegramBotUsername = config.public.telegramBotUsername
const telegramDeepLink = computed(() => `https://t.me/${telegramBotUsername}?start=${user.value?.id}`)
const telegramSuccessMessage = ref<string | null>(null)
const telegramErrorMessage = ref<string | null>(null)

let pollTimer: ReturnType<typeof setInterval> | null = null

const pollTelegramStatus = async () => {
  if (isTelegramConnected.value || !user.value?.id) return
  const res = await checkTelegramStatus(user.value.id)
  if (res && res.connected) {
    isTelegramConnected.value = true
    if (user.value) user.value = { ...user.value, telegramChatId: res.telegramChatId || 'connected' }
    if (pollTimer) clearInterval(pollTimer)
  }
}

onMounted(() => {
  if (!isTelegramConnected.value) {
    pollTimer = setInterval(pollTelegramStatus, 3000)
  }
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

const handleDisconnectTelegram = async () => {
  if (!user.value?.id) return
  isTelegramDisconnecting.value = true
  telegramErrorMessage.value = null
  telegramSuccessMessage.value = null

  try {
    await apiFetch(`/telegram/disconnect`, { method: 'DELETE' })
    isTelegramConnected.value = false
    if (user.value) user.value = { ...user.value, telegramChatId: undefined }
    telegramSuccessMessage.value = t('profile.telegramDisconnectSuccess')
    if (!pollTimer) {
      pollTimer = setInterval(pollTelegramStatus, 3000)
    }
    setTimeout(() => { telegramSuccessMessage.value = null }, 5000)
  } catch (err: any) {
    const msg = err?.data?.message || err?.message || 'Failed to disconnect Telegram.'
    telegramErrorMessage.value = Array.isArray(msg) ? msg.join(', ') : msg
  } finally {
    isTelegramDisconnecting.value = false
  }
}

// ─── Change Password ──────────────────────────────────────────────────────────

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  repeatPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showRepeatPassword = ref(false)

const passwordErrors = reactive<Record<string, string>>({})
const passwordErrorMessage = ref<string | null>(null)
const passwordSuccessMessage = ref<string | null>(null)
const isChangingPassword = ref(false)

const newPasswordCriteria = computed(() => evaluatePasswordCriteria(passwordForm.newPassword))
const showPasswordRequirements = computed(() => passwordForm.newPassword.length > 0)

const validatePassword = (): boolean => {
  Object.keys(passwordErrors).forEach(k => delete passwordErrors[k])
  passwordErrorMessage.value = null
  let valid = true

  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = t('profile.errCurrentPasswordRequired')
    valid = false
  }
  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = t('profile.errNewPasswordRequired')
    valid = false
  } else if (!isPasswordValidForRegister(passwordForm.newPassword)) {
    passwordErrors.newPassword = t('profile.errNewPasswordCriteria')
    valid = false
  }
  if (!passwordForm.repeatPassword) {
    passwordErrors.repeatPassword = t('profile.errRepeatPasswordRequired')
    valid = false
  } else if (passwordForm.newPassword !== passwordForm.repeatPassword) {
    passwordErrors.repeatPassword = t('profile.errPasswordsDontMatch')
    valid = false
  }

  return valid
}

const handleChangePassword = async () => {
  if (!validatePassword()) return

  isChangingPassword.value = true
  passwordSuccessMessage.value = null
  passwordErrorMessage.value = null

  try {
    await apiFetch(`/users/change-password`, {
      method: 'PUT',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }
    })
    passwordSuccessMessage.value = t('profile.passwordChangeSuccess')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.repeatPassword = ''
    setTimeout(() => { passwordSuccessMessage.value = null }, 5000)
  } catch (err: any) {
    if (err.statusCode === 401) {
      passwordErrorMessage.value = t('profile.errChangePasswordInvalid')
    } else {
    const msg = err?.data?.message || err?.message || 'Failed to change password.'
    passwordErrorMessage.value = Array.isArray(msg) ? msg.join(', ') : msg
    }
  } finally {
    isChangingPassword.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6 [&>.popup]:!mt-0 pb-12">

    <!-- Page Header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-primary tracking-tight">
          {{ t('profile.pageTitle') }}
        </h1>
        <p class="text-sm text-slate-500 font-medium mt-1">
          {{ t('profile.pageSubtitle') }}
        </p>
      </div>
      <!-- User badge -->
      <div class="shrink-0 hidden sm:flex items-center gap-2.5 px-4 py-2 bg-primary/5 border border-primary/15 rounded-2xl">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow">
          {{ (user?.email?.[0] || 'U').toUpperCase() }}
        </div>
        <div class="min-w-0">
          <p class="text-xs font-bold text-slate-800 truncate max-w-[160px]">{{ user?.email }}</p>
          <p class="text-[10px] text-slate-500 font-medium capitalize">{{ user?.role || 'User' }}</p>
        </div>
      </div>
    </div>

    <!-- ─── Profile Info Form ──────────────────────────────────────────────── -->
    <form @submit.prevent="handleSaveProfile" class="space-y-5">

      <!-- Success / Error Banners -->
      <SuccessBanner v-if="profileSuccessMessage" :title="t('profile.saveSuccess')" :message="t('profile.saveSuccessSubtitle')" />
      <AlertBanner v-if="profileErrorMessage" :message="profileErrorMessage" />

      <!-- ── Profile Information (Combined Board) ────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        <!-- ── Section 1: Personal Information ── -->
        <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider">{{ t('profile.sectionPersonal') }}</h2>
        </div>
        <div class="p-5 space-y-6 [&>.popup]:!mt-0">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseInput
              id="profile-firstName"
              v-model="profileForm.firstName"
              :label="t('verify.firstName')"
              :placeholder="t('verify.firstNamePlaceholder')"
              :required="profileForm.isIndividual"
              :error="profileErrors.firstName"
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </template>
            </BaseInput>

            <BaseInput
              id="profile-lastName"
              v-model="profileForm.lastName"
              :label="t('verify.lastName')"
              :placeholder="t('verify.lastNamePlaceholder')"
              :required="profileForm.isIndividual"
              :error="profileErrors.lastName"
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </template>
            </BaseInput>
          </div>

          <!-- ── Section 2: Account Type & Identification ── -->
          <div class="border-t border-slate-100 pt-6 space-y-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                </svg>
              </div>
              <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">{{ t('profile.sectionIdentification') }}</h3>
            </div>

            <EntityTypeSwitch
              v-model="profileForm.isIndividual"
              :label="t('verify.entityType')"
              :individual-label="t('verify.individual')"
              :legal-entity-label="t('verify.legalEntity')"
            />

            <!-- Individual fields -->
            <template v-if="profileForm.isIndividual">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BaseSelect
                  id="profile-documentType"
                  v-model="selectedDocumentType"
                  :label="t('verify.documentType')"
                  :placeholder="t('verify.documentTypePlaceholder')"
                  :options="documentTypeOptions"
                  :required="true"
                  :error="profileErrors.documentType"
                />
                <BaseInput
                  id="profile-documentNumber"
                  v-model="profileForm.documentNumber"
                  :label="t('verify.documentNumber')"
                  :placeholder="t('verify.documentNumberPlaceholder')"
                  :required="true"
                  :error="profileErrors.documentNumber"
                >
                  <template #icon>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                    </svg>
                  </template>
                </BaseInput>
              </div>
            </template>

            <!-- Legal entity fields -->
            <template v-else>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BaseInput
                  id="profile-companyName"
                  v-model="profileForm.companyName"
                  :label="t('verify.companyName')"
                  :placeholder="t('verify.companyNamePlaceholder')"
                  :required="true"
                  :error="profileErrors.companyName"
                >
                  <template #icon>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4" />
                    </svg>
                  </template>
                </BaseInput>
                <BaseInput
                  id="profile-taxpayerId"
                  v-model="profileForm.taxpayerId"
                  :label="t('verify.taxpayerId')"
                  :placeholder="t('verify.taxpayerIdPlaceholder')"
                  :required="true"
                  :error="profileErrors.taxpayerId"
                >
                  <template #icon>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </template>
                </BaseInput>
              </div>
            </template>
          </div>

          <!-- ── Section 3: Contact Information ── -->
          <div class="border-t border-slate-100 pt-6 space-y-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">{{ t('profile.sectionContact') }}</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseInput
                id="profile-address"
                v-model="profileForm.address"
                :label="t('verify.address')"
                :placeholder="t('verify.addressPlaceholder')"
                :required="true"
                :error="profileErrors.address"
              >
                <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </template>
              </BaseInput>

              <PhoneInput
                v-model="profileForm.phoneNumber"
                :label="t('verify.phoneNumber')"
                :required="true"
                :error="profileErrors.phoneNumber"
              />
            </div>
          </div>

          <!-- Save Changes Button -->
          <div class="border-t border-slate-100 pt-5 flex justify-end">
            <div class="w-full sm:w-fit">
              <BaseButton
                type="submit"
                variant="primary"
                size="md"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                block
              >
                <svg v-if="!isSubmitting" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ isSubmitting ? t('profile.saving') : t('profile.saveChanges') }}</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- ─── Section 4: Telegram ──────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
        </div>
        <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider">{{ t('profile.sectionTelegram') }}</h2>
      </div>

      <div class="p-5">
        <SuccessBanner v-if="telegramSuccessMessage" :message="telegramSuccessMessage" />
        <AlertBanner v-if="telegramErrorMessage" :message="telegramErrorMessage" />

        <div
          class="mt-2 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          :class="isTelegramConnected
            ? 'bg-gradient-to-r from-emerald-500/8 to-sky-500/8 border border-emerald-500/20'
            : 'bg-gradient-to-r from-sky-500/8 via-sky-400/4 to-indigo-500/8 border border-sky-500/20'"
        >
          <div>
            <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <svg class="w-5 h-5 text-sky-500 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              {{ t('profile.telegramTitle') }}
            </h4>
            <p class="text-xs text-slate-500 font-medium mt-1">{{ t('profile.telegramSubtitle') }}</p>
          </div>

          <div class="shrink-0 w-full sm:w-auto flex items-center gap-2 flex-wrap">
            <!-- Connected state -->
            <template v-if="isTelegramConnected">
              <div class="px-4 py-2.5 bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                {{ t('profile.telegramConnected') }}
              </div>
              <button
                type="button"
                @click="handleDisconnectTelegram"
                :disabled="isTelegramDisconnecting"
                class="px-4 py-2.5 bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
              >
                <svg v-if="!isTelegramDisconnecting" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <svg v-else class="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ isTelegramDisconnecting ? t('profile.telegramDisconnecting') : t('profile.telegramDisconnectBtn') }}
              </button>
            </template>

            <!-- Not connected state -->
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
                {{ t('profile.telegramConnectBtn') }}
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Section 5: Change Password ──────────────────────────────────── -->
    <form @submit.prevent="handleChangePassword">
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider">{{ t('profile.sectionPassword') }}</h2>
        </div>

        <div class="p-5 space-y-4">
          <SuccessBanner v-if="passwordSuccessMessage" :message="passwordSuccessMessage" />
          <AlertBanner v-if="passwordErrorMessage" :message="passwordErrorMessage" />

          <!-- Current Password -->
          <BaseInput
            id="profile-currentPassword"
            v-model="passwordForm.currentPassword"
            :type="showCurrentPassword ? 'text' : 'password'"
            :label="t('profile.currentPassword')"
            :placeholder="t('profile.currentPasswordPlaceholder')"
            :required="true"
            :error="passwordErrors.currentPassword"
            autocomplete="current-password"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </template>
            <template #action>
              <button type="button" @click="showCurrentPassword = !showCurrentPassword" class="p-1 rounded-lg text-slate-400 hover:text-primary transition-colors focus:outline-none">
                <svg v-if="!showCurrentPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </template>
          </BaseInput>

          <!-- New Password + Repeat -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-3">
              <BaseInput
                id="profile-newPassword"
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                :label="t('profile.newPassword')"
                :placeholder="t('profile.newPasswordPlaceholder')"
                :required="true"
                :error="passwordErrors.newPassword"
                autocomplete="new-password"
              >
                <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </template>
                <template #action>
                  <button type="button" @click="showNewPassword = !showNewPassword" class="p-1 rounded-lg text-slate-400 hover:text-primary transition-colors focus:outline-none w-fit">
                    <svg v-if="!showNewPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </template>
              </BaseInput>

              <!-- Password strength requirements -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
              >
                <PasswordRequirements
                  v-if="showPasswordRequirements"
                  :criteria="newPasswordCriteria"
                  :req-title="t('auth.reqTitle')"
                  :req-length="t('auth.reqLength')"
                  :req-upper="t('auth.reqUpper')"
                  :req-lower="t('auth.reqLower')"
                  :req-special="t('auth.reqSpecial')"
                />
              </Transition>
            </div>

            <BaseInput
              id="profile-repeatPassword"
              v-model="passwordForm.repeatPassword"
              :type="showRepeatPassword ? 'text' : 'password'"
              :label="t('profile.repeatPassword')"
              :placeholder="t('profile.repeatPasswordPlaceholder')"
              :required="true"
              :error="passwordErrors.repeatPassword"
              autocomplete="new-password"
            >
              <template #icon>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </template>
              <template #action>
                <button type="button" @click="showRepeatPassword = !showRepeatPassword" class="p-1 rounded-lg text-slate-400 hover:text-primary transition-colors focus:outline-none">
                  <svg v-if="!showRepeatPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </template>
            </BaseInput>
          </div>

          <!-- Change Password Button -->
          <div class="flex justify-end pt-1">
            <div class="w-full sm:w-fit">
              <BaseButton
                type="submit"
                variant="tertiary"
                size="md"
                :loading="isChangingPassword"
                :disabled="isChangingPassword"
                block
              >
                <svg v-if="!isChangingPassword" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{{ isChangingPassword ? t('profile.changingPassword') : t('profile.changePassword') }}</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </form>

  </div>
</template>
