<script setup lang="ts">
import { computed } from 'vue'
import { useHead, navigateTo } from '#imports'
import { useI18n } from '~/composables/useI18n'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'guest' })

const { t } = useI18n()
const { isAuthenticated } = useAuth()
const localePath = useLocalePath()

useHead({
  title: computed(() => t('privacy.metaTitle')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('privacy.metaDescription')),
    },
    {
      property: 'og:title',
      content: computed(() => t('privacy.metaTitle')),
    },
    {
      property: 'og:description',
      content: computed(() => t('privacy.metaDescription')),
    },
  ],
})

const sections = computed(() => [
  { id: 'section-1', title: t('privacy.section1.nav') },
  { id: 'section-2', title: t('privacy.section2.nav') },
  { id: 'section-3', title: t('privacy.section3.nav') },
  { id: 'section-4', title: t('privacy.section4.nav') },
  { id: 'section-5', title: t('privacy.section5.nav') },
  { id: 'section-6', title: t('privacy.section6.nav') },
  { id: 'section-7', title: t('privacy.section7.nav') },
])

function handleOpenChat() {
  if (isAuthenticated.value) {
    navigateTo(localePath('/dashboard/support-chat'))
  } else {
    navigateTo(localePath('/contact-us'))
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/60 pb-20 pt-6 sm:pt-10">
    <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <!-- ── Breadcrumb ── -->
      <nav class="mb-6 flex items-center gap-2 text-xs text-slate-500 font-medium">
        <NuxtLink :to="localePath('/')" class="hover:text-primary transition-colors flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </NuxtLink>
        <span>/</span>
        <span class="text-slate-800 font-semibold">{{ t('privacy.title') }}</span>
      </nav>

      <!-- ── Header Section ── -->
      <header class="mb-10 text-left">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-wide uppercase mb-4">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {{ t('privacy.badge') }}
        </div>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          {{ t('privacy.title') }}
        </h1>

        <!-- Effective Date Banner -->
        <div class="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 mb-6">
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs font-semibold text-slate-700">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ t('privacy.effectiveDate') }}
          </div>
          <span class="text-slate-400">•</span>
          <span class="text-slate-500 font-medium">{{ t('privacy.lastUpdated') }}</span>
        </div>

        <!-- Intro Commitment Card -->
        <div class="rounded-3xl bg-gradient-to-br from-primary/5 via-white to-slate-50 border border-primary/15 p-6 sm:p-8 shadow-xs">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/20 mt-0.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p class="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {{ t('privacy.intro') }}
            </p>
          </div>
        </div>
      </header>

      <!-- ── Table of Contents (Quick Jump Navigation) ── -->
      <section class="mb-12 rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs" aria-label="Table of Contents">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          {{ t('privacy.tocTitle') }}
        </h2>
        <div class="flex flex-wrap gap-2">
          <a
            v-for="item in sections"
            :key="item.id"
            :href="`#${item.id}`"
            class="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-primary/10 hover:text-primary text-slate-600 text-xs font-semibold border border-slate-200/80 hover:border-primary/20 transition-all duration-150 cursor-pointer"
          >
            {{ item.title }}
          </a>
        </div>
      </section>

      <!-- ── Privacy Policy Body Sections ── -->
      <div class="space-y-10 text-slate-800">

        <!-- ── Section 1: Information We Collect ── -->
        <section id="section-1" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center border border-primary/20">
              {{ t('privacy.section1.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {{ t('privacy.section1.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {{ t('privacy.section1.subtitle') }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Item 1: Personal ID -->
            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <div class="flex items-center gap-2.5 mb-2 text-primary font-bold text-sm">
                <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 text-sm">{{ t('privacy.section1.personalIdTitle') }}</h3>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ t('privacy.section1.personalIdDesc') }}
              </p>
            </div>

            <!-- Item 2: Contact Info -->
            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <div class="flex items-center gap-2.5 mb-2 text-primary font-bold text-sm">
                <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 text-sm">{{ t('privacy.section1.contactTitle') }}</h3>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ t('privacy.section1.contactDesc') }}
              </p>
            </div>

            <!-- Item 3: Cargo Details -->
            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <div class="flex items-center gap-2.5 mb-2 text-primary font-bold text-sm">
                <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 text-sm">{{ t('privacy.section1.cargoTitle') }}</h3>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ t('privacy.section1.cargoDesc') }}
              </p>
            </div>

            <!-- Item 4: Customer Support -->
            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <div class="flex items-center gap-2.5 mb-2 text-primary font-bold text-sm">
                <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 text-sm">{{ t('privacy.section1.supportTitle') }}</h3>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ t('privacy.section1.supportDesc') }}
              </p>
            </div>

            <!-- Item 5: Technical Data (Full Width) -->
            <div class="md:col-span-2 rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <div class="flex items-center gap-2.5 mb-2 text-primary font-bold text-sm">
                <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="font-bold text-slate-900 text-sm">{{ t('privacy.section1.technicalTitle') }}</h3>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ t('privacy.section1.technicalDesc') }}
              </p>
            </div>
          </div>
        </section>

        <!-- ── Section 2: How We Use Your Information ── -->
        <section id="section-2" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center border border-primary/20">
              {{ t('privacy.section2.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {{ t('privacy.section2.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {{ t('privacy.section2.subtitle') }}
          </p>

          <div class="space-y-3.5">
            <div class="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div class="w-6 h-6 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 mb-0.5">{{ t('privacy.section2.purpose1Title') }}</h3>
                <p class="text-xs text-slate-600 leading-relaxed">{{ t('privacy.section2.purpose1Desc') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div class="w-6 h-6 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 mb-0.5">{{ t('privacy.section2.purpose2Title') }}</h3>
                <p class="text-xs text-slate-600 leading-relaxed">{{ t('privacy.section2.purpose2Desc') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div class="w-6 h-6 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 mb-0.5">{{ t('privacy.section2.purpose3Title') }}</h3>
                <p class="text-xs text-slate-600 leading-relaxed">{{ t('privacy.section2.purpose3Desc') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div class="w-6 h-6 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 mb-0.5">{{ t('privacy.section2.purpose4Title') }}</h3>
                <p class="text-xs text-slate-600 leading-relaxed">{{ t('privacy.section2.purpose4Desc') }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Section 3: Data Sharing & Third Parties ── -->
        <section id="section-3" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center border border-primary/20">
              {{ t('privacy.section3.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {{ t('privacy.section3.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {{ t('privacy.section3.subtitle') }}
          </p>

          <!-- Explicit "We Do NOT Sell Data" Banner -->
          <div class="rounded-2xl bg-emerald-50 border border-emerald-200/80 p-4 sm:p-5 mb-6 flex items-start gap-3.5 text-emerald-950">
            <div class="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm font-bold text-emerald-900 leading-relaxed">
                {{ t('privacy.section3.noSaleNotice') }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <h3 class="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-primary" />
                {{ t('privacy.section3.customsTitle') }}
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ t('privacy.section3.customsDesc') }}
              </p>
            </div>

            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <h3 class="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-primary" />
                {{ t('privacy.section3.logisticsTitle') }}
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ t('privacy.section3.logisticsDesc') }}
              </p>
            </div>

            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <h3 class="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-primary" />
                {{ t('privacy.section3.legalTitle') }}
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ t('privacy.section3.legalDesc') }}
              </p>
            </div>
          </div>
        </section>

        <!-- ── Section 4: Data Security & Retention ── -->
        <section id="section-4" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center border border-primary/20">
              {{ t('privacy.section4.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {{ t('privacy.section4.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {{ t('privacy.section4.subtitle') }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-5">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 text-sm sm:text-base mb-2">
                {{ t('privacy.section4.securityTitle') }}
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ t('privacy.section4.securityDesc') }}
              </p>
            </div>

            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-5">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 text-sm sm:text-base mb-2">
                {{ t('privacy.section4.retentionTitle') }}
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                {{ t('privacy.section4.retentionDesc') }}
              </p>
            </div>
          </div>
        </section>

        <!-- ── Section 5: User Rights ── -->
        <section id="section-5" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center border border-primary/20">
              {{ t('privacy.section5.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {{ t('privacy.section5.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {{ t('privacy.section5.subtitle') }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 text-sm mb-1">{{ t('privacy.section5.right1Title') }}</h3>
              <p class="text-xs text-slate-600 leading-relaxed">{{ t('privacy.section5.right1Desc') }}</p>
            </div>

            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <div class="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 text-sm mb-1">{{ t('privacy.section5.right2Title') }}</h3>
              <p class="text-xs text-slate-600 leading-relaxed">{{ t('privacy.section5.right2Desc') }}</p>
            </div>

            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4.5">
              <div class="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mb-2.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 text-sm mb-1">{{ t('privacy.section5.right3Title') }}</h3>
              <p class="text-xs text-slate-600 leading-relaxed">{{ t('privacy.section5.right3Desc') }}</p>
            </div>
          </div>
        </section>

        <!-- ── Section 6: Updates to Policy ── -->
        <section id="section-6" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center border border-primary/20">
              {{ t('privacy.section6.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {{ t('privacy.section6.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">
            {{ t('privacy.section6.subtitle') }}
          </p>

          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {{ t('privacy.section6.desc') }}
          </p>
        </section>

        <!-- ── Section 7: Contact Us & Live Support Chat ── -->
        <section id="section-7" class="scroll-mt-24 rounded-3xl bg-gradient-to-br from-primary via-[#002f80] to-primary-dark text-white p-6 sm:p-8 shadow-lg shadow-primary/20">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-white/15 text-white font-mono font-bold text-xs flex items-center justify-center border border-white/20">
              {{ t('privacy.section7.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {{ t('privacy.section7.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-200 mb-6 leading-relaxed">
            {{ t('privacy.section7.desc') }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Email Box -->
            <div class="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-xs flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                  {{ t('privacy.section7.emailTitle') }}
                </span>
                <a
                  href="mailto:amtransaircargo@gmail.com"
                  class="text-base sm:text-lg font-bold text-white hover:text-secondary transition-colors inline-flex items-center gap-2 group"
                >
                  <span>amtransaircargo@gmail.com</span>
                  <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
              <p class="text-xs text-slate-200/80 mt-3">
                {{ t('privacy.section7.hoursDesc') }}
              </p>
            </div>

            <!-- Live Chat Box -->
            <div class="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-xs flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                  {{ t('privacy.section7.chatTitle') }}
                </span>
                <p class="text-xs text-slate-200/90 leading-relaxed mb-4">
                  {{ t('privacy.section7.chatDesc') }}
                </p>
              </div>
              <button
                type="button"
                @click="handleOpenChat"
                class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-xs sm:text-sm font-bold shadow-md shadow-secondary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{{ t('privacy.section7.openChat') }}</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

