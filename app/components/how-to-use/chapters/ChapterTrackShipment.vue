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

    <!-- Interactive 10-Status Lifecycle Timeline -->
    <div class="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold mb-2">
            <span>{{ t('howToUse.ch6.badge') }}</span>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-slate-900">
            {{ t('howToUse.ch6.title1') }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {{ t('howToUse.ch6.desc1') }}
          </p>
        </div>

        <NuxtLink
          to="/dashboard/orders"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-xs font-bold text-slate-700 transition-colors"
        >
          <span>{{ t('howToUse.ch6.trackMyOrders') }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Timeline Tabs: Normal Delivery Flow vs Terminal Exception States -->
      <div class="space-y-4">
        <!-- Normal Flow Horizontal Timeline -->
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
            {{ t('howToUse.ch6.standardTimelineTitle') }}
          </span>

          <div class="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            <button
              v-for="st in normalStatuses"
              :key="st.key"
              type="button"
              @click="selectedStatusKey = st.key"
              :class="[
                'p-2.5 sm:p-3 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden',
                selectedStatusKey === st.key
                  ? 'border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300'
              ]"
            >
              <div class="flex items-center gap-1.5 mb-1.5">
                <span :class="['w-2 h-2 rounded-full shrink-0', st.data.dotClass]" />
                <span class="font-mono text-[10px] font-bold text-slate-400">0{{ st.index }}</span>
              </div>
              <span class="text-[11px] sm:text-xs font-bold text-slate-800 block truncate">
                {{ st.data.label }}
              </span>
            </button>
          </div>
        </div>

        <!-- Exception & Special States -->
        <div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
            {{ t('howToUse.ch6.specialTimelineTitle') }}
          </span>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              v-for="st in specialStatuses"
              :key="st.key"
              type="button"
              @click="selectedStatusKey = st.key"
              :class="[
                'p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between',
                selectedStatusKey === st.key
                  ? 'border-tertiary bg-red-50/50 shadow-xs ring-2 ring-tertiary/20'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300'
              ]"
            >
              <div class="flex items-center gap-2">
                <span :class="['w-2 h-2 rounded-full shrink-0', st.data.dotClass]" />
                <span class="text-xs font-bold text-slate-800">{{ st.data.label }}</span>
              </div>
              <span class="text-[10px] font-mono font-bold text-slate-400 uppercase">
                {{ st.data.stage === 'estimate' ? t('howToUse.ch6.quotation') : t('howToUse.ch6.terminal') }}
              </span>
            </button>
          </div>
        </div>

        <!-- Active Selected Status Detail Card (Simulation of OrderStatusBadge) -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 animate-fade-in">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <span class="text-xs font-mono font-bold text-slate-400 uppercase">{{ t('howToUse.ch6.selectedStatus') }}</span>
              <!-- Renders matching OrderStatusBadge look -->
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border',
                  statusBadgeClass(activeStatus.variant)
                ]"
              >
                <span :class="['w-1.5 h-1.5 rounded-full shrink-0', activeStatus.dotClass]" />
                <span>{{ activeStatus.label }}</span>
              </span>
            </div>
            <span class="text-xs font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md self-start sm:self-auto">
              {{ selectedStatusKey }}
            </span>
          </div>

          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {{ activeStatus.description }}
          </p>

          <div class="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
            <svg class="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{ t('howToUse.ch6.visibilityNote') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-3">
        <div class="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <h4 class="text-base font-bold text-slate-900">{{ t('howToUse.ch6.emailTitle') }}</h4>
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ t('howToUse.ch6.emailDesc') }}
        </p>
      </div>

      <div class="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-3">
        <div class="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
        </div>
        <h4 class="text-base font-bold text-slate-900">{{ t('howToUse.ch6.telegramTitle') }}</h4>
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ t('howToUse.ch6.telegramDesc') }}
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
import { getStatusDefinitions, type TutorialChapter } from '~/data/how-to-use.data'

const { t } = useI18n()

defineProps<{
  chapter: TutorialChapter
  prevChapter?: TutorialChapter | null
  nextChapter?: TutorialChapter | null
}>()

defineEmits<{
  (e: 'navigate', id: string): void
}>()

const selectedStatusKey = ref('IN_TRANSIT')

const normalKeys = [
  'UNDER_REVIEW',
  'REGISTERED',
  'FOREIGN_WAREHOUSE',
  'IN_TRANSIT',
  'ARRIVED',
  'READY',
  'DELIVERED'
]

const specialKeys = [
  'PENDING_ESTIMATE',
  'REJECTED',
  'CANCELLED'
]

const statusDefs = computed(() => getStatusDefinitions(t))

const normalStatuses = computed(() => {
  const defs = statusDefs.value
  return normalKeys.map((key, idx) => ({
    key,
    index: idx + 1,
    data: defs[key]
  }))
})

const specialStatuses = computed(() => {
  const defs = statusDefs.value
  return specialKeys.map(key => ({
    key,
    data: defs[key]
  }))
})

const activeStatus = computed(() => {
  const defs = statusDefs.value
  return defs[selectedStatusKey.value] || defs.IN_TRANSIT
})

const statusBadgeClass = (variant: string) => {
  switch (variant) {
    case 'warning':
      return 'bg-amber-50 text-amber-800 border-amber-200'
    case 'info':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'secondary':
      return 'bg-secondary/15 text-secondary border-secondary/30'
    case 'primary':
      return 'bg-primary/10 text-primary border-primary/20'
    case 'success':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'danger':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}
</script>
