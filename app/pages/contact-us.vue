<script setup lang="ts">
import { definePageMeta } from '#imports'
import ContactHero from '~/components/contact/ContactHero.vue'
import { useContactSeo } from '~/composables/useContactSeo'

definePageMeta({ layout: 'guest' })

// ─── Dedicated Contact Us Page SEO Composable (100% SSR Reactive computed() refs) ─
useContactSeo()
</script>

<template>
  <div class="w-full bg-bgPrimary min-h-screen">
    <!-- ── 1. Hero Section ── -->
    <ContactHero />

    <!-- ── 2. Contact Information Cards (negative-margin overlap) ── -->
    <section
      class="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Contact Information"
    >
      <LazyContactInfoCards />
    </section>

    <!-- ── 3. Main Form & Assistance Showcase ── -->
    <LazyContactFormSection />

    <!-- ── 4. Interactive Branch Offices Directory ── -->
    <LazyContactOfficesSection />

    <!-- ── 5. Frequently Asked Questions ── -->
    <LazyContactFaqSection />
  </div>
</template>
