<script setup lang="ts">
import ContactForm from '~/components/contact/ContactForm.vue'
import ContactAssistanceCards from '~/components/contact/ContactAssistanceCards.vue'
</script>

<template>
  <section
    id="contact-form"
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-10 scroll-mt-20"
    aria-label="Contact Form and Assistance"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      <!-- Contact Form (7 cols on desktop) -->
      <div class="lg:col-span-7">
        <ContactForm />
      </div>

      <!-- Right Side: Service Highlights & Guarantee Card (5 cols on desktop) -->
      <div class="lg:col-span-5">
        <ContactAssistanceCards />
      </div>
    </div>
  </section>
</template>

