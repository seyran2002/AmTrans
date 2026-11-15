<template>
  <div class="min-h-screen bg-bg-primary flex flex-col justify-between relative overflow-hidden font-sans selection:bg-secondary/20 selection:text-primary">
    <!-- Ambient Floating Background Accents -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 -right-40 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Global App Header -->
    <AppHeader />

    <main class="w-full max-w-2xl mx-auto px-4 py-8 z-10 my-auto">
      <!-- 1. Loading State -->
      <VerifyLoadingSection
        v-if="isLoading"
        :title="t('verify.loadingTitle')"
        :subtitle="t('verify.loadingSubtitle')"
      />

      <!-- 2. User Not Found / Invalid Parameters State -->
      <VerifyNotFoundSection
        v-else-if="userNotFound || !user"
        :title="t('verify.notFoundTitle')"
        :message="t('verify.notFoundMessage')"
        :back-text="t('verify.backToHome')"
      />

      <!-- 3. Form Section -->
      <div v-else class="bg-white/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl shadow-primary/10 border border-white/60 relative animate-fade-in">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-bold mb-3 shadow-xs">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Account Verification</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-primary tracking-tight">
            {{ t('verify.title') }}
          </h1>
          <p class="text-sm text-slate-500 mt-2 font-medium max-w-md mx-auto">
            {{ t('verify.subtitle') }}
          </p>
        </div>

        <VerifyProfileForm
          :user="user"
          @success="handleSuccess"
        />
      </div>
    </main>

    <!-- Global App Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import VerifyLoadingSection from '~/components/sections/verify/VerifyLoadingSection.vue'
import VerifyNotFoundSection from '~/components/sections/verify/VerifyNotFoundSection.vue'
import VerifyProfileForm from '~/components/sections/verify/VerifyProfileForm.vue'
import { useI18n } from '~/composables/useI18n'
import { useVerify, type VerifyUserResponse } from '~/composables/useVerify'

definePageMeta({ layout: 'guest' })

// Page Title & Meta
useHead({
  title: 'Verify Profile - AMTRANS',
  meta: [
    { name: 'description', content: 'Complete your profile verification to access full logistics services.' }
  ]
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { verifyUser, isLoading } = useVerify()

const user = ref<VerifyUserResponse | null>(null)
const userNotFound = ref(false)

onMounted(async () => {
  const email = (route.query.email as string) || ''
  const code = (route.query.code as string) || ''

  if (!email || !code) {
    userNotFound.value = true
    return
  }

  const result = await verifyUser(email, code)
  if (result) {
    user.value = result
  } else {
    userNotFound.value = true
  }
})

const handleSuccess = (_updatedUser: VerifyUserResponse) => {
  setTimeout(() => {
    router.push('/auth/login')
  }, 2500)
}
</script>