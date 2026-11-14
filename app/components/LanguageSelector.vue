<script setup lang="ts">
import { useLanguage } from '~/composables/useLanguage'
import BaseIcon from '~/components/ui/BaseIcon.vue'

interface Props {
  isTransparent?: boolean
}

defineProps<Props>()

const { locales, currentLocale, currentLanguage, isOpen, menuRef, toggle, select } = useLanguage()
</script>

<template>
  <div class="relative inline-flex items-center" ref="menuRef">
    <!-- Trigger button -->
    <button
      @click="toggle"
      :class="[
        'group flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] rounded-full transition-all duration-300 outline-none select-none border focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer',
        isTransparent
          ? 'bg-white/80 backdrop-blur-md border-zinc-300 text-zinc-800 hover:bg-white hover:border-zinc-400 shadow-sm'
          : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50 hover:border-zinc-400 shadow-sm',
      ]"
      aria-label="Change language"
      aria-expanded="isOpen"
      aria-haspopup="listbox"
    >
      <!-- Circular Flag -->
      <span
        class="w-6 h-6 lg:w-7 lg:h-7 rounded-full overflow-hidden flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 border border-white/20"
        v-html="currentLocale.flag"
      />

      <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-800">
        {{ currentLocale.short }}
      </span>

      <!-- Chevron -->
      <span
        class="pr-1 transition-transform duration-300 text-zinc-600"
        :class="isOpen ? 'rotate-180' : ''"
      >
        <BaseIcon name="chevron_down" :size="14" />
      </span>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="scale-95 opacity-0 -translate-y-2"
      enter-to-class="scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="scale-100 opacity-100 translate-y-0"
      leave-to-class="scale-95 opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        role="listbox"
        class="absolute top-full mt-2.5 right-0 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] py-1.5 min-w-[148px] z-[100] origin-top-right"
      >
        <button
          v-for="lang in locales"
          :key="lang.code"
          role="option"
          :aria-selected="currentLanguage === lang.code"
          @click="select(lang.code)"
          class="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 text-[13px] transition-all duration-200 outline-none group/item focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
          :class="
            currentLanguage === lang.code
              ? 'bg-primary/10 text-primary font-bold'
              : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 font-medium'
          "
        >
          <div class="flex items-center gap-2.5">
            <span
              class="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-zinc-100 transition-transform duration-200 group-hover/item:scale-110"
              v-html="lang.flag"
            />
            <span class="font-medium tracking-tight">{{ lang.name }}</span>
          </div>

          <BaseIcon
            v-if="currentLanguage === lang.code"
            name="check"
            :size="13"
            class="text-primary ml-1 shrink-0"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>
