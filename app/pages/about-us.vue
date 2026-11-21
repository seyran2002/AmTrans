<script setup lang="ts">
import { definePageMeta } from '#imports'
import AboutHero from '~/components/about/AboutHero.vue'
import { useAboutSeo } from '~/composables/useAboutSeo'

definePageMeta({ layout: 'guest' })

// ─── Dedicated About Us Page SEO Composable (100% SSR Reactive computed() refs) ─
useAboutSeo()
</script>

<template>
  <div class="w-full min-h-screen bg-bgPrimary">
    <!-- 1. Hero Section -->
    <AboutHero />

    <!-- 2. Our Mission Section -->
    <LazyAboutMissionSection />

    <!-- 3. How It Works Section -->
    <LazyAboutHowItWorksSection />

    <!-- 4. Why Choose Us Section -->
    <LazyAboutWhyUsSection />

    <!-- 5. Our Commitment Section -->
    <LazyAboutCommitmentSection />
  </div>
</template>
