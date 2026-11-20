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

    <!-- Interactive Account Type & Profile Verification Walkthrough -->
    <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold mb-2">
            <span>{{ t('howToUse.ch2.badge') }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900">
            {{ t('howToUse.ch2.sectionTitle') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {{ t('howToUse.ch2.sectionDesc') }}
          </p>
        </div>

        <NuxtLink
          :to="localePath('/dashboard/profile')"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-xs font-bold text-slate-700 transition-colors"
        >
          <span>{{ t('howToUse.ch2.openProfile') }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Interactive Entity Switcher & Field Demonstration -->
      <div class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 sm:p-5 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200/70 text-xs">
          <span class="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-secondary inline-block" />
            {{ t('howToUse.ch2.mockupTitle') }}
          </span>
        </div>

        <!-- Entity Type Toggle (Simulating EntityTypeSwitch.vue) -->
        <div class="max-w-md mx-auto">
          <div class="p-1.5 bg-slate-200/70 rounded-2xl flex flex-col min-[420px]:flex-row items-stretch sm:items-center gap-1.5 select-none">
            <button
              type="button"
              @click="isIndividual = true"
              :class="[
                'w-full min-[420px]:flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5',
                isIndividual
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{{ t('howToUse.ch2.individual') }}</span>
            </button>

            <button
              type="button"
              @click="isIndividual = false"
              :class="[
                'w-full min-[420px]:flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5',
                !isIndividual
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{{ t('howToUse.ch2.legalEntity') }}</span>
            </button>
          </div>
        </div>

        <!-- Dynamic Form Fields Box -->
        <div class="max-w-md mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <!-- INDIVIDUAL FIELDS -->
          <template v-if="isIndividual">
            <div class="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch2.firstName') }}</label>
                <input type="text" readonly value="Armen" class="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch2.lastName') }}</label>
                <input type="text" readonly value="Sargsyan" class="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium" />
              </div>
            </div>

            <div class="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch2.documentType') }}</label>
                <select v-model="selectedDocType" class="w-full text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 font-medium cursor-pointer">
                  <option value="IdCard">{{ t('howToUse.ch2.docIdCard') }}</option>
                  <option value="Passport">{{ t('howToUse.ch2.docPassport') }}</option>
                  <option value="Biometric">{{ t('howToUse.ch2.docBiometric') }}</option>
                  <option value="Foreign">{{ t('howToUse.ch2.docForeign') }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch2.documentNumber') }}</label>
                <input type="text" readonly :value="docNumberPlaceholder" class="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-medium" />
              </div>
            </div>
          </template>

          <!-- LEGAL ENTITY FIELDS -->
          <template v-else>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch2.companyName') }}</label>
              <input type="text" readonly value="TransGlobal Logistics LLC" class="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch2.taxpayerId') }}</label>
              <input type="text" readonly value="02594837" class="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-medium" />
            </div>
          </template>

          <!-- Common Fields -->
          <div class="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch2.phoneNumber') }}</label>
              <input type="text" readonly value="+374 94 123456" class="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch2.deliveryAddress') }}</label>
              <input type="text" readonly value="Sayat-Nova Ave, Yerevan" class="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Telegram Notifications Integration Feature Card -->
    <div class="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-500/10 via-white to-sky-500/5 border border-sky-500/20 p-4 sm:p-6 sm:p-8 shadow-xs">
      <div class="flex items-start gap-4 flex-col sm:flex-row justify-between">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-700 text-xs font-bold">
            <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            <span>{{ t('howToUse.ch2.telegramBadge') }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900">
            {{ t('howToUse.ch2.telegramTitle') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            {{ t('howToUse.ch2.telegramDesc') }}
          </p>
        </div>
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
      :prev-chapter="prevChapter"
      :next-chapter="nextChapter"
      @navigate="$emit('navigate', $event)"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import HowToUseExpandableTip from '../HowToUseExpandableTip.vue'
import HowToUseChapterNav from '../HowToUseChapterNav.vue'
import type { TutorialChapter } from '~/data/how-to-use.data'

const { t } = useI18n()
const localePath = useLocalePath()

defineProps<{
  chapter: TutorialChapter
  prevChapter?: TutorialChapter | null
  nextChapter?: TutorialChapter | null
}>()

defineEmits<{
  (e: 'navigate', id: string): void
}>()

const isIndividual = ref(true)
const selectedDocType = ref('IdCard')

const docNumberPlaceholder = computed(() => {
  switch (selectedDocType.value) {
    case 'IdCard':
      return '010482914'
    case 'Passport':
      return 'AN0482914'
    case 'Biometric':
      return 'BA0982341'
    case 'Foreign':
      return 'P84920481'
    default:
      return '010482914'
  }
})
</script>
