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

    <!-- CRITICAL RULE BANNER: Register Before Arrival -->
    <div class="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500/15 via-white to-amber-500/5 border-2 border-amber-400/60 p-4 sm:p-6 sm:p-8 shadow-xs">
      <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="space-y-1">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-800 block">
            {{ t('howToUse.ch4.ruleBadge') }}
          </span>
          <h3 class="text-lg sm:text-xl font-black text-slate-900">
            {{ t('howToUse.ch4.ruleTitle') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pt-1">
            {{ t('howToUse.ch4.ruleDesc') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Registration Fields Breakdown & UI Mockup -->
    <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold mb-2">
            <span>{{ t('howToUse.ch4.badge') }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900">
            {{ t('howToUse.ch4.formTitle') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {{ t('howToUse.ch4.formDesc') }}
          </p>
        </div>

        <NuxtLink
          :to="localePath('/dashboard/orders')"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-xs font-bold text-slate-700 transition-colors"
        >
          <span>{{ t('howToUse.ch4.openOrders') }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </NuxtLink>
      </div>

      <!-- UI Demonstration: Order Modal Simulation -->
      <div class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 sm:p-5 sm:p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200/70 text-xs">
          <span class="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
            {{ t('howToUse.ch4.mockupTitle') }}
          </span>
        </div>

        <!-- Simulated Modal Content -->
        <div class="max-w-xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md space-y-4">
          <!-- 1. Route Selector -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch4.fromOfficeLabel') }}</label>
              <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between">
                <span class="truncate pr-1">Dubai Hub, UAE</span>
                <span class="text-slate-400 text-[10px] shrink-0">{{ t('howToUse.ch4.origin') }}</span>
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch4.toOfficeLabel') }}</label>
              <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between">
                <span class="truncate pr-1">Yerevan Central</span>
                <span class="text-slate-400 text-[10px] shrink-0">{{ t('howToUse.ch4.destination') }}</span>
              </div>
            </div>
          </div>

          <!-- 2. Receiver & Market -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch4.assignedReceiverLabel') }}</label>
              <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 truncate">
                {{ t('howToUse.ch4.selfOption') }}
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch4.marketLabel') }}</label>
              <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 truncate">
                Amazon.ae
              </div>
            </div>
          </div>

          <!-- 3. Product Description & Price -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch4.descLabel') }}</label>
              <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 truncate">
                {{ t('howToUse.ch4.sampleDesc') }}
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch4.priceCurrencyLabel') }}</label>
              <div class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 truncate">
                350 AED
              </div>
            </div>
          </div>

          <!-- 4. Weight & Dimensions Grid -->
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">{{ t('howToUse.ch4.packageSpecsLabel') }}</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span class="text-[10px] text-slate-400 font-bold block">{{ t('howToUse.ch4.weightLabel') }}</span>
                <span class="font-bold text-slate-800">1.2 kg</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span class="text-[10px] text-slate-400 font-bold block">{{ t('howToUse.ch4.lengthLabel') }}</span>
                <span class="font-bold text-slate-800">25 cm</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span class="text-[10px] text-slate-400 font-bold block">{{ t('howToUse.ch4.widthLabel') }}</span>
                <span class="font-bold text-slate-800">20 cm</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span class="text-[10px] text-slate-400 font-bold block">{{ t('howToUse.ch4.heightLabel') }}</span>
                <span class="font-bold text-slate-800">10 cm</span>
              </div>
            </div>
          </div>

          <!-- 5. Condition & TN VED -->
          <div class="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">{{ t('howToUse.ch4.productConditionLabel') }}</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {{ t('howToUse.ch4.brandNew') }}
              </span>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">{{ t('howToUse.ch4.tnVedCodeLabel') }}</span>
              <span class="font-mono text-xs font-bold text-slate-700">8518 30 000 0</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- What Happens After Registration -->
    <div class="rounded-2xl sm:rounded-3xl bg-slate-900 text-white p-4 sm:p-6 sm:p-8 shadow-md">
      <div class="flex items-center gap-2 mb-3">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ t('howToUse.ch4.nextStepsBadge') }}</span>
      </div>
      <h3 class="text-lg sm:text-xl font-bold mb-3">
        {{ t('howToUse.ch4.afterSubmitTitle') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs text-slate-300 leading-relaxed font-normal">
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
          <span class="w-6 h-6 rounded-lg bg-primary text-white font-mono font-bold flex items-center justify-center">1</span>
          <h4 class="font-bold text-white text-sm">{{ t('howToUse.ch4.step1CardTitle') }}</h4>
          <p>{{ t('howToUse.ch4.step1CardDesc') }}</p>
        </div>
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
          <span class="w-6 h-6 rounded-lg bg-secondary text-white font-mono font-bold flex items-center justify-center">2</span>
          <h4 class="font-bold text-white text-sm">{{ t('howToUse.ch4.step2CardTitle') }}</h4>
          <p>{{ t('howToUse.ch4.step2CardDesc') }}</p>
        </div>
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
          <span class="w-6 h-6 rounded-lg bg-emerald-500 text-white font-mono font-bold flex items-center justify-center">3</span>
          <h4 class="font-bold text-white text-sm">{{ t('howToUse.ch4.step3CardTitle') }}</h4>
          <p>{{ t('howToUse.ch4.step3CardDesc') }}</p>
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
</script>
