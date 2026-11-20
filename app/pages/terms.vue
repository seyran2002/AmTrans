<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead, navigateTo } from '#imports'
import { useI18n } from '~/composables/useI18n'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'guest' })

const { t } = useI18n()
const { isAuthenticated } = useAuth()
const localePath = useLocalePath()

useHead({
  title: computed(() => t('terms.metaTitle')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('terms.metaDescription')),
    },
    {
      property: 'og:title',
      content: computed(() => t('terms.metaTitle')),
    },
    {
      property: 'og:description',
      content: computed(() => t('terms.metaDescription')),
    },
  ],
})

// ── Direct Navigation Sections ─────────────────────────────────────────
const sections = computed(() => [
  { id: 'section-1', title: t('terms.section1.nav') },
  { id: 'section-2', title: t('terms.section2.nav') },
  { id: 'section-3', title: t('terms.section3.nav') },
  { id: 'section-4', title: t('terms.section4.nav') },
  { id: 'section-5', title: t('terms.section5.nav') },
  { id: 'section-6', title: t('terms.section6.nav') },
  { id: 'section-7', title: t('terms.section7.nav') },
])

// ── Interactive Accordion State for Cargo Categories ───────────────────
const expandedCategories = ref<Set<string>>(new Set([
  'uae-1', 'uae-2', 'uae-3', 'uae-4', 'uae-5', 'uae-6',
  'eaeu-1', 'eaeu-2', 'eaeu-3', 'eaeu-4', 'eaeu-5', 'eaeu-6', 'eaeu-7', 'eaeu-8', 'eaeu-9',
  'res-1', 'res-2', 'res-3', 'res-4',
]))

function toggleCategory(id: string) {
  if (expandedCategories.value.has(id)) {
    expandedCategories.value.delete(id)
  } else {
    expandedCategories.value.add(id)
  }
}

function expandAll() {
  const allIds = [
    'uae-1', 'uae-2', 'uae-3', 'uae-4', 'uae-5', 'uae-6',
    'eaeu-1', 'eaeu-2', 'eaeu-3', 'eaeu-4', 'eaeu-5', 'eaeu-6', 'eaeu-7', 'eaeu-8', 'eaeu-9',
    'res-1', 'res-2', 'res-3', 'res-4',
  ]
  expandedCategories.value = new Set(allIds)
}

