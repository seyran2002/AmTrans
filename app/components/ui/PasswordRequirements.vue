<template>
  <div class="p-4 bg-slate-50/80 rounded-2xl border border-slate-100/90 space-y-2.5">
    <div class="flex items-center justify-between">
      <span class="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
        {{ reqTitle }}
      </span>
      <span class="text-[11px] font-bold" :class="scoreColorText">
        {{ scoreText }}
      </span>
    </div>

    <!-- Password Strength Meter Bar -->
    <div class="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden flex gap-0.5 p-0.5">
      <div
        class="h-full rounded-full transition-all duration-300"
        :class="meterClass"
        :style="{ width: `${scorePercentage}%` }"
      ></div>
    </div>

    <!-- Requirements Checklist Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs pt-1">
      <!-- Min 8 chars -->
      <div class="flex items-center gap-2 transition-colors" :class="criteria.length ? 'text-emerald-700 font-semibold' : 'text-slate-400'">
        <div
          class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
          :class="criteria.length ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200/70 text-slate-400'"
        >
          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span>{{ reqLength }}</span>
      </div>

      <!-- Uppercase -->
      <div class="flex items-center gap-2 transition-colors" :class="criteria.upper ? 'text-emerald-700 font-semibold' : 'text-slate-400'">
        <div
          class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
          :class="criteria.upper ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200/70 text-slate-400'"
        >
          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span>{{ reqUpper }}</span>
      </div>

      <!-- Lowercase -->
      <div class="flex items-center gap-2 transition-colors" :class="criteria.lower ? 'text-emerald-700 font-semibold' : 'text-slate-400'">
        <div
          class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
          :class="criteria.lower ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200/70 text-slate-400'"
        >
          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span>{{ reqLower }}</span>
      </div>

      <!-- Special Char -->
      <div class="flex items-center gap-2 transition-colors" :class="criteria.special ? 'text-emerald-700 font-semibold' : 'text-slate-400'">
        <div
          class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors"
          :class="criteria.special ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200/70 text-slate-400'"
        >
          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span>{{ reqSpecial }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  criteria: {
    length: boolean
    upper: boolean
    lower: boolean
    special: boolean
  }
  reqTitle: string
  reqLength: string
  reqUpper: string
  reqLower: string
  reqSpecial: string
}>()

const score = computed(() => {
  let count = 0
  if (props.criteria.length) count++
  if (props.criteria.upper) count++
  if (props.criteria.lower) count++
  if (props.criteria.special) count++
  return count
})

const scorePercentage = computed(() => (score.value / 4) * 100)

const meterClass = computed(() => {
  if (score.value === 0) return 'bg-transparent'
  if (score.value <= 2) return 'bg-amber-400'
  if (score.value === 3) return 'bg-yellow-500'
  return 'bg-emerald-500'
})

const scoreColorText = computed(() => {
  if (score.value === 0) return 'text-slate-400'
  if (score.value <= 2) return 'text-amber-600'
  if (score.value === 3) return 'text-yellow-600'
  return 'text-emerald-600'
})

const scoreText = computed(() => {
  if (score.value === 0) return ''
  if (score.value <= 2) return 'Weak'
  if (score.value === 3) return 'Medium'
  return 'Strong'
})
</script>
