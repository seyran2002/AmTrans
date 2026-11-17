<template>
  <div
    class="group/row flex items-center justify-between gap-2 py-0.5 sm:py-1 -mx-1 sm:-mx-1.5 px-1 sm:px-1.5 rounded-xl hover:bg-slate-50/80 transition-colors"
  >
    <div class="flex items-start gap-2 sm:gap-2.5 flex-1 min-w-0">
      <div class="shrink-0 mt-0.5">
        <svg
          class="w-3.5 h-3.5 text-slate-400 group-hover/row:text-primary transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          v-html="iconSvg"
        />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
          {{ label }}
        </p>
        <p class="text-xs sm:text-sm font-medium text-slate-700 leading-snug break-words">
          <slot />
        </p>
      </div>
    </div>

    <button
      v-if="canCopy"
      type="button"
      @click="handleCopy"
      :title="isCopied ? 'Copied to clipboard!' : `Copy ${label}`"
      class="shrink-0 p-1 sm:p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
      :class="[
        isCopied
          ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
          : 'text-slate-400 hover:text-primary hover:bg-white hover:shadow-xs hover:ring-1 hover:ring-slate-200 opacity-60 group-hover/row:opacity-100 focus:opacity-100',
      ]"
    >
      <svg
        v-if="isCopied"
        class="w-3.5 h-3.5 stroke-emerald-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <svg
        v-else
        class="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      <span v-if="isCopied" class="text-[10px] font-semibold">Copied</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const ICONS: Record<string, string> = {
  id: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>`,
  location: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>`,
  globe: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/>`,
  city: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 10V11m0 0h6M11 11H5"/>`,
  province: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>`,
  phone: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>`,
  postal: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>`,
}

const props = withDefaults(
  defineProps<{
    icon: string
    label: string
    value?: string
  }>(),
  {
    value: '',
  }
)

const emit = defineEmits<{
  (e: 'copy', text: string): void
}>()

const isCopied = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const iconSvg = computed(() => ICONS[props.icon] ?? '')

const canCopy = computed(() => Boolean(props.value && props.value.trim().length > 0))

async function handleCopy() {
  if (!props.value) return

  try {
    await navigator.clipboard.writeText(props.value)
    isCopied.value = true
    emit('copy', props.value)

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      isCopied.value = false
    }, 1800)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>
