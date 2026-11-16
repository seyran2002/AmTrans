<script setup lang="ts">
import { useNavLinks } from '~/composables/useNavLinks'
import BaseIcon from '~/components/ui/BaseIcon.vue'

interface Props {
  isTransparent?: boolean
}

defineProps<Props>()

const { allLinks } = useNavLinks()
</script>

<template>
  <!-- Mobile Bottom Floating Tab Bar — hidden on lg+ screens -->
  <div
    class="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-2 sm:px-4 pb-[max(env(safe-area-inset-bottom,8px),8px)] pt-1.5 pointer-events-none"
  >
    <nav
      :class="[
        'pointer-events-auto mx-auto w-full max-w-[460px] rounded-2xl px-1.5 py-1 sm:py-1.5 flex items-center justify-between transition-all duration-500',
        isTransparent
          ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-none'
          : 'bg-white/90 backdrop-blur-2xl border border-zinc-200/50 shadow-[0_-4px_30px_rgba(0,0,0,0.07)]',
      ]"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <NuxtLink
        v-for="link in allLinks"
        :key="link.to"
        :to="link.to"
        :aria-label="link.ariaLabel"
        :active-class="isTransparent ? 'text-white' : 'text-primary'"
        :class="[
          'relative flex-1 min-w-0 min-h-[48px] flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-300 outline-none select-none active:scale-90 focus-visible:ring-2 focus-visible:ring-primary',
          isTransparent ? 'text-slate-100' : 'text-zinc-700',
        ]"
        v-slot="{ isActive }"
      >
        <!-- Icon -->
        <div class="relative flex items-center justify-center h-5 mb-0.5">
          <BaseIcon
            :name="link.icon"
            :size="19"
            custom-class="transition-all duration-300"
          />
        </div>

        <!-- Label -->
        <span
          class="text-[9px] sm:text-[10px] leading-tight font-semibold transition-colors duration-300 truncate max-w-full block w-full text-center px-0.5"
        >
          {{ link.label }}
        </span>

        <!-- Active indicator bar -->
        <span
          class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full transition-all duration-300 ease-out"
          :class="[
            isActive ? 'w-4 opacity-100' : 'w-0 opacity-0',
            isTransparent ? 'bg-white' : 'bg-secondary',
          ]"
        />
      </NuxtLink>
    </nav>
  </div>
</template>
