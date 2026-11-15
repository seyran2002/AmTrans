<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

const openFaqIndex = ref<number | null>(0)

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

const faqs = [
  { qKey: 'contact.faq.q1', aKey: 'contact.faq.a1' },
  { qKey: 'contact.faq.q2', aKey: 'contact.faq.a2' },
  { qKey: 'contact.faq.q3', aKey: 'contact.faq.a3' },
  { qKey: 'contact.faq.q4', aKey: 'contact.faq.a4' },
]
</script>

<template>
  <section class="w-full py-16 sm:py-20 border-t border-slate-200/60" aria-label="Frequently Asked Questions">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-10 sm:mb-12">
        <div
          class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-600/30 text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-3"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-secondary" />
          {{ t('contact.faq.badge') }}
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {{ t('contact.faq.title') }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
          {{ t('contact.faq.subtitle') }}
        </p>
      </div>

      <!-- FAQ Accordion List -->
      <div class="space-y-3.5">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="rounded-2xl bg-white border border-slate-200/80 transition-all duration-200 overflow-hidden shadow-xs hover:border-slate-300"
          :class="{ 'ring-2 ring-primary/10 border-primary/30': openFaqIndex === index }"
        >
          <button
            :id="`faq-btn-${index}`"
            type="button"
            @click="toggleFaq(index)"
            class="w-full min-h-[56px] px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            :aria-expanded="openFaqIndex === index"
            :aria-controls="`faq-content-${index}`"
          >
            <span class="text-sm sm:text-base font-bold text-slate-900">
              {{ t(faq.qKey) }}
            </span>
            <span
              class="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200"
              :class="{ 'rotate-180 bg-primary/10 text-primary': openFaqIndex === index }"
              aria-hidden="true"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <!-- Answer Body -->
          <div
            v-if="openFaqIndex === index"
            :id="`faq-content-${index}`"
            role="region"
            :aria-labelledby="`faq-btn-${index}`"
            class="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-fade-in"
          >
            <p>{{ t(faq.aKey) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
