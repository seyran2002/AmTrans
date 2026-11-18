<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useApi } from '~/composables/useApi'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import CountryTab from '~/components/addresses/CountryTab.vue'
import OfficeCard from '~/components/addresses/OfficeCard.vue'
import type { CountryWithOffices } from '~/types/office'

definePageMeta({
  middleware: ['auth', 'customer'],
  layout: 'dashboard'
})

const { t, currentLanguage } = useI18n()
const { apiFetch } = useApi()

// ── State ────────────────────────────────────────────────────────────────────
const countries = ref<CountryWithOffices[]>([])
const selectedCountryId = ref<string | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// ── Derived ──────────────────────────────────────────────────────────────────
const selectedCountry = computed(() =>
  countries.value.find(c => c.id === selectedCountryId.value) ?? null
)

const selectedOffices = computed(() => selectedCountry.value?.offices ?? [])

const selectedCountryName = computed<string>(() => selectedCountry.value?.enName || "");

// ── API fetch ────────────────────────────────────────────────────────────────
const fetchCountriesWithOffices = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await apiFetch<CountryWithOffices[] | { data: CountryWithOffices[] }>('/countries/withOffices', {
      method: 'GET'
    })

    let data: CountryWithOffices[] = []
    if (Array.isArray(response)) {
      data = response
    } else if (response && Array.isArray((response as any).data)) {
      data = (response as any).data
    }

    countries.value = data

    // Auto-select the first country
    if (data.length > 0 && !selectedCountryId.value) {
      selectedCountryId.value = data[0].id
    }
  } catch (err: any) {
    const msg = err?.data?.message || err?.response?._data?.message || err?.message
    error.value = Array.isArray(msg)
      ? msg.join(', ')
      : (typeof msg === 'string' ? msg : 'Failed to load countries.')
  } finally {
    isLoading.value = false
  }
}

const selectCountry = (id: string) => {
  selectedCountryId.value = id
}

onMounted(fetchCountriesWithOffices)
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-4 sm:space-y-6 [&>.popup]:!mt-0">

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-primary tracking-tight leading-tight">
          {{ t('dashboardNav.addresses') }}
        </h1>
        <p class="text-slate-500 text-xs sm:text-sm font-medium mt-0.5 sm:mt-1">
          {{ t('addresses.subTitle') }}
        </p>
      </div>
    </div>

    <!-- Error Banner -->
    <AlertBanner :message="error" />

    <!-- Main Card -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">

      <!-- ── Loading skeleton ──────────────────────────────────────── -->
      <div v-if="isLoading" class="p-4 sm:p-6 space-y-4 sm:space-y-6 [&>.popup]:!mt-0">
        <!-- Country tabs skeleton -->
        <div class="flex gap-2 sm:gap-3 overflow-hidden">
          <div v-for="i in 4" :key="i" class="h-9 sm:h-10 w-24 sm:w-28 bg-slate-100 rounded-xl sm:rounded-2xl animate-pulse shrink-0" />
        </div>
        <!-- Divider -->
        <div class="h-px bg-slate-100" />
        <!-- Office cards skeleton -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div v-for="i in 3" :key="i" class="h-32 sm:h-36 bg-slate-50 rounded-2xl animate-pulse" />
        </div>
      </div>

      <!-- ── Empty / error state (no countries at all) ─────────────── -->
      <div
        v-else-if="!isLoading && countries.length === 0"
        class="py-12 sm:py-16 px-4 sm:px-6 text-center"
      >
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        </div>
        <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-1">No countries found</h3>
        <p class="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
          There are no countries configured yet. Please check back later.
        </p>
      </div>

      <!-- ── Data ──────────────────────────────────────────────────── -->
      <template v-else>

        <!-- Country tabs strip -->
        <div class="px-4 sm:px-6 pb-0">
          <div class="flex flex-wrap items-center gap-2 sm:gap-2.5 overflow-x-auto pt-4 sm:pt-6 pb-3 sm:pb-4 scrollbar-hide">
            <CountryTab
              v-for="country in countries"
              :key="country.id"
              :country="country"
              :is-active="country.id === selectedCountryId"
              :lang="currentLanguage"
              @select="selectCountry"
            />
          </div>
          <!-- Hairline divider -->
          <div class="h-px bg-slate-100 -mx-4 sm:-mx-6" />
        </div>

        <!-- Offices section -->
        <div class="p-4 sm:p-6">

          <!-- Section label -->
          <div class="flex items-center gap-2 mb-3 sm:mb-4">
            <svg class="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 10V11m0 0h6M11 11H5"
              />
            </svg>
            <h2 class="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
              {{ t('addresses.offices') || 'Offices' }}
              <span
                v-if="selectedOffices.length > 0"
                class="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary/15 text-secondary text-[11px] font-bold"
              >
                {{ selectedOffices.length }}
              </span>
            </h2>
          </div>

          <!-- Office cards grid -->
          <div
            v-if="selectedOffices.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            <OfficeCard
              v-for="office in selectedOffices"
              :key="office.id"
              :office="office"
              :country-name="selectedCountryName"
            />
          </div>

          <!-- Empty offices state -->
          <div
            v-else
            class="py-8 sm:py-10 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 px-4"
          >
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 10V11m0 0h6M11 11H5"
                />
              </svg>
            </div>
            <p class="text-slate-500 text-xs sm:text-sm font-medium">
              {{ t('addresses.noOffices') || 'No offices found for this country.' }}
            </p>
          </div>

        </div>
      </template>
    </div>

  </div>
</template>

<style scoped>
/* Hide scrollbar on country tab strip while keeping it scrollable */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
