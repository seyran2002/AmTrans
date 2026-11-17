<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()
const { isAuthenticated } = useAuth()
const router = useRouter()

const REDIRECT_TARGET = 'dashboard/addresses'

const loginHref = computed(
  () => `/auth/login?redirect=${encodeURIComponent(REDIRECT_TARGET)}`
)
const registerHref = computed(
  () => `/auth/register?redirect=${encodeURIComponent(REDIRECT_TARGET)}`
)

function goToDashboardOffices() {
  router.push(REDIRECT_TARGET)
}
</script>

<template>
  <section id="offices-directory" class="w-full py-12 sm:py-28 bg-slate-50/70" aria-label="Branch Offices Directory">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-wider text-primary mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          {{ t('contact.offices.badge') }}
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {{ t('contact.offices.title') }}
        </h2>
        <p class="text-sm sm:text-base text-slate-500 mt-4 leading-relaxed max-w-xl mx-auto">
          {{ t('contact.offices.subtitle') }}
        </p>
      </div>

      <!-- ══════════════════════════════════════════════
           AUTHENTICATED: Dashboard shortcut card
      ══════════════════════════════════════════════ -->
      <div v-if="isAuthenticated" class="flex justify-center">
        <div class="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#1a3060] to-primary-dark shadow-2xl shadow-primary/30 p-8 sm:p-12 text-white">

          <!-- Decorative background circles -->
          <div class="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
          <div class="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/[0.03]" />

          <!-- Top badge -->
          <div class="relative z-10 flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <h3 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              {{ t('contact.offices.auth.dashboardTitle') }}
            </h3>
            <p class="text-sm sm:text-base text-slate-200/80 leading-relaxed max-w-sm mb-8">
              {{ t('contact.offices.auth.dashboardDescription') }}
            </p>

            <!-- Benefit pills -->
            <div class="flex flex-wrap justify-center gap-2 mb-8">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/90">
                <svg class="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ t('contact.offices.auth.pill1') }}
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/90">
                <svg class="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ t('contact.offices.auth.pill2') }}
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/90">
                <svg class="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {{ t('contact.offices.auth.pill3') }}
              </span>
            </div>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-primary bg-white hover:bg-slate-50 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl min-h-[48px]"
              :aria-label="t('contact.offices.auth.dashboardCta')"
              @click="goToDashboardOffices"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              {{ t('contact.offices.auth.dashboardCta') }}
            </button>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════
           GUEST: Login / Register CTA — wide split card
      ══════════════════════════════════════════════ -->
      <div v-else class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/60 border border-slate-200/80 shadow-xl">

        <!-- Decorative top gradient bar -->
        <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

        <!-- Decorative background map-pin pattern -->
        <div class="pointer-events-none absolute top-6 right-8 opacity-[0.04]" aria-hidden="true">
          <svg class="w-72 h-72 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>

        <div class="relative z-10 grid lg:grid-cols-2 gap-0">

          <!-- LEFT: Text & value propositions -->
          <div class="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            <!-- Lock badge -->
            <div class="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {{ t('contact.offices.auth.lockedBadge') }}
            </div>

            <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
              {{ t('contact.offices.auth.guestTitle') }}
            </h3>
            <p class="text-sm sm:text-[15px] text-slate-500 leading-relaxed mb-8">
              {{ t('contact.offices.auth.guestDescription') }}
            </p>

            <!-- Feature list -->
            <ul class="space-y-3 mb-10">
              <li class="flex items-center gap-3 text-sm text-slate-700">
                <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span class="font-medium">{{ t('contact.offices.auth.feature1') }}</span>
              </li>
              <li class="flex items-center gap-3 text-sm text-slate-700">
                <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span class="font-medium">{{ t('contact.offices.auth.feature2') }}</span>
              </li>
              <li class="flex items-center gap-3 text-sm text-slate-700">
                <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span class="font-medium">{{ t('contact.offices.auth.feature3') }}</span>
              </li>
            </ul>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-3">
              <a
                :href="loginHref"
                class="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg min-h-[48px]"
                :aria-label="t('contact.offices.auth.loginCta')"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {{ t('contact.offices.auth.loginCta') }}
              </a>

              <a
                :href="registerHref"
                class="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-primary bg-primary/8 hover:bg-primary/15 border border-primary/25 hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 min-h-[48px]"
                :aria-label="t('contact.offices.auth.registerCta')"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {{ t('contact.offices.auth.registerCta') }}
              </a>
            </div>
          </div>

          <!-- RIGHT: Visual map card -->
          <div class="hidden lg:flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-primary/5 via-primary/[0.07] to-secondary/10 border-l border-slate-200/60">
            <div class="text-center space-y-6 max-w-xs">
              <!-- Globe / map illustration -->
              <div class="relative mx-auto w-40 h-40">
                <!-- Outer ring -->
                <div class="absolute inset-0 rounded-full bg-primary/10 border-2 border-primary/20 animate-[spin_30s_linear_infinite]" />
                <!-- Middle ring -->
                <div class="absolute inset-4 rounded-full bg-primary/15 border border-primary/25" />
                <!-- Center icon -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <!-- Orbit dots -->
                <div class="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-secondary shadow-md shadow-secondary/40" />
                <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/60" />
                <div class="absolute left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary/40" />
                <div class="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary/70" />
              </div>

              <!-- Mini stat cards -->
              <div class="grid grid-cols-2 gap-3">
                <div class="rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-sm text-left">
                  <p class="text-xl font-extrabold text-primary leading-none">3+</p>
                  <p class="text-[11px] text-slate-500 font-medium mt-1 leading-tight">{{ t('contact.offices.auth.statCountries') }}</p>
                </div>
                <div class="rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-sm text-left">
                  <p class="text-xl font-extrabold text-secondary leading-none">24/7</p>
                  <p class="text-[11px] text-slate-500 font-medium mt-1 leading-tight">{{ t('contact.offices.auth.statSupport') }}</p>
                </div>
                <div class="col-span-2 rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-sm text-left">
                  <p class="text-xl font-extrabold text-emerald-600 leading-none">{{ t('contact.offices.auth.statFree') }}</p>
                  <p class="text-[11px] text-slate-500 font-medium mt-1 leading-tight">{{ t('contact.offices.auth.statRegister') }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
