<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from '#imports'
import AppHeader from '~/components/AppHeader.vue'

const route = useRoute()
const isScrolled = ref(false)

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

const isTransparent = computed(() => {
  const transparentRoutes = ['/', '/en', '/ru', '/en/about-us', '/ru/about-us',  '/en/home', '/ru/home', '/home', '/about-us']
  return transparentRoutes.includes(route.path) && !isScrolled.value
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bgPrimary text-slate-800 selection:bg-secondary/20 selection:text-primary font-sans antialiased">
    <AppHeader />

    <!-- Extra bottom padding on mobile so content isn't hidden behind the tab bar -->
    <main class="flex-1">
      <slot />
    </main>

    <LazyAppFooter />

    <!-- Mobile floating tab bar — sits above everything on small screens -->
    <LazyMobileTabBar :is-transparent="isTransparent" />
  </div>
</template>
