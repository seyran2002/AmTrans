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

    <!-- Core Rules Grid: Tariffs, Volumetric, 5kg Min, Snapshot -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
        <div class="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          1
        </div>
        <h4 class="text-sm font-bold text-slate-900">{{ t('howToUse.ch5.rule1Title') }}</h4>
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ t('howToUse.ch5.rule1Desc') }}
        </p>
      </div>

      <div class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
        <div class="w-9 h-9 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs">
          2
        </div>
        <h4 class="text-sm font-bold text-slate-900">{{ t('howToUse.ch5.rule2Title') }}</h4>
        <p class="text-xs text-slate-600 leading-relaxed font-mono">
          {{ t('howToUse.ch5.rule2Formula') }}
        </p>
        <p class="text-[11px] text-slate-500 leading-relaxed">
          {{ t('howToUse.ch5.rule2Desc') }}
        </p>
      </div>

      <div class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
        <div class="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold text-xs">
          3
        </div>
        <h4 class="text-sm font-bold text-slate-900">{{ t('howToUse.ch5.rule3Title') }}</h4>
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ t('howToUse.ch5.rule3Desc') }}
        </p>
      </div>

      <div class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
        <div class="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
          4
        </div>
        <h4 class="text-sm font-bold text-slate-900">{{ t('howToUse.ch5.rule4Title') }}</h4>
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ t('howToUse.ch5.rule4Desc') }}
        </p>
      </div>
    </div>

    <!-- INTERACTIVE SHIPPING COST CALCULATOR DEMONSTRATION -->
    <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold mb-2">
            <span>{{ t('howToUse.ch5.widgetBadge') }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900">
            {{ t('howToUse.ch5.widgetTitle') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {{ t('howToUse.ch5.widgetDesc') }}
          </p>
        </div>
      </div>

      <!-- Calculator Box -->
      <div class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/80 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Input Controls -->
          <div class="space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">
              {{ t('howToUse.ch5.inputParams') }}
            </h4>

            <!-- Physical Weight Input -->
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>{{ t('howToUse.ch5.physicalWeightScale') }}</span>
                <span class="text-primary font-mono">{{ inputWeight }} kg</span>
              </div>
              <input
                type="range"
                v-model.number="inputWeight"
                min="0.5"
                max="20"
                step="0.5"
                class="w-full accent-primary cursor-pointer"
              />
            </div>

            <!-- Dimensions Sliders -->
            <div class="grid grid-cols-1 min-[420px]:grid-cols-3 gap-2.5">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">{{ t('howToUse.ch5.lengthCm') }}</label>
                <input
                  type="number"
                  v-model.number="inputLength"
                  min="5"
                  max="150"
                  class="w-full text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">{{ t('howToUse.ch5.widthCm') }}</label>
                <input
                  type="number"
                  v-model.number="inputWidth"
                  min="5"
                  max="150"
                  class="w-full text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">{{ t('howToUse.ch5.heightCm') }}</label>
                <input
                  type="number"
                  v-model.number="inputHeight"
                  min="5"
                  max="150"
                  class="w-full text-xs font-mono font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800"
                />
              </div>
            </div>

            <!-- Tariff Rate Selector -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">{{ t('howToUse.ch5.routeTariffLabel') }}</label>
              <select v-model.number="inputTariff" class="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 cursor-pointer">
                <option :value="2500">{{ t('howToUse.ch5.routeUae') }}</option>
                <option :value="4500">{{ t('howToUse.ch5.routeUsa') }}</option>
                <option :value="3800">{{ t('howToUse.ch5.routeChina') }}</option>
                <option :value="1800">{{ t('howToUse.ch5.routeRussia') }}</option>
              </select>
            </div>
          </div>

          <!-- Real-Time Calculation Results -->
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ t('howToUse.ch5.breakdown') }}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                  {{ t('howToUse.common.livePreview') }}
                </span>
              </div>

              <!-- Metric Rows -->
              <div class="space-y-2.5 pt-3 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-500">{{ t('howToUse.ch5.actualWeight') }}</span>
                  <span class="font-mono font-bold text-slate-800">{{ inputWeight.toFixed(1) }} kg</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-slate-500">{{ t('howToUse.ch5.volumetricWeight') }} ({{ inputLength }}×{{ inputWidth }}×{{ inputHeight }}/6000):</span>
                  <span :class="['font-mono font-bold', isVolumetricLarger ? 'text-amber-600' : 'text-slate-800']">
                    {{ volumetricWeight.toFixed(2) }} kg
                    <span v-if="isVolumetricLarger" class="text-[10px] ml-1">{{ t('howToUse.ch5.higher') }}</span>
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-slate-500">{{ t('howToUse.ch5.chargeableWeight') }}</span>
                  <span class="font-mono font-bold text-slate-800">{{ chargeableWeight.toFixed(2) }} kg</span>
                </div>

                <!-- 5kg Minimum Rule Row -->
                <div class="flex justify-between items-center p-2 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-900">
                  <span class="font-semibold flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"/></svg>
                    {{ t('howToUse.ch5.billableWeightMin') }}
                  </span>
                  <span class="font-mono font-black text-sm">
                    {{ billableWeight.toFixed(2) }} kg
                    <span v-if="billableWeight > chargeableWeight" class="text-[10px] font-normal block text-right">{{ t('howToUse.ch5.applied') }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Final Price Highlight -->
            <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{{ t('howToUse.ch5.totalShippingFee') }}</span>
                <span class="text-2xl font-black text-primary">
                  {{ calculatedPrice.toLocaleString() }} AMD
                </span>
              </div>
              <span class="text-[11px] text-slate-400 font-medium sm:text-right">
                {{ inputTariff.toLocaleString() }} AMD/kg × {{ billableWeight.toFixed(1) }}kg
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Routes Without Tariffs & Price Estimates Walkthrough -->
    <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 sm:p-8 shadow-xs space-y-5">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2">
            <span>{{ t('howToUse.ch5.noTariffBadge') }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900">
            {{ t('howToUse.ch5.noTariffTitle') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {{ t('howToUse.ch5.noTariffDesc') }}
          </p>
        </div>
      </div>

      <!-- Accept / Reject Estimate Flow Interactive Demonstration -->
      <div class="p-3.5 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-4">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-amber-900 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            {{ t('howToUse.ch5.estimateFlowTitle') }}
          </span>
          <span class="text-amber-800/80 font-medium">{{ t('howToUse.ch5.customerActionRequired') }}</span>
        </div>

        <div class="max-w-md mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ t('howToUse.ch5.proposedRate') }}</span>
              <span class="text-lg font-black text-amber-700">3,200 AMD / kg</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ t('howToUse.ch5.totalEstimatedCost') }}</span>
              <span class="text-lg font-black text-slate-900">16,000 AMD</span>
            </div>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">
            {{ t('howToUse.ch5.estimateExplanation') }}
          </p>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
            <div class="flex-1 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span class="text-xs font-bold text-emerald-800 block">{{ t('howToUse.ch5.acceptEstimate') }}</span>
              <span class="text-[10px] text-emerald-600 block mt-0.5">{{ t('howToUse.ch5.acceptDesc') }}</span>
            </div>
            <div class="flex-1 p-2.5 rounded-xl bg-red-50 border border-red-200 text-center">
              <span class="text-xs font-bold text-red-800 block">{{ t('howToUse.ch5.rejectCancel') }}</span>
              <span class="text-[10px] text-red-600 block mt-0.5">{{ t('howToUse.ch5.rejectDesc') }}</span>
            </div>
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
import { ref, computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import HowToUseExpandableTip from '../HowToUseExpandableTip.vue'
import HowToUseChapterNav from '../HowToUseChapterNav.vue'
import type { TutorialChapter } from '~/data/how-to-use.data'

const { t } = useI18n()

defineProps<{
  chapter: TutorialChapter
  prevChapter?: TutorialChapter | null
  nextChapter?: TutorialChapter | null
}>()

defineEmits<{
  (e: 'navigate', id: string): void
}>()

// Interactive Calculator State
const inputWeight = ref(1.5)
const inputLength = ref(30)
const inputWidth = ref(20)
const inputHeight = ref(15)
const inputTariff = ref(2500)

const volumetricWeight = computed(() => {
  return (inputLength.value * inputWidth.value * inputHeight.value) / 6000
})

const isVolumetricLarger = computed(() => {
  return volumetricWeight.value > inputWeight.value
})

const chargeableWeight = computed(() => {
  return Math.max(inputWeight.value, volumetricWeight.value)
})

const billableWeight = computed(() => {
  return Math.max(chargeableWeight.value, 5)
})

const calculatedPrice = computed(() => {
  return Math.round(billableWeight.value * inputTariff.value)
})
</script>
