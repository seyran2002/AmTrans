<template>
  <section :id="chapter.id" class="scroll-mt-24 space-y-6">
    <!-- Chapter Header -->
    <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 sm:p-8 shadow-xs">
      <div class="flex items-center gap-3 mb-3">
        <span class="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-mono font-black text-sm flex items-center justify-center border border-primary/20 shadow-2xs">
          {{ chapter.number }}
        </span>
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            {{ t('howToUse.common.chapter') }} {{ chapter.number }} • {{ chapter.readTime }}
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {{ chapter.title }}
          </h2>
        </div>
      </div>
      <p class="text-sm sm:text-base text-slate-600 leading-relaxed font-medium mt-2">
        {{ chapter.description }}
      </p>
    </div>

    <!-- Step 1: Registration Walkthrough with Realistic UI Mockup -->
    <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold mb-2">
            <span>{{ t('howToUse.common.step') }} 1</span>
            <span>•</span>
            <span>{{ t('howToUse.ch1.step1Badge') }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900">
            {{ t('howToUse.ch1.step1Title') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {{ t('howToUse.ch1.step1Desc') }}
          </p>
        </div>

        <NuxtLink
          :to="localePath('/auth/register')"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-xs font-bold text-slate-700 transition-colors"
        >
          <span>{{ t('howToUse.ch1.openRegister') }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </NuxtLink>
      </div>

      <!-- UI Demonstration: Interactive Registration Form Mockup -->
      <div class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 sm:p-5 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200/70 text-xs">
          <span class="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            {{ t('howToUse.ch1.mockupTitle') }}
          </span>
          <span class="text-slate-400 font-mono text-[11px] truncate">app/pages/auth/register.vue</span>
        </div>

        <div class="max-w-md mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
          <!-- Mock Email Input -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ t('howToUse.ch1.emailLabel') }}</label>
            <div class="relative">
              <input
                type="email"
                readonly
                value="customer@example.am"
                class="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium"
              />
              <svg class="w-4 h-4 text-emerald-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <!-- Mock Password with Security Checklist -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">{{ t('howToUse.ch1.createPassword') }}</label>
            <input
              type="password"
              readonly
              value="SecureAmTrans2026!"
              class="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-mono"
            />
          </div>

          <!-- Password Requirements Checklist -->
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px]">
            <span class="font-bold text-slate-600 block mb-1">{{ t('howToUse.ch1.secCriteria') }}</span>
            <div class="grid grid-cols-1 min-[380px]:grid-cols-2 gap-1.5 text-slate-600">
              <div class="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                <span>{{ t('howToUse.ch1.reqLength') }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                <span>{{ t('howToUse.ch1.reqUpper') }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                <span>{{ t('howToUse.ch1.reqLower') }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                <span>{{ t('howToUse.ch1.reqSpecial') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2 & 3: Email Verification and Login -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Step 2 -->
      <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
          <span>{{ t('howToUse.common.step') }} 2</span>
          <span>•</span>
          <span>{{ t('howToUse.ch1.step2Badge') }}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-900">
          {{ t('howToUse.ch1.step2Title') }}
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {{ t('howToUse.ch1.step2Desc') }}
        </p>

        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-600 break-all select-all">
          https://amtrans.am/auth/verify?token=a8f09d...
        </div>

        <ul class="space-y-2 text-xs text-slate-600 font-medium pt-1">
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{ t('howToUse.ch1.step2Point1') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{ t('howToUse.ch1.step2Point2') }}</span>
          </li>
        </ul>
      </div>

      <!-- Step 3 -->
      <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
          <span>{{ t('howToUse.common.step') }} 3</span>
          <span>•</span>
          <span>{{ t('howToUse.ch1.step3Badge') }}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-900">
          {{ t('howToUse.ch1.step3Title') }}
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {{ t('howToUse.ch1.step3Desc') }}
        </p>

        <!-- Mock User Code Badge -->
        <div class="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ t('howToUse.ch1.uniqueIdentifier') }}</span>
            <span class="text-xl font-mono font-black text-primary">XXX-AMXXXXXX</span>
          </div>
          <span class="px-2.5 py-1 rounded-lg bg-primary text-white font-mono text-xs font-bold shadow-xs">
            {{ t('howToUse.common.assigned') }}
          </span>
        </div>

        <p class="text-xs text-slate-500 leading-relaxed">
          {{ t('howToUse.ch1.step3Note') }}
        </p>
      </div>
    </div>

    <!-- Tips -->
    <div class="space-y-3">
      <HowToUseExpandableTip
        v-for="(tip, idx) in chapter.tips"
        :key="idx"
        :title="tip.title"
        :content="tip.content"
        :type="tip.type"
      />
    </div>

    <!-- Bottom Navigation -->
    <HowToUseChapterNav
      :prev-chapter="null"
      :next-chapter="nextChapter"
      @navigate="$emit('navigate', $event)"
    />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import HowToUseExpandableTip from '../HowToUseExpandableTip.vue'
import HowToUseChapterNav from '../HowToUseChapterNav.vue'
import type { TutorialChapter } from '~/data/how-to-use.data'

const { t } = useI18n()
const localePath = useLocalePath()

defineProps<{
  chapter: TutorialChapter
  nextChapter?: TutorialChapter | null
}>()

defineEmits<{
  (e: 'navigate', id: string): void
}>()
</script>
