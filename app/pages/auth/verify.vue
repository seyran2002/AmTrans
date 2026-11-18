<template>
  <div class="relative overflow-hidden font-sans selection:bg-secondary/20 selection:text-primary pt-20 sm:pt-28 pb-10 sm:pb-16 min-h-[calc(100vh-140px)] flex flex-col justify-center">
    <!-- Ambient Floating Background Accents -->
    <div class="absolute -top-32 -left-32 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 -right-32 w-64 sm:w-96 h-64 sm:h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

    <main class="w-full max-w-2xl mx-auto px-3.5 sm:px-6 z-10 relative">
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
      <div v-else class="bg-white/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl shadow-primary/10 border border-white/60 relative animate-fade-in">
        <div class="text-center mb-5 sm:mb-7">
          <div class="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] sm:text-xs font-bold mb-2 sm:mb-2.5 shadow-xs">
            <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>{{ t('verify.badge') }}</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-primary tracking-tight">
            {{ t('verify.title') }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-1.5 font-medium max-w-md mx-auto">
            {{ t('verify.subtitle') }}
          </p>
        </div>

        <VerifyProfileForm
          :user="user"
          @success="handleSuccess"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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