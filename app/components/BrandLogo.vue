<script setup lang="ts">
interface Props {
  isTransparent?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="inline-flex items-center gap-2.5 sm:gap-3 select-none">
    <!-- Icon Mark -->
    <div
      class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#243E75] via-primary to-[#8A1115] flex items-center justify-center shadow-lg shadow-primary/20 p-2 transform transition-transform hover:scale-105 duration-300 border border-white/20 shrink-0"
    >
      <svg
        class="w-full h-full text-secondary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </div>

    <!-- Text Mark -->
    <div class="flex flex-col">
      <div class="text-2xl sm:text-3xl font-black tracking-tight flex items-baseline leading-none">
        <span class="text-primary drop-shadow-sm transition-colors duration-300">Am</span>
        <span class="text-tertiary drop-shadow-sm transition-colors duration-300">Trans</span>
        <span class="w-2 h-2 rounded-full bg-secondary ml-1 animate-pulse" />
      </div>
      <span class="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-slate-500 transition-colors duration-300">
        Logistics & Express
      </span>
    </div>
  </div>
</template>
