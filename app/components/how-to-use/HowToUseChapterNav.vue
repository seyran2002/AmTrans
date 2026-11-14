<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-slate-100">
    <!-- Previous Chapter -->
    <button
      v-if="prevChapter"
      type="button"
      @click="$emit('navigate', prevChapter.id)"
      class="flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-2xl border border-slate-200/80 bg-white hover:border-primary/30 hover:bg-slate-50 transition-all group text-left w-full sm:max-w-[48%] active:scale-[0.98]"
    >
      <div class="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-primary group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <div class="min-w-0">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          {{ t('howToUse.nav.previousChapter') }}
        </span>
        <span class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors truncate block">
          {{ prevChapter.number }}. {{ prevChapter.shortTitle }}
        </span>
      </div>
    </button>
    <div v-else class="hidden sm:block flex-1" />

    <!-- Next Chapter -->
    <button
      v-if="nextChapter"
      type="button"
      @click="$emit('navigate', nextChapter.id)"
      class="flex items-center justify-end gap-3 p-3 sm:px-4 sm:py-3 rounded-2xl border border-slate-200/80 bg-white hover:border-primary/30 hover:bg-slate-50 transition-all group text-right w-full sm:max-w-[48%] sm:ml-auto active:scale-[0.98]"
    >
      <div class="min-w-0">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          {{ t('howToUse.nav.nextChapter') }}
        </span>
        <span class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors truncate block">
          {{ nextChapter.number }}. {{ nextChapter.shortTitle }}
        </span>
      </div>
      <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import type { TutorialChapter } from '~/data/how-to-use.data'

const { t } = useI18n()

defineProps<{
  prevChapter?: TutorialChapter | null
  nextChapter?: TutorialChapter | null
}>()

defineEmits<{
  (e: 'navigate', id: string): void
}>()
</script>
