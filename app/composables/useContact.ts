import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useI18n } from '~/composables/useI18n'
import type { ContactFormState, ContactValidationErrors, ContactApiResponse } from '~/types/contact'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useContact() {
  const { apiFetch } = useApi()
  const { t } = useI18n()

  const form = ref<ContactFormState>({
    name: '',
    email: '',
    message: '',
    _hp: '',
  })

  const touched = ref<Record<keyof ContactValidationErrors, boolean>>({
    name: false,
    email: false,
    message: false,
  })

  const isSubmitting = ref(false)
  const isSuccess = ref(false)
  const serverError = ref<string | null>(null)
  const serverSuccessMessage = ref<string | null>(null)

  const validateField = (field: keyof ContactValidationErrors): string => {
    switch (field) {
      case 'name': {
        const val = form.value.name.trim()
        if (!val) return t('contact.validation.nameRequired')
        if (val.length < 2) return t('contact.validation.nameMin')
        return ''
      }
      case 'email': {
        const val = form.value.email.trim()
        if (!val) return t('contact.validation.emailRequired')
        if (!EMAIL_REGEX.test(val)) return t('contact.validation.emailInvalid')
        return ''
      }
      case 'message': {
        const val = form.value.message.trim()
        if (!val) return t('contact.validation.messageRequired')
        if (val.length < 5) return t('contact.validation.messageMin')
        if (val.length > 6000) return t('contact.validation.messageMax')
        return ''
      }
      default:
        return ''
    }
  }

  const errors = computed<ContactValidationErrors>(() => {
    return {
      name: validateField('name'),
      email: validateField('email'),
      message: validateField('message'),
    }
  })

  const isValid = computed<boolean>(() => {
    return (
      !errors.value.name &&
      !errors.value.email &&
      !errors.value.message
    )
  })

  const touchField = (field: keyof ContactValidationErrors) => {
    touched.value[field] = true
  }

  const touchAll = () => {
    touched.value = {
      name: true,
      email: true,
      message: true,
    }
  }

  const resetForm = () => {
    form.value = {
      name: '',
      email: '',
      message: '',
      _hp: '',
    }
    touched.value = {
      name: false,
      email: false,
      message: false,
    }
    serverError.value = null
    serverSuccessMessage.value = null
    isSuccess.value = false
  }

  const submitContact = async (): Promise<boolean> => {
    if (isSubmitting.value) return false

    touchAll()
    serverError.value = null

    if (!isValid.value) {
      return false
    }

    isSubmitting.value = true

    try {
      // Format payload: include subject clearly in the message body so backend DTO receives it seamlessly
      const trimmedMessage = form.value.message.trim()

      const payload = {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        message: trimmedMessage,
        _hp: form.value._hp || undefined,
      }

      const response = await apiFetch<ContactApiResponse>('/contact', {
        method: 'POST',
        body: payload,
      })

      isSuccess.value = true
      serverSuccessMessage.value = t('contact.form.successMessage')
      return true
    } catch (err: any) {
      const serverMsg =
        err?.data?.message || err?.response?._data?.message || err?.message
      if (Array.isArray(serverMsg)) {
        serverError.value = serverMsg.join(', ')
      } else if (typeof serverMsg === 'string') {
        serverError.value = serverMsg
      } else if (err?.statusCode === 429) {
        serverError.value = 'Too many requests. Please wait a moment and try again.'
      } else {
        serverError.value = t('auth.unknownError')
      }
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    touched,
    errors,
    isValid,
    isSubmitting,
    isSuccess,
    serverError,
    serverSuccessMessage,
    touchField,
    touchAll,
    resetForm,
    submitContact,
  }
}
