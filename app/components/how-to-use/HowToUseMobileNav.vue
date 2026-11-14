<template>
  <div class="lg:hidden sticky top-16 z-30 mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 py-2.5 bg-white/95 backdrop-blur-md border-y border-slate-200/80 shadow-xs">
    <div class="flex items-center justify-between gap-3">
      <!-- Chapter Jump Button -->
      <button
        type="button"
        @click="isOpen = !isOpen"
        class="flex-1 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-left cursor-pointer active:scale-[0.99] transition-all"
        :aria-expanded="isOpen"
      >
        <div class="flex items-center gap-2 min-w-0">
          <span class="w-6 h-6 rounded-lg bg-primary text-white text-[11px] font-bold font-mono flex items-center justify-center shrink-0">
            {{ currentChapter?.number || '01' }}
          </span>
          <span class="text-xs font-bold text-slate-800 truncate">
            {{ currentChapter?.shortTitle || t('howToUse.nav.selectChapter') }}
          </span>
        </div>

        <svg
          :class="['w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0', isOpen ? 'rotate-180' : '']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Progress Pill -->
      <div class="px-2.5 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-bold shrink-0">
        {{ readingProgress }}%
      </div>
    </div>

    <!-- Mobile Dropdown Chapter Menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform opacity-0 -translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="mt-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xl max-h-80 overflow-y-auto space-y-1"
      >
        <button
          v-for="ch in chapters"
          :key="ch.id"
          type="button"
          @click="selectChapter(ch.id)"
          :class="[
            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer min-h-[44px]',
            activeChapterId === ch.id
              ? 'bg-primary/10 text-primary font-bold'
              : 'text-slate-600 hover:bg-slate-50 font-medium'
          ]"
        >
          <span
            :class="[
              'w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center shrink-0',
              activeChapterId === ch.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
            ]"
          >
            {{ ch.number }}
          </span>
          <span class="truncate">{{ ch.title }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import type { TutorialChapter } from '~/data/how-to-use.data'

const props = defineProps<{
  chapters: TutorialChapter[]
  activeChapterId: string
  readingProgress: number
}>()

const emit = defineEmits<{
  (e: 'selectChapter', id: string): void
}>()

const { t } = useI18n()
const isOpen = ref(false)

const currentChapter = computed(() => {
  return props.chapters.find(c => c.id === props.activeChapterId) || props.chapters[0]
})

const selectChapter = (id: string) => {
  isOpen.value = false
  emit('selectChapter', id)
}
</script>
