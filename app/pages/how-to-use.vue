<template>
  <div class="min-h-screen bg-slate-50/60 pb-12 sm:pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- ── Hero Section ──────────────────────────────────────────────── -->
      <HowToUseHero @start-learning="scrollToChapter('chapter-01')" />

      <!-- ── Mobile Sticky Chapter Navigation ─────────────────────────── -->
      <HowToUseMobileNav
        :chapters="chapters"
        :active-chapter-id="activeChapterId"
        :reading-progress="readingProgress"
        @select-chapter="scrollToChapter"
      />

      <!-- ── Main Grid Layout: Tutorial Content + Desktop Sticky Sidebar ─ -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <!-- Main Tutorial Chapters (Left / Center) -->
        <main class="lg:col-span-8 xl:col-span-9 space-y-6 sm:space-y-12 lg:space-y-16">
          <!-- Chapter 01: Getting Started -->
          <ChapterGettingStarted
            :chapter="chapters[0]"
            :next-chapter="chapters[1]"
            @navigate="scrollToChapter"
          />

          <!-- Chapter 02: Account Setup -->
          <ChapterAccountSetup
            :chapter="chapters[1]!"
            :prev-chapter="chapters[0]"
            :next-chapter="chapters[2]"
            @navigate="scrollToChapter"
          />

          <!-- Chapter 03: Addresses & Receivers -->
          <ChapterAddressesReceivers
            :chapter="chapters[2]!"
            :prev-chapter="chapters[1]"
            :next-chapter="chapters[3]"
            @navigate="scrollToChapter"
          />

          <!-- Chapter 04: Register a Shipment -->
          <ChapterRegisterShipment
            :chapter="chapters[3]!"
            :prev-chapter="chapters[2]"
            :next-chapter="chapters[4]"
            @navigate="scrollToChapter"
          />

          <!-- Chapter 05: Shipping Costs & Tariffs -->
          <ChapterShippingCosts
            :chapter="chapters[4]!"
            :prev-chapter="chapters[3]"
            :next-chapter="chapters[5]"
            @navigate="scrollToChapter"
          />

          <!-- Chapter 06: Track Your Shipment -->
          <ChapterTrackShipment
            :chapter="chapters[5]!"
            :prev-chapter="chapters[4]"
            :next-chapter="chapters[6]"
            @navigate="scrollToChapter"
          />

          <!-- Chapter 07: Receive Your Package -->
          <ChapterReceivePackage
            :chapter="chapters[6]!"
            :prev-chapter="chapters[5]"
            @navigate="scrollToChapter"
          />
        </main>

        <!-- Desktop Sticky Chapter Sidebar (Right) -->
        <div class="hidden lg:block lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 lg:self-start lg:z-20">
          <HowToUseSidebarNav
            :chapters="chapters"
            :active-chapter-id="activeChapterId"
            :reading-progress="readingProgress"
            @select-chapter="scrollToChapter"
          />
        </div>
      </div>
    </div>

    <!-- ── Floating Back to Top Button ──────────────────────────────────── -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform opacity-0 translate-y-3 scale-95"
      enter-to-class="transform opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform opacity-100 translate-y-0 scale-100"
      leave-to-class="transform opacity-0 translate-y-3 scale-95"
    >
      <button
        v-if="showBackToTop"
        type="button"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-primary shadow-xl border border-slate-200/90 transition-all duration-200 active:scale-95 flex items-center gap-2 group cursor-pointer"
        aria-label="Back to Top"
      >
        <svg class="w-4 h-4 text-slate-400 group-hover:text-primary transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span class="text-xs font-bold hidden sm:inline">{{ t('howToUse.backToTop') }}</span>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { definePageMeta } from '#imports'
import { useI18n } from '~/composables/useI18n'
import { useHowToUseSeo } from '~/composables/useHowToUseSeo'
import { getTutorialChapters } from '~/data/how-to-use.data'
import HowToUseHero from '~/components/how-to-use/HowToUseHero.vue'
import HowToUseSidebarNav from '~/components/how-to-use/HowToUseSidebarNav.vue'
import HowToUseMobileNav from '~/components/how-to-use/HowToUseMobileNav.vue'
import ChapterGettingStarted from '~/components/how-to-use/chapters/ChapterGettingStarted.vue'
import ChapterAccountSetup from '~/components/how-to-use/chapters/ChapterAccountSetup.vue'
import ChapterAddressesReceivers from '~/components/how-to-use/chapters/ChapterAddressesReceivers.vue'
import ChapterRegisterShipment from '~/components/how-to-use/chapters/ChapterRegisterShipment.vue'
import ChapterShippingCosts from '~/components/how-to-use/chapters/ChapterShippingCosts.vue'
import ChapterTrackShipment from '~/components/how-to-use/chapters/ChapterTrackShipment.vue'
import ChapterReceivePackage from '~/components/how-to-use/chapters/ChapterReceivePackage.vue'

definePageMeta({ layout: 'guest' })

// ─── Dedicated How To Use Page SEO Composable (100% SSR Reactive computed() refs) ─
useHowToUseSeo()

const { t } = useI18n()
const chapters = computed(() => getTutorialChapters(t))

// Active chapter and scroll progress
const activeChapterId = ref<string>('chapter-01')
const readingProgress = ref<number>(0)
const showBackToTop = ref<boolean>(false)

let observer: IntersectionObserver | null = null

const handleScroll = () => {
  if (typeof window === 'undefined') return

  // Reading progress calculation
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight
  if (totalScroll > 0) {
    const current = window.scrollY
    readingProgress.value = Math.min(100, Math.max(0, Math.round((current / totalScroll) * 100)))
  }

  showBackToTop.value = window.scrollY > 400
}

const scrollToChapter = (id: string) => {
  activeChapterId.value = id
  const target = document.getElementById(id)
  if (target) {
    const navOffset = 90
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = target.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - navOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  // IntersectionObserver to set active chapter
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeChapterId.value = entry.target.id
        }
      })
    },
    {
      rootMargin: '-15% 0px -65% 0px',
      threshold: 0
    }
  )

  chapters.value.forEach((ch) => {
    const el = document.getElementById(ch.id)
    if (el && observer) {
      observer.observe(el)
    }
  })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
  if (observer) {
    observer.disconnect()
  }
})
</script>
