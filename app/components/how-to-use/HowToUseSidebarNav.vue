<template>
  <aside class="w-full">
    <div class="space-y-4">
      <!-- Main Navigation Card -->
      <div class="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs">
        <!-- Header & Progress -->
        <div class="pb-4 border-b border-slate-100">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              {{ t('howToUse.nav.tutorialChapters') }}
            </span>
            <span class="text-xs font-bold text-primary font-mono">
              {{ readingProgress }}%
            </span>
          </div>

          <!-- Progress Bar Track -->
          <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
              :style="{ width: `${readingProgress}%` }"
            />
          </div>
        </div>

        <!-- Chapters List -->
        <nav class="pt-3 space-y-1" aria-label="Tutorial Chapters">
          <button
            v-for="chapter in chapters"
            :key="chapter.id"
            type="button"
            @click="$emit('selectChapter', chapter.id)"
            :class="[
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-200 group cursor-pointer',
              activeChapterId === chapter.id
                ? 'bg-primary/10 text-primary font-bold shadow-2xs border border-primary/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
            ]"
          >
            <!-- Chapter Number Pill -->
            <span
              :class="[
                'w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors',
                activeChapterId === chapter.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
              ]"
            >
              {{ chapter.number }}
            </span>

            <!-- Title -->
            <span class="text-xs sm:text-sm truncate">
              {{ chapter.shortTitle }}
            </span>

            <!-- Active Indicator Pill -->
            <span
              v-if="activeChapterId === chapter.id"
              class="w-1.5 h-1.5 rounded-full bg-secondary ml-auto shrink-0 animate-pulse"
            />
          </button>
        </nav>
      </div>

      <!-- Quick Assistance Card -->
      <div class="rounded-3xl bg-gradient-to-br from-slate-900 via-primary-dark to-primary text-white p-5 shadow-md shadow-primary/20 relative overflow-hidden">
        <div class="relative z-10 space-y-3">
          <div class="w-9 h-9 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/20">
            <svg class="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-bold tracking-tight">{{ t('howToUse.nav.helpTitle') }}</h4>
            <p class="text-xs text-white/80 leading-relaxed mt-1">
              {{ t('howToUse.nav.helpDesc') }}
            </p>
          </div>

          <NuxtLink
            to="/contact-us"
            class="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-white transition-colors group/link pt-1"
          >
            <span>{{ t('howToUse.nav.helpLink') }}</span>
            <svg class="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import type { TutorialChapter } from '~/data/how-to-use.data'

const { t } = useI18n()

defineProps<{
  chapters: TutorialChapter[]
  activeChapterId: string
  readingProgress: number
}>()

defineEmits<{
  (e: 'selectChapter', id: string): void
}>()
</script>
