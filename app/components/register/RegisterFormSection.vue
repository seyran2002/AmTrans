<template>
  <div>
    <!-- Card Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[10px] font-semibold mb-3">
        <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
        <span>Logistics & Transport</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-black text-primary tracking-tight">
        {{ t('auth.createAccount') }}
      </h1>
      <p class="text-sm text-slate-500 mt-2 font-medium max-w-xs mx-auto">
        {{ t('auth.registerSubtitle') }}
      </p>
    </div>

    <!-- API Error Banner -->
    <AlertBanner :message="apiError" class="mb-6" />

    <form @submit.prevent="$emit('submit')" novalidate class="space-y-4">
      <!-- Email Field -->
      <BaseInput
        id="email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        :label="t('auth.emailLabel')"
        :placeholder="t('auth.emailPlaceholder')"
        :disabled="isLoading"
        :required="true"
        :error="emailError"
        :touched="touched.email"
        @blur="touched.email = true"
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </template>
      </BaseInput>

      <!-- Password Field -->
      <BaseInput
        id="password"
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="new-password"
        :label="t('auth.passwordLabel')"
        :placeholder="t('auth.passwordPlaceholder')"
        :disabled="isLoading"
        :required="true"
        :error="passwordError"
        :touched="touched.password"
        @blur="touched.password = true"
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </template>
        <template #action>
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1"
            tabindex="-1"
          >
            <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.962 8.962 0 012.122-.163c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-6.27-5.411a3 3 0 104.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
            </svg>
          </button>
        </template>
      </BaseInput>

      <!-- Password Requirements Live Checklist -->
      <PasswordRequirements
        :criteria="passwordCriteria"
        :req-title="t('auth.reqTitle')"
        :req-length="t('auth.reqLength')"
        :req-upper="t('auth.reqUpper')"
        :req-lower="t('auth.reqLower')"
        :req-special="t('auth.reqSpecial')"
      />

      <!-- Confirm Password Field -->
      <BaseInput
        id="confirmPassword"
        v-model="form.confirmPassword"
        :type="showConfirmPassword ? 'text' : 'password'"
        autocomplete="new-password"
        :label="t('auth.confirmPasswordLabel')"
        :placeholder="t('auth.confirmPasswordPlaceholder')"
        :disabled="isLoading"
        :required="true"
        :error="confirmPasswordError"
        :touched="touched.confirmPassword"
        @blur="touched.confirmPassword = true"
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </template>
        <template #action>
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1"
            tabindex="-1"
          >
            <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.962 8.962 0 012.122-.163c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-6.27-5.411a3 3 0 104.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
            </svg>
          </button>
        </template>
      </BaseInput>

      <!-- Submit Button -->
      <div class="pt-2">
        <BaseButton
          type="submit"
          variant="secondary"
          :loading="isLoading"
          :disabled="isLoading"
        >
          <span>{{ isLoading ? t('auth.submittingButton') : t('auth.submitButton') }}</span>
          <svg v-if="!isLoading" class="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </BaseButton>
      </div>
    </form>

    <!-- Login Link Footer -->
    <div class="mt-8 pt-6 border-t border-slate-100 text-center">
      <p class="text-sm font-medium text-slate-500">
        {{ t('auth.alreadyHaveAccount') }}
        <NuxtLink
          to="/auth/login"
          class="font-bold text-primary hover:text-tertiary hover:underline transition-colors ml-1 inline-flex items-center gap-0.5"
        >
          {{ t('auth.loginLink') }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import PasswordRequirements from '~/components/ui/PasswordRequirements.vue'

defineProps<{
  form: { email: string; password: string; confirmPassword: string }
  touched: { email: boolean; password: boolean; confirmPassword: boolean }
  passwordCriteria: { length: boolean; upper: boolean; lower: boolean; special: boolean }
  emailError: string
  passwordError: string
  confirmPasswordError: string
  apiError: string | null
  isLoading: boolean
  t: (key: string) => string
}>()

defineEmits<{
  (e: 'submit'): void
}>()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
</script>