function collapseAll() {
  expandedCategories.value.clear()
}

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
    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6">

      <!-- ── Breadcrumbs ── -->
      <nav class="mb-6 flex items-center gap-2 text-xs text-slate-500 font-medium">
        <NuxtLink :to="localePath('/')" class="hover:text-primary transition-colors flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </NuxtLink>
        <span>/</span>
        <span class="text-slate-800 font-semibold">{{ t('terms.title') }}</span>
      </nav>

      <!-- ── Header Section ── -->
      <header class="mb-10 text-left">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-wide uppercase mb-4">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ t('terms.badge') }}
        </div>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          {{ t('terms.title') }}
        </h1>

        <!-- Effective Date Banner -->
        <div class="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 mb-6">
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs font-semibold text-slate-700">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ t('terms.effectiveDate') }}
          </div>
          <span class="text-slate-400">•</span>
          <span class="text-slate-500 font-medium">{{ t('terms.lastUpdated') }}</span>
        </div>

        <!-- Binding Agreement Notice Card -->
        <div class="rounded-3xl bg-gradient-to-br from-primary/5 via-white to-slate-50 border border-primary/15 p-6 sm:p-8 shadow-xs">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/20 mt-0.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {{ t('terms.intro') }}
            </p>
          </div>
        </div>
      </header>

      <!-- ── Direct Section Navigation Bar (TOC) ── -->
      <section class="mb-10 rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs" aria-label="Table of Contents">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          {{ t('terms.tocTitle') }}
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

      <!-- ── Terms Document Content ── -->
      <div class="space-y-10 text-slate-800">

        <!-- ── Section 1: General Scope & Services ── -->
        <section id="section-1" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center border border-primary/20">
              {{ t('terms.section1.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {{ t('terms.section1.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {{ t('terms.section1.subtitle') }}
          </p>

          <div class="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>{{ t('terms.section1.p1') }}</p>
            <p>{{ t('terms.section1.p2') }}</p>
          </div>
        </section>

        <!-- ── Section 2: User Responsibilities & Data Duty ── -->
        <section id="section-2" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center border border-primary/20">
              {{ t('terms.section2.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {{ t('terms.section2.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {{ t('terms.section2.subtitle') }}
          </p>

          <div class="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 class="text-sm font-bold text-slate-900 mb-1">Authenticity & Verification</h3>
              <p>{{ t('terms.section2.p1') }}</p>
            </div>
            <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-amber-950">
              <h3 class="text-sm font-bold text-amber-900 mb-1">Liability for Misdeclaration</h3>
              <p class="text-amber-900/90 text-xs sm:text-sm">{{ t('terms.section2.p2') }}</p>
            </div>
          </div>
        </section>

        <!-- ── Interactive Prohibited Items Hub Header ── -->
        <div class="pt-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {{ t('terms.prohibitedItems') }}
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">
                {{ t('terms.itemsText') }}
              </p>
            </div>

            <!-- Accordion Controls -->
            <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                @click="expandAll"
                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                {{ t('terms.expandAll') }}
              </button>
              <button
                type="button"
                @click="collapseAll"
                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                {{ t('terms.collapseAll') }}
              </button>
            </div>
          </div>
        </div>

        <!-- ── Section 3: UAE Prohibited Cargo ── -->
        <section id="section-3" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="mb-2">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-xl bg-red-100 text-red-600 font-mono font-bold text-xs flex items-center justify-center border border-red-200">
                {{ t('terms.section3.number') }}
              </span>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {{ t('terms.section3.title') }}
              </h2>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
            {{ t('terms.section3.subtitle') }}
          </p>

          <!-- Warning Callout -->
          <div class="rounded-2xl bg-red-50 border border-red-200/80 p-4 mb-6 flex items-start gap-3.5 text-red-950">
            <svg class="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-xs sm:text-sm font-semibold leading-relaxed text-red-900">
              {{ t('terms.section3.warning') }}
            </p>
          </div>

          <!-- Accordion Items: UAE Prohibited Categories -->
          <div class="space-y-3">
            <div v-for="i in 6" :key="`uae-${i}`" class="rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-200">
              <button
                type="button"
                @click="toggleCategory(`uae-${i}`)"
                class="w-full px-4 sm:px-5 py-3.5 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <span class="text-xs sm:text-sm font-bold text-slate-900">{{ t(`terms.section3.cat${i}Title`) }}</span>
                </div>
                <svg
                  class="w-4 h-4 text-slate-400 transition-transform duration-200"
                  :class="expandedCategories.has(`uae-${i}`) ? 'rotate-180' : ''"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-show="expandedCategories.has(`uae-${i}`)" class="px-5 py-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                {{ t(`terms.section3.cat${i}Desc`) }}
              </div>
            </div>
          </div>
        </section>

        <!-- ── Section 4: EAEU Prohibited Cargo ── -->
        <section id="section-4" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="mb-2">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-xl bg-red-100 text-red-600 font-mono font-bold text-xs flex items-center justify-center border border-red-200">
                {{ t('terms.section4.number') }}
              </span>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {{ t('terms.section4.title') }}
              </h2>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
            {{ t('terms.section4.subtitle') }}
          </p>

          <!-- Warning Callout -->
          <div class="rounded-2xl bg-red-50 border border-red-200/80 p-4 mb-6 flex items-start gap-3.5 text-red-950">
            <svg class="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-xs sm:text-sm font-semibold leading-relaxed text-red-900">
              {{ t('terms.section4.warning') }}
            </p>
          </div>

          <!-- Accordion Items: EAEU Prohibited Categories -->
          <div class="space-y-3">
            <div v-for="i in 9" :key="`eaeu-${i}`" class="rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-200">
              <button
                type="button"
                @click="toggleCategory(`eaeu-${i}`)"
                class="w-full px-4 sm:px-5 py-3.5 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <span class="text-xs sm:text-sm font-bold text-slate-900">{{ t(`terms.section4.cat${i}Title`) }}</span>
                </div>
                <svg
                  class="w-4 h-4 text-slate-400 transition-transform duration-200"
                  :class="expandedCategories.has(`eaeu-${i}`) ? 'rotate-180' : ''"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-show="expandedCategories.has(`eaeu-${i}`)" class="px-5 py-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                {{ t(`terms.section4.cat${i}Desc`) }}
              </div>
            </div>
          </div>
        </section>

        <!-- ── Section 5: EAEU Restricted Cargo (Special Certificates Required) ── -->
        <section id="section-5" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="mb-2">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 font-mono font-bold text-xs flex items-center justify-center border border-amber-200">
                {{ t('terms.section5.number') }}
              </span>
              <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {{ t('terms.section5.title') }}
              </h2>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
            {{ t('terms.section5.subtitle') }}
          </p>

          <!-- Notice Callout -->
          <div class="rounded-2xl bg-amber-50 border border-amber-200/80 p-4 mb-6 flex items-start gap-3.5 text-amber-950">
            <svg class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-xs sm:text-sm font-semibold leading-relaxed text-amber-900">
              {{ t('terms.section5.notice') }}
            </p>
          </div>

          <!-- Restricted Items Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="i in 4" :key="`res-${i}`" class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-5 flex flex-col justify-between">
              <div>
                <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200/80 mb-2">
                  {{ t(`terms.section5.res${i}Req`) }}
                </span>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                  {{ t(`terms.section5.res${i}Title`) }}
                </h3>
                <p class="text-xs text-slate-600 leading-relaxed">
                  {{ t(`terms.section5.res${i}Desc`) }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Section 6: Customs Inspection, Confiscation & Liability ── -->
        <section id="section-6" class="scroll-mt-24 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center border border-primary/20">
              {{ t('terms.section6.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {{ t('terms.section6.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            {{ t('terms.section6.subtitle') }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-5">
              <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-slate-900 mb-1.5">{{ t('terms.section6.inspectTitle') }}</h3>
              <p class="text-xs text-slate-600 leading-relaxed">{{ t('terms.section6.inspectDesc') }}</p>
            </div>

            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-5">
              <div class="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-slate-900 mb-1.5">{{ t('terms.section6.confiscateTitle') }}</h3>
              <p class="text-xs text-slate-600 leading-relaxed">{{ t('terms.section6.confiscateDesc') }}</p>
            </div>

            <div class="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-5">
              <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-slate-900 mb-1.5">{{ t('terms.section6.liabilityTitle') }}</h3>
              <p class="text-xs text-slate-600 leading-relaxed">{{ t('terms.section6.liabilityDesc') }}</p>
            </div>
          </div>
        </section>

        <!-- ── Section 7: Contact & Amendments ── -->
        <section id="section-7" class="scroll-mt-24 rounded-3xl bg-gradient-to-br from-primary via-[#002f80] to-primary-dark text-white p-6 sm:p-8 shadow-lg shadow-primary/20">
          <div class="flex items-center gap-3 mb-2">
            <span class="w-8 h-8 rounded-xl bg-white/15 text-white font-mono font-bold text-xs flex items-center justify-center border border-white/20">
              {{ t('terms.section7.number') }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {{ t('terms.section7.title') }}
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-200 mb-6 leading-relaxed">
            {{ t('terms.section7.contactDesc') }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Email Box -->
            <div class="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-xs flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                  {{ t('terms.section7.emailTitle') }}
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
              <p class="text-xs text-slate-200/80 mt-4 leading-relaxed">
                {{ t('terms.section7.amendDesc') }}
              </p>
            </div>

            <!-- Live Chat Consultation Box -->
            <div class="rounded-2xl bg-white/10 border border-white/15 p-5 backdrop-blur-xs flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                  {{ t('terms.section7.chatTitle') }}
                </span>
                <p class="text-xs text-slate-200/90 leading-relaxed mb-4">
                  {{ t('terms.section7.chatDesc') }}
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
                <span>{{ t('terms.section7.openChat') }}</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>
