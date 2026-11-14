<script setup lang="ts">
import { computed } from 'vue'
import { useContact } from '~/composables/useContact'
import { useI18n } from '~/composables/useI18n'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import SuccessBanner from '~/components/ui/SuccessBanner.vue'

const { t } = useI18n()
const {
  form,
  touched,
  errors,
  isSubmitting,
  isSuccess,
  serverError,
  serverSuccessMessage,
  touchField,
  resetForm,
  submitContact,
} = useContact()

const charCount = computed(() => form.value.message.length)

const handleSubmit = async () => {
  await submitContact()
}
</script>

<template>
  <div
    id="contact-form"
    class="w-full rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden"
  >
    <!-- Background subtle gradient accent -->
    <div
      class="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/5 via-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
    />

    <!-- Header info -->
    <div class="relative z-10 mb-8 sm:mb-10">
      <div
        class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-wider text-primary mb-3"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-secondary" />
        {{ t('contact.form.badge') }}
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        {{ t('contact.form.title') }}
      </h2>
      <p class="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
        {{ t('contact.form.subtitle') }}
      </p>
    </div>

    <!-- ── SUCCESS STATE ── -->
    <div v-if="isSuccess" class="relative z-10 py-6 space-y-6 [&>.popup]:!mt-0 animate-fade-in">
      <SuccessBanner
        :title="t('contact.form.successTitle')"
        :message="serverSuccessMessage || t('contact.form.successMessage')"
      />

      <div class="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-bold text-emerald-900">Direct reply to your inbox</p>
            <p class="text-[11px] text-emerald-700">Check your email for confirmation and updates from our support desk.</p>
          </div>
        </div>

        <button
          type="button"
          @click="resetForm"
          class="shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-primary bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          {{ t('contact.form.sendAnother') }}
        </button>
      </div>
    </div>

    <!-- ── FORM STATE ── -->
    <form v-else @submit.prevent="handleSubmit" novalidate class="relative z-10 space-y-5 sm:space-y-6 [&>.popup]:!mt-0">
      <!-- Server Error Banner -->
      <AlertBanner v-if="serverError" :message="serverError" class="mb-2" />

      <!-- Anti-Bot Honeypot field (hidden from view) -->
      <div class="hidden" aria-hidden="true">
        <label for="contact-hp">Leave this empty</label>
        <input
          id="contact-hp"
          v-model="form._hp"
          type="text"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <!-- Row 1: Name and Email -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- Full Name -->
        <BaseInput
          id="contact-name"
          v-model="form.name"
          :label="t('contact.form.nameLabel')"
          :placeholder="t('contact.form.namePlaceholder')"
          :required="true"
          :disabled="isSubmitting"
          :touched="touched.name"
          :error="errors.name"
          autocomplete="name"
          @blur="touchField('name')"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </template>
        </BaseInput>

        <!-- Email Address -->
        <BaseInput
          id="contact-email"
          v-model="form.email"
          type="email"
          :label="t('contact.form.emailLabel')"
          :placeholder="t('contact.form.emailPlaceholder')"
          :required="true"
          :disabled="isSubmitting"
          :touched="touched.email"
          :error="errors.email"
          autocomplete="email"
          @blur="touchField('email')"
        >
          <template #icon>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </template>
        </BaseInput>
      </div>

      <!-- Row 2: Subject -->
      <!-- <BaseInput
        id="contact-subject"
        v-model="form.subject"
        :label="t('contact.form.subjectLabel')"
        :placeholder="t('contact.form.subjectPlaceholder')"
        :required="true"
        :disabled="isSubmitting"
        :touched="touched.subject"
        :error="errors.subject"
        @blur="touchField('subject')"
      >
        <template #icon>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </template>
      </BaseInput> -->

      <!-- Row 3: Message Textarea -->
      <div class="space-y-1.5 w-full">
        <div class="flex items-center justify-between">
          <label for="contact-message" class="block text-xs font-bold uppercase tracking-wider text-primary/90">
            {{ t('contact.form.messageLabel') }}
            <span class="text-tertiary ml-0.5 font-bold">*</span>
          </label>
          <span class="text-[11px] font-medium text-slate-400">
            {{ charCount }} / 5000
          </span>
        </div>

        <div class="relative group">
          <textarea
            id="contact-message"
            v-model="form.message"
            rows="5"
            :placeholder="t('contact.form.messagePlaceholder')"
            :disabled="isSubmitting"
            @blur="touchField('message')"
            :class="[
              'w-full p-4 text-sm font-medium transition-all duration-200 outline-none rounded-2xl text-slate-800 placeholder:text-slate-400/80 shadow-sm resize-y min-h-[130px]',
              isSubmitting ? 'opacity-60 cursor-not-allowed bg-slate-100/80 border-slate-200' : '',
              touched.message && errors.message
                ? 'border-2 border-tertiary/80 bg-red-50/40 text-tertiary focus:border-tertiary focus:ring-4 focus:ring-tertiary/10'
                : 'border border-slate-200/90 bg-white/90 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:shadow-md'
            ]"
          />
        </div>

        <!-- Inline Error Message -->
        <p
          v-if="touched.message && errors.message"
          class="text-xs text-tertiary font-semibold flex items-center gap-1.5 mt-1"
        >
          <svg class="w-3.5 h-3.5 shrink-0 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ errors.message }}</span>
        </p>
      </div>

      <!-- Bottom Actions & Security Note -->
      <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-[11px] text-slate-400 font-medium order-2 sm:order-1">
          <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>{{ t('contact.form.secureNotice') }}</span>
        </div>

        <div class="w-full sm:w-auto order-1 sm:order-2">
          <BaseButton
            type="submit"
            variant="secondary"
            size="md"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            :block="false"
            class="w-full sm:w-auto min-w-[200px]"
          >
            <span class="w-max">{{ isSubmitting ? t('contact.form.submittingBtn') : t('contact.form.submitBtn') }}</span>
            <svg
              v-if="!isSubmitting"
              class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>
