<template>
  <div class="bg-bg-primary relative overflow-hidden font-sans selection:bg-secondary/20 selection:text-primary">
    <!-- Ambient Floating Background Accents -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 -right-40 w-96 h-96 bg-tertiary/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Main Registration Container -->
    <main class="w-full max-w-md mx-auto px-4 z-10 pb-12 sm:pb-24 pt-24 sm:pt-36">
      <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary/10 border border-white/60 relative">
        <!-- Registration Form Section -->
        <RegisterFormSection
          v-if="!isSubmittedSuccessfully"
          :form="form"
          :touched="touched"
          :password-criteria="passwordCriteria"
          :email-error="emailError"
          :password-error="passwordError"
          :confirm-password-error="confirmPasswordError"
          :api-error="apiError"
          :is-loading="isLoading"
          :t="t"
          @submit="handleSubmit"
        />

        <!-- Registration Success State Section -->
        <RegisterSuccessSection
          v-else
          :registered-email="registeredEmail"
          :t="t"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import AppHeader from '~/components/AppHeader.vue'
import RegisterFormSection from '~/components/register/RegisterFormSection.vue'
import RegisterSuccessSection from '~/components/register/RegisterSuccessSection.vue'
import { useI18n } from '~/composables/useI18n'
import { useAuth } from '~/composables/useAuth'
import { useAuthValidation } from '~/composables/useAuthValidation'

// Redirect authenticated users away from this page
definePageMeta({ middleware: 'guest', layout: 'guest' })

const { t, currentLanguage } = useI18n()
const { isLoading, error: apiError, register } = useAuth()
const { evaluatePasswordCriteria, validateEmail, validateRegisterPassword, validateConfirmPassword } = useAuthValidation()

// Page Title & Meta
useHead({
  title: 'Register - AMTRANS',
  meta: [
    { name: 'description', content: 'Create your AMTRANS account to manage logistics and transport services.' }
  ]
})

// Form State
const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const touched = reactive({
  email: false,
  password: false,
  confirmPassword: false
})

const isSubmittedSuccessfully = ref(false)
const registeredEmail = ref('')

// Password validation criteria evaluation
const passwordCriteria = computed(() => evaluatePasswordCriteria(form.password))

// Validation Error Computed Properties
const emailError = computed(() => validateEmail(form.email, t))
const passwordError = computed(() => validateRegisterPassword(form.password, t))
const confirmPasswordError = computed(() => validateConfirmPassword(form.password, form.confirmPassword, t))

// Submission Handler
const handleSubmit = async () => {
  // Mark all fields touched
  touched.email = true
  touched.password = true
  touched.confirmPassword = true

  // Validate form
  if (emailError.value || passwordError.value || confirmPasswordError.value) {
    return
  }

  const result = await register({
    email: form.email,
    password: form.password,
    language: currentLanguage.value
  })

  if (result) {
    registeredEmail.value = form.email
    isSubmittedSuccessfully.value = true
  }
}
</script>
