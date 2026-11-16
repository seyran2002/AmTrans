<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { tariffsService } from '~/services/tariffs.service'
import type { Tariff } from '~/types/tariff'
import { useI18n } from '~/composables/useI18n'
import { getCountryName, isFlagImageUrl } from '~/composables/useOfficeHelpers'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'

const { t, currentLanguage } = useI18n()

const tariffs = ref<Tariff[]>([])
const isLoading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)
const showAll = ref<boolean>(false)

const INITIAL_LIMIT = 4

const loadTariffs = async () => {
  isLoading.value = true
  errorMessage.value = null

  try {
    const data = await tariffsService.getTariffs()
    tariffs.value = data
  } catch (err: unknown) {
    const e = err as { message?: string }
    errorMessage.value = e?.message || t('home.tariffs.errorDesc')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTariffs()
})

const visibleTariffs = computed(() => {
  if (showAll.value || tariffs.value.length <= INITIAL_LIMIT) {
    return tariffs.value
  }
  return tariffs.value.slice(0, INITIAL_LIMIT)
})

const hasMoreTariffs = computed(() => tariffs.value.length > INITIAL_LIMIT)

const formatPrice = (val: number | string | undefined): string => {
  if (val === undefined || val === null || val === '') return '0'
  const num = typeof val === 'number' ? val : parseFloat(String(val))
  return isNaN(num) ? '0' : num.toLocaleString()
}
</script>

