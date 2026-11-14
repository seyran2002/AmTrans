<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from '#imports'
import { useNavLinks } from '~/composables/useNavLinks'
import { useI18n } from '~/composables/useI18n'
import LanguageSelector from '~/components/LanguageSelector.vue'
import CalculatorModal from '~/components/CalculatorModal.vue'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { navLinks } = useNavLinks()
const { t } = useI18n()
const { isAuthenticated, logout } = useAuth()

const isScrolled = ref(false)
const isCalculatorOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

/**
 * Transparent header on landing/hero pages when user has not scrolled down
 */
const isTransparent = computed(() => {
  const transparentRoutes = ['/', '/home', '/about-us']
  return transparentRoutes.includes(route.path) && !isScrolled.value
})
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500">
    <!-- White background with subtle shadow on scroll (Desktop only) -->
    <div
      class="absolute inset-0 transition-all duration-500 hidden lg:block pointer-events-none"
      :class="
        isTransparent
          ? 'opacity-0 bg-transparent'
          : 'opacity-100 bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-200/60'
      "
    />

    <!-- Header Content Container -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">

        <!-- ── Logo ── -->
        <NuxtLink
          to="/"
          class="relative z-10 flex items-center shrink-0 min-h-[48px] outline-none select-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          aria-label="AmTrans Logistics Homepage"
        >
          <img src="~/assets/logo.png" fetchpriority="high" alt="AmTrans Logo" class="h-16" />
        </NuxtLink>

        <!-- ── Desktop Navigation ── -->
        <nav
          :class="[
            'hidden lg:flex items-center gap-1 rounded-full px-2 py-1.5 transition-colors duration-300',
            isTransparent
              ? 'bg-zinc-900/5 backdrop-blur-md border border-black/5'
              : 'bg-zinc-100/70'
          ]"
          role="navigation"
          aria-label="Main navigation"
        >
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="relative px-4 py-2 min-h-[44px] inline-flex items-center rounded-full text-xs xl:text-sm font-semibold tracking-wide transition-all duration-300 outline-none select-none whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary"
            :class="[
              link.isActive
                ? 'bg-white text-primary shadow-sm shadow-zinc-900/[0.04]'
                : (isTransparent ? 'text-zinc-800 hover:text-zinc-950 hover:bg-white/60' : 'text-zinc-700 hover:text-primary hover:bg-white/70')
            ]"
          >
            {{ link.label }}
            <!-- Active accent dot -->
            <span
              v-if="link.isActive"
              class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-secondary"
            />
          </NuxtLink>
        </nav>

        <!-- ── Right Actions (Calculator, Lang & Login CTA) ── -->
        <div class="relative z-10 flex items-center gap-2.5 sm:gap-3">
          <!-- Calculator Trigger Button -->
          <button
            type="button"
            @click="isCalculatorOpen = true"
            :class="[
              'group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 outline-none select-none border cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
              isTransparent
                ? 'bg-white/70 backdrop-blur-md border-zinc-200/80 text-zinc-800 hover:text-primary hover:bg-white hover:border-zinc-300 shadow-sm'
                : 'bg-white border-zinc-200 text-zinc-800 hover:text-primary hover:bg-zinc-50 hover:border-zinc-300 shadow-sm',
            ]"
            :title="t('calculator.title')"
            :aria-label="t('calculator.title')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 lg:w-[18px] lg:h-[18px] transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.5h6" />
            </svg>
          </button>

          <!-- Language Selector -->
          <LanguageSelector :is-transparent="isTransparent" />

          <!-- Log Out Button (Authenticated) — Desktop only -->
          <button
            v-if="isAuthenticated"
            type="button"
            @click="logout"
            class="hidden lg:inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full text-xs xl:text-sm font-bold tracking-wide transition-all duration-300 outline-none select-none group focus-visible:ring-2 focus-visible:ring-primary shrink-0 cursor-pointer bg-tertiary hover:bg-tertiary-dark text-white shadow-md shadow-tertiary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{{ t('nav.logout') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-200 transition-colors duration-200 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>

          <!-- Log In Button (Guest) — Desktop only -->
          <NuxtLink
            v-else
            to="/auth/login"
            class="hidden lg:inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-full text-xs xl:text-sm font-bold tracking-wide transition-all duration-300 outline-none select-none group focus-visible:ring-2 focus-visible:ring-primary shrink-0 text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 hover:scale-[1.03] active:scale-[0.98] text-white "
          >
            <span>{{ t('nav.login') }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                fill-rule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L11.23 6.09a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 11-1.04-1.08l3.158-3.16H3.75A.75.75 0 013 10z"
                clip-rule="evenodd"
              />
            </svg>
          </NuxtLink>
        </div>

      </div>
    </div>

    <!-- Shipping Cost Calculator Modal -->
    <CalculatorModal
      :is-open="isCalculatorOpen"
      @close="isCalculatorOpen = false"
    />
  </header>
</template>
