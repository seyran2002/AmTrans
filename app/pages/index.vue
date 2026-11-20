<script setup lang="ts">
import { definePageMeta } from '#imports'
import HomeHero from '~/components/home/HomeHero.vue'
import { useHomeSeo } from '~/composables/useHomeSeo'

definePageMeta({ layout: 'guest' })

// ─── Dedicated Home Page SEO Composable (100% SSR Reactive computed() refs) ─
useHomeSeo()
</script>

<template>
  <div class="w-full min-h-screen bg-bgPrimary">
    <!-- 1. Hero Section -->
    <HomeHero />

    <!-- 2. Shipping Tariffs Section -->
    <LazyHomeShippingTariffs />

    <!-- 3. Why Choose AmTrans Section -->
    <LazyHomeWhyChooseUs />

    <!-- 4. How It Works Section -->
    <LazyHomeHowItWorks />

    <!-- 5. Frequently Asked Questions Section -->
    <LazyHomeFaq />

    <!-- 6. Final Call to Action Section -->
    <LazyHomeCallToAction />
  </div>
</template>
