<template>
  <div
    :class="[
      'rounded-2xl border transition-all duration-200 overflow-hidden',
      containerClasses
    ]"
  >
    <button
      type="button"
      @click="isExpanded = !isExpanded"
      class="w-full flex items-center justify-between p-4 text-left gap-3 select-none cursor-pointer group"
      :aria-expanded="isExpanded"
    >
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs', badgeColor]">
          <svg v-if="type === 'important'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else-if="type === 'warning'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div class="min-w-0">
          <span :class="['text-[11px] font-bold uppercase tracking-wider block', labelColor]">
            {{ typeLabel }}
          </span>
          <span class="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors block">
            {{ title }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <span class="text-xs text-slate-400 font-medium hidden sm:inline">
          {{ isExpanded ? t('howToUse.tips.hide') : t('howToUse.tips.readMore') }}
        </span>
        <div :class="['w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 text-slate-400 group-hover:text-slate-600', isExpanded ? 'rotate-180 bg-slate-100' : '']">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </button>

    <div
      v-show="isExpanded"
      class="px-4 pb-4 pt-1 border-t border-slate-100/80 animate-fade-in"
    >
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pl-0 sm:pl-11">
        {{ content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

interface Props {
  title: string
  content: string
  type?: 'tip' | 'important' | 'warning'
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'tip',
  defaultExpanded: false
})

const { t } = useI18n()
const isExpanded = ref(props.defaultExpanded)

const typeLabel = computed(() => {
  switch (props.type) {
    case 'important':
      return t('howToUse.tips.importantRule')
    case 'warning':
      return t('howToUse.tips.noticePolicy')
    case 'tip':
    default:
      return t('howToUse.tips.proTip')
  }
})

const containerClasses = computed(() => {
  switch (props.type) {
    case 'important':
      return 'bg-amber-50/50 border-amber-200/80 hover:border-amber-300'
    case 'warning':
      return 'bg-red-50/40 border-red-200/70 hover:border-red-300'
    case 'tip':
    default:
      return 'bg-blue-50/40 border-blue-100/90 hover:border-blue-200'
  }
})

const badgeColor = computed(() => {
  switch (props.type) {
    case 'important':
      return 'bg-amber-500'
    case 'warning':
      return 'bg-tertiary'
    case 'tip':
    default:
      return 'bg-primary'
  }
})

const labelColor = computed(() => {
  switch (props.type) {
    case 'important':
      return 'text-amber-800'
    case 'warning':
      return 'text-red-700'
    case 'tip':
    default:
      return 'text-primary'
  }
})
</script>
