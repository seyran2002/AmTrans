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

    <!-- Section 1: Global Warehouse Addresses & Interactive Address Card -->
    <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold mb-2">
            <span>{{ t('howToUse.ch3.badge1') }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900">
            {{ t('howToUse.ch3.title1') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {{ t('howToUse.ch3.desc1') }}
          </p>
        </div>

        <NuxtLink
          :to="localePath('/dashboard/addresses')"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-xs font-bold text-slate-700 transition-colors"
        >
          <span>{{ t('howToUse.ch3.viewAllAddresses') }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Interactive Warehouse Address Demonstration Card -->
      <div class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 sm:p-5 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200/70 text-xs">
          <span class="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            {{ t('howToUse.ch3.mockupTitle1') }}
          </span>
        </div>

        <!-- Warehouse Card Demonstration (Matching OfficeCard.vue) -->
        <div class="max-w-lg mx-auto bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <!-- Hub Header -->
          <div class="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                🇦🇪
              </div>
              <div class="min-w-0">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ t('howToUse.ch3.uaeCountry') }}</span>
                <h4 class="text-base font-extrabold text-slate-900 truncate">{{ t('howToUse.ch3.dubaiHub') }}</h4>
              </div>
            </div>
          </div>

          <!-- Address Fields with Copy Buttons -->
          <div class="space-y-2.5 text-xs">
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div class="min-w-0 pr-2">
                <span class="text-slate-400 block text-[10px] font-bold uppercase">{{ t('howToUse.ch3.recipientNameLabel') }}</span>
                <span class="font-mono font-bold text-slate-900 truncate block">Armen Sargsyan / XXX-AMXXXXXX</span>
              </div>
              <button
                type="button"
                @click="copyText('Armen Sargsyan / XXX-AMXXXXXX', 'name')"
                class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-primary text-slate-600 hover:text-primary font-bold text-[11px] shrink-0 transition-colors"
              >
                {{ copiedKey === 'name' ? t('howToUse.common.copied') : t('howToUse.common.copy') }}
              </button>
            </div>

            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div class="min-w-0 pr-2">
                <span class="text-slate-400 block text-[10px] font-bold uppercase">{{ t('howToUse.ch3.streetAddressLabel') }}</span>
                <span class="font-mono font-bold text-slate-900 truncate block">Baniyas Square, Deira, Warehouse 14</span>
              </div>
              <button
                type="button"
                @click="copyText('Baniyas Square, Deira, Warehouse 14', 'street')"
                class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-primary text-slate-600 hover:text-primary font-bold text-[11px] shrink-0 transition-colors"
              >
                {{ copiedKey === 'street' ? t('howToUse.common.copied') : t('howToUse.common.copy') }}
              </button>
            </div>

            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div class="min-w-0 pr-2">
                <span class="text-slate-400 block text-[10px] font-bold uppercase">{{ t('howToUse.ch3.addressLine2Label') }}</span>
                <span class="font-mono font-bold text-primary truncate block">XXX-AMXXXXXX</span>
              </div>
              <button
                type="button"
                @click="copyText('XXX-AMXXXXXX', 'line2')"
                class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-primary text-slate-600 hover:text-primary font-bold text-[11px] shrink-0 transition-colors"
              >
                {{ copiedKey === 'line2' ? t('howToUse.common.copied') : t('howToUse.common.copy') }}
              </button>
            </div>

            <div class="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-slate-400 block text-[10px] font-bold uppercase">{{ t('howToUse.ch3.cityEmirateLabel') }}</span>
                <span class="font-bold text-slate-800">Dubai</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-slate-400 block text-[10px] font-bold uppercase">{{ t('howToUse.ch3.warehousePhoneLabel') }}</span>
                <span class="font-bold text-slate-800">+XXX X XXX XXXX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Managing Receivers (Third-Party Recipients) -->
    <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold mb-2">
            <span>{{ t('howToUse.ch3.badge2') }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900">
            {{ t('howToUse.ch3.title2') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {{ t('howToUse.ch3.desc2') }}
          </p>
        </div>

        <NuxtLink
          :to="localePath('/dashboard/receivers')"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-xs font-bold text-slate-700 transition-colors"
        >
          <span>{{ t('howToUse.ch3.manageReceivers') }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Receiver Card Mockup -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                AS
              </div>
              <div>
                <span class="text-sm font-bold text-slate-900 block leading-tight">Anahit Sargsyan</span>
                <span class="text-[11px] text-slate-400 font-medium">{{ t('howToUse.ch3.sampleReceiverRelation') }}</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
              {{ t('howToUse.ch2.docIdCard') }}
            </span>
          </div>

          <div class="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
            <div class="flex justify-between">
              <span class="text-slate-400">{{ t('howToUse.ch3.documentNoLabel') }}</span>
              <span class="font-mono font-bold text-slate-700">009482103</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">{{ t('howToUse.ch3.phoneLabel') }}</span>
              <span class="font-semibold text-slate-700">+374 98 765432</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">{{ t('howToUse.ch3.cityLabel') }}</span>
              <span class="font-semibold text-slate-700">Yerevan, Kentron</span>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
          <div class="w-10 h-10 rounded-2xl bg-white text-slate-400 flex items-center justify-center shadow-xs">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h5 class="text-xs font-bold text-slate-800">{{ t('howToUse.ch3.addReceiverTitle') }}</h5>
            <p class="text-[11px] text-slate-500 max-w-xs mt-0.5">
              {{ t('howToUse.ch3.addReceiverDesc') }}
            </p>
          </div>
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
import { ref } from 'vue'
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

const copiedKey = ref<string | null>(null)

const copyText = (text: string, key: string) => {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(text)
    copiedKey.value = key
    setTimeout(() => {
      copiedKey.value = null
    }, 2000)
  }
}
</script>