<template>
  <section
    id="shipping-tariffs"
    class="w-full bg-slate-50/70 py-12 sm:py-28 relative overflow-hidden scroll-mt-20 border-t border-slate-200/60"
    aria-labelledby="tariffs-heading"
  >
    <!-- Background subtle ambient decorations -->
    <div class="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      <!-- Section Header -->
      <div class="text-center mb-14 sm:mb-20 max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-600/30 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800 mb-4 shadow-xs">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          {{ t('home.tariffs.badge') }}
        </div>
        <h2
          id="tariffs-heading"
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          {{ t('home.tariffs.title') }}
          <span class="bg-gradient-to-r from-secondary via-amber-500 to-amber-600 bg-clip-text text-transparent">
            {{ t('home.tariffs.titleHighlight') }}
          </span>
        </h2>
        <p class="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          {{ t('home.tariffs.subtitle') }}
        </p>
      </div>

      <!-- ── Loading Skeleton State ── -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
        <div
          v-for="n in 4"
          :key="n"
          class="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs animate-pulse"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="h-4 w-24 bg-slate-200 rounded-md" />
            <div class="h-6 w-20 bg-slate-200 rounded-full" />
          </div>
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-slate-200 shrink-0" />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-32 bg-slate-200 rounded" />
              <div class="h-3 w-20 bg-slate-200 rounded" />
            </div>
            <div class="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
            <div class="flex-1 space-y-2 text-right">
              <div class="h-4 w-32 bg-slate-200 rounded ml-auto" />
              <div class="h-3 w-20 bg-slate-200 rounded ml-auto" />
            </div>
          </div>
          <div class="h-10 w-full bg-slate-100 rounded-xl" />
        </div>
      </div>

      <!-- ── Error State ── -->
      <div
        v-else-if="errorMessage"
        class="max-w-xl mx-auto rounded-3xl bg-red-50/70 border border-red-200/80 p-8 text-center shadow-sm mb-12"
      >
        <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-2">
          {{ t('home.tariffs.errorTitle') }}
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          {{ errorMessage }}
        </p>
        <BaseButton
          variant="secondary"
          size="sm"
          :block="false"
          @click="loadTariffs"
          class="mx-auto"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t('home.tariffs.retry') }}
        </BaseButton>
      </div>

      <!-- ── Empty State ── -->
      <div
        v-else-if="tariffs.length === 0"
        class="max-w-xl mx-auto rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs mb-12"
      >
        <div class="w-16 h-16 mx-auto mb-4 rounded-3xl bg-slate-100 text-slate-500 flex items-center justify-center">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-2">
          {{ t('home.tariffs.emptyTitle') }}
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          {{ t('home.tariffs.emptyDesc') }}
        </p>
        <NuxtLink to="/contact-us" class="inline-flex items-center min-h-[44px]">
          <BaseButton variant="primary" size="sm" :block="false">
            {{ t('home.tariffs.contactSupport') }}
          </BaseButton>
        </NuxtLink>
      </div>

      <!-- ── Tariffs Cards Grid ── -->
      <div v-else class="space-y-8 mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div
            v-for="tariff in visibleTariffs"
            :key="tariff.id"
            class="group relative rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <!-- Top badge row -->
            <div class="flex items-center justify-between gap-3 mb-6">
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 border border-primary/20 px-3 py-1 rounded-full">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>{{ t('home.tariffs.expressCargo') }}</span>
              </span>

              <BaseBadge variant="success" size="sm">
                {{ t('home.tariffs.activeRoute') }}
              </BaseBadge>
            </div>

            <!-- Route Origin & Destination Visual Flow -->
            <div class="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 mb-6">
              <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">

                <!-- Origin (From) -->
                <div class="min-w-0">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    {{ t('home.tariffs.from') }}
                  </span>
                  <div class="flex items-center gap-2">
                    <template v-if="tariff.fromOffice?.country?.icon && isFlagImageUrl(tariff.fromOffice.country.icon)">
                      <img
                        :src="tariff.fromOffice.country.icon"
                        :alt="tariff.fromOffice.country.enName || 'Flag'"
                        class="w-5 h-5 rounded-full object-cover shrink-0 shadow-xs"
                      />
                    </template>
                    <span v-else class="text-base shrink-0" aria-hidden="true">📍</span>
                    <div class="min-w-0">
                      <h4 class="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {{ tariff.fromOffice?.city || tariff.fromOffice?.province || 'Office' }}
                      </h4>
                      <p class="text-[11px] text-slate-600 truncate">
                        {{ tariff.fromOffice?.country ? getCountryName(tariff.fromOffice.country, currentLanguage) : 'Origin' }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Direction Arrow -->
                <div class="flex flex-col items-center justify-center shrink-0 px-1 sm:px-2" aria-hidden="true">
                  <div class="w-8 h-8 rounded-full bg-secondary/15 text-amber-700 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                    <svg class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

                <!-- Destination (To) -->
                <div class="min-w-0 text-right">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    {{ t('home.tariffs.to') }}
                  </span>
                  <div class="flex items-center justify-end gap-2">
                    <div class="min-w-0">
                      <h4 class="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {{ tariff.toOffice?.city || tariff.toOffice?.province || 'Office' }}
                      </h4>
                      <p class="text-[11px] text-slate-600 truncate">
                        {{ tariff.toOffice?.country ? getCountryName(tariff.toOffice.country, currentLanguage) : 'Destination' }}
                      </p>
                    </div>
                    <template v-if="tariff.toOffice?.country?.icon && isFlagImageUrl(tariff.toOffice.country.icon)">
                      <img
                        :src="tariff.toOffice.country.icon"
                        :alt="tariff.toOffice.country.enName || 'Flag'"
                        class="w-5 h-5 rounded-full object-cover shrink-0 shadow-xs"
                      />
                    </template>
                    <span v-else class="text-base shrink-0" aria-hidden="true">📍</span>
                  </div>
                </div>

              </div>
            </div>

            <!-- Price & Action Footer -->
            <div class="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span class="text-[11px] text-slate-600 font-medium block">
                  {{ t('home.tariffs.priceLabel') }}
                </span>
                <div class="flex items-baseline gap-1.5 mt-0.5">
                  <span class="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                    {{ formatPrice(tariff.pricePerKg) }}
                  </span>
                  <span class="text-xs font-bold text-slate-700 uppercase">
                    {{ t('home.tariffs.perKg') }}
                  </span>
                </div>
              </div>

              <NuxtLink to="/auth/register" class="inline-flex min-h-[44px] items-center">
                <BaseButton
                  variant="secondary"
                  size="sm"
                  :block="false"
                  class="font-bold shadow-md shadow-secondary/20"
                >
                  <span>{{ t('home.tariffs.bookShipment') }}</span>
                  <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </BaseButton>
              </NuxtLink>
            </div>

          </div>
        </div>

        <!-- View All / Show Less Toggle Button -->
        <div v-if="hasMoreTariffs" class="text-center pt-2">
          <button
            type="button"
            @click="showAll = !showAll"
            class="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-primary bg-white border border-slate-300 hover:bg-slate-50 hover:border-primary/40 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span>{{ showAll ? t('home.tariffs.showLess') : t('home.tariffs.viewAllRoutes') }}</span>
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': showAll }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- ── Volumetric vs Actual Weight Explanatory Callout ── -->
      <div class="rounded-3xl bg-gradient-to-br from-primary/5 via-blue-50/50 to-primary/10 border border-primary/20 p-6 sm:p-8 relative overflow-hidden">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-6">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
            <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>

          <div class="flex-1">
            <h4 class="text-base sm:text-lg font-bold text-slate-900 mb-1">
              {{ t('home.tariffs.calcNoticeTitle') }}
            </h4>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {{ t('home.tariffs.calcNoticeDesc') }}
            </p>
          </div>

          <div class="shrink-0 w-full md:w-auto pt-2 md:pt-0">
            <NuxtLink to="/contact-us" class="inline-block w-full md:w-auto">
              <button
                type="button"
                class="w-full md:w-auto min-h-[44px] sm:min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-primary bg-white border border-primary/30 hover:bg-primary/5 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span>{{ t('home.tariffs.contactSupport') }}</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
