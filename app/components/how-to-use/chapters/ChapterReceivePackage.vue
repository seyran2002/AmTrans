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

    <!-- Section 1: Digital QR Code Pickup Pass & UI Mockup -->
    <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
            <span>{{ t('howToUse.ch7.badge1') }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900">
            {{ t('howToUse.ch7.title1') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {{ t('howToUse.ch7.desc1') }}
          </p>
        </div>
      </div>

      <!-- UI Demonstration: QR Card Mockup (Modeled after OrderQrCard.vue) -->
      <div class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 sm:p-5 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200/70 text-xs">
          <span class="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            {{ t('howToUse.ch7.mockupTitle') }}
          </span>
        </div>

        <!-- Realistic QR Card Component -->
        <div class="max-w-md mx-auto bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm text-center space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2 text-left min-w-0 pr-1">
              <div class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div class="min-w-0">
                <span class="text-xs font-bold text-slate-900 block leading-tight truncate">{{ t('howToUse.ch7.branchQrTitle') }}</span>
                <span class="text-[10px] text-slate-400 truncate block">{{ t('howToUse.ch7.orderNumberSample') }}</span>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
              {{ t('howToUse.ch7.readyForPickup') }}
            </span>
          </div>

          <!-- Stylized Mock QR Code -->
          <div class="relative p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto max-w-full">
            <div class="w-36 h-36 min-[400px]:w-44 min-[400px]:h-44 bg-white p-2 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center relative overflow-hidden mx-auto">
              <!-- Visual QR Code Pattern -->
              <div class="w-full h-full grid grid-cols-6 grid-rows-6 gap-1 p-1">
                <div class="bg-slate-900 col-span-2 row-span-2 rounded-sm" />
                <div class="bg-slate-900 col-start-5 col-span-2 row-span-2 rounded-sm" />
                <div class="bg-slate-900 row-start-5 col-span-2 row-span-2 rounded-sm" />
                <div class="bg-slate-900 col-start-3 row-start-3 rounded-xs" />
                <div class="bg-slate-900 col-start-4 row-start-4 rounded-xs" />
                <div class="bg-slate-900 col-start-5 row-start-3 rounded-xs" />
                <div class="bg-slate-900 col-start-3 row-start-5 rounded-xs" />
                <div class="bg-slate-900 col-start-4 row-start-2 rounded-xs" />
                <div class="bg-primary col-start-3 row-start-4 col-span-2 rounded-xs" />
              </div>
            </div>

            <span class="block text-xs font-mono font-bold text-slate-700 mt-2.5 tracking-wider truncate">
              AM-TRK-78219-ARM
            </span>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <button
              type="button"
              class="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span>{{ t('howToUse.ch7.downloadImage') }}</span>
            </button>
            <button
              type="button"
              class="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer text-center"
            >
              {{ t('howToUse.ch7.sharePass') }}
            </button>
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
      :next-chapter="null"
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

defineProps<{
  chapter: TutorialChapter
  prevChapter?: TutorialChapter | null
}>()

defineEmits<{
  (e: 'navigate', id: string): void
}>()
</script>
