<template>
  <button
    type="button"
    :id="`country-tab-${country.id}`"
    :aria-pressed="isActive"
    @click="$emit('select', country.id)"
    :class="[
      'group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary/30 shrink-0',
      isActive
        ? 'bg-primary text-white shadow-md shadow-primary/25 -translate-y-0.5'
        : 'bg-white text-slate-700 border border-slate-200 hover:border-primary/30 hover:text-primary hover:bg-primary/5 hover:shadow-sm'
    ]"
  >
    <!-- Country icon / flag -->
    <span class="shrink-0">
      <img
        v-if="(country.icon || country.flag) && !imgError"
        :src="country.icon || country.flag || ''"
        :alt="displayName"
        class="w-5 h-5 rounded-full object-cover"
        @error="onImgError"
      />
      <!-- Fallback globe icon -->
      <svg
        v-else
        class="w-4 h-4 shrink-0"
        :class="isActive ? 'text-white/80' : 'text-slate-400 group-hover:text-primary/60'"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    </span>

    <span class="leading-none">{{ displayName }}</span>

    <!-- Active indicator dot -->
    <span
      v-if="isActive"
      class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-white shadow-sm"
    />
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CountryWithOffices } from '~/types/office'
import type { SupportedLanguage } from '~/composables/useI18n'

const props = defineProps<{
  country: CountryWithOffices
  isActive: boolean
  lang: SupportedLanguage
}>()

defineEmits<{ (e: 'select', id: string): void }>()

const imgError = ref(false)
const onImgError = () => { imgError.value = true }

const displayName = computed<string>(() => {
  const langKey = `${props.lang}Name` as keyof CountryWithOffices
  return (props.country[langKey] as string) || props.country.enName || props.country.hyName || props.country.ruName || ''
})
</script>
