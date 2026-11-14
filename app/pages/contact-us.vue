<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '#imports'
import { useI18n } from '~/composables/useI18n'
import ContactHero from '~/components/contact/ContactHero.vue'

definePageMeta({ layout: 'guest' })

const { t } = useI18n()

useHead({
  title: computed(() => t('contact.metaTitle')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('contact.metaDescription')),
    },
    {
      property: 'og:title',
      content: computed(() => t('contact.metaTitle')),
    },
    {
      property: 'og:description',
      content: computed(() => t('contact.metaDescription')),
    },
  ],
})
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
