<template>
  <div class="min-h-screen bg-bg-primary flex flex-col justify-between relative overflow-hidden font-sans selection:bg-secondary/20 selection:text-primary">
    <!-- Ambient Floating Background Accents -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 -right-40 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Global App Header -->
    <AppHeader />

    <!-- Main Login Container -->
    <main class="w-full max-w-md mx-auto px-4 py-6 z-10 my-auto">
      <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary/10 border border-white/60 relative">
        <LoginFormSection
          :form="form"
          :touched="touched"
          :email-error="emailError"
          :password-error="passwordError"
          :is-invalid="isInvalid"
          :api-error="apiError"
          :is-loading="isLoading"
          :t="t"
          @submit="handleSubmit"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import AppHeader from '~/components/AppHeader.vue'
import LoginFormSection from '~/components/login/LoginFormSection.vue'
import { useI18n } from '~/composables/useI18n'
import { useAuthValidation } from '~/composables/useAuthValidation'
import { useAuth } from '~/composables/useAuth'

// Redirect authenticated users away from this page
definePageMeta({ middleware: 'guest', layout: 'guest' })

const { t } = useI18n()
const { validateEmail, validateLoginPassword } = useAuthValidation()
const { login, isLoading, error: authError } = useAuth()

// Page Title & Meta
useHead({
  title: 'Log in - AMTRANS',
  meta: [
    { name: 'description', content: 'Log in to your AMTRANS account to access logistics services.' }
  ]
})

// Form & Validation State
const form = reactive({
  email: '',
  password: ''
})

const touched = reactive({
  email: false,
  password: false
})

const apiError = ref<string | null>(null)

// Computed Validation Errors
const emailError = computed(() => validateEmail(form.email, t))
const passwordError = computed(() => validateLoginPassword(form.password, t))

// Form Validity Check
const isInvalid = computed(() => {
  if (!form.email || !form.password) return true
  return Boolean(emailError.value || passwordError.value)
})

// Submit Handler — calls centralized login() from useAuth
const handleSubmit = async () => {
  touched.email = true
  touched.password = true

  if (isInvalid.value) return

  apiError.value = null
  const success = await login({ email: form.email, password: form.password })

  if (!success) {
    // authError is reactive, mirror it to apiError for the form component
    apiError.value = authError.value
  }
}
</script>
