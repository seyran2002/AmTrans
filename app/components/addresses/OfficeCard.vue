<!--
  OfficeCard.vue
  ─────────────────────────────────────────────────────────────
  Displays one office with:
    • Receiver dropdown  (user's receivers + themselves as "Myself")
    • Identification code  (code field of the selected person)
    • Address, Country, City, Province, Phone, Postal Code
    • Small copy button for every field
-->
<template>
  <div
    class="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 overflow-hidden"
  >
    <!-- ── Card header ───────────────────────────────────────── -->
    <div class="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 pt-3.5 sm:pt-5 pb-3 sm:pb-4 border-b border-slate-100">
      <div
        class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m0 10V11m0 0h6M11 11H5"
          />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
          {{ office.city }}<span v-if="office.province">, {{ office.province }}</span>
        </p>
        <p class="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 truncate">{{ countryName }}</p>
      </div>
    </div>

    <!-- ── Body ─────────────────────────────────────────────── -->
    <div class="px-3.5 sm:px-5 py-3 sm:py-4 space-y-2.5 sm:space-y-3.5">

      <!-- 1) Receiver dropdown -->
      <div class="space-y-1 sm:space-y-1.5 group/receiver p-1 sm:p-1.5 -mx-1 sm:-mx-1.5 rounded-xl hover:bg-slate-50/80 transition-colors">
        <div class="flex items-center justify-between">
          <label
            :for="`receiver-${office.id}`"
            class="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary/90"
          >
            {{ t('addresses.receiver') || 'Receiver' }}
          </label>
          <button
            v-if="selectedReceiverLabel"
            type="button"
            @click="copyReceiver"
            :title="isCopiedReceiver ? 'Copied!' : 'Copy Receiver'"
            class="shrink-0 p-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
            :class="[
              isCopiedReceiver
                ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 px-1.5'
                : 'text-slate-400 hover:text-primary hover:bg-white hover:shadow-xs hover:ring-1 hover:ring-slate-200 opacity-60 group-hover/receiver:opacity-100 focus:opacity-100'
            ]"
          >
            <svg v-if="isCopiedReceiver" class="w-3.5 h-3.5 stroke-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span v-if="isCopiedReceiver" class="text-[10px] font-semibold">Copied</span>
          </button>
        </div>

        <div class="relative group/select">
          <!-- Loading skeleton -->
          <div
            v-if="isLoadingReceivers"
            class="h-9 sm:h-11 w-full bg-slate-100 animate-pulse rounded-xl sm:rounded-2xl"
          />

          <select
            v-else
            :id="`receiver-${office.id}`"
            v-model="selectedReceiverValue"
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200/90 text-slate-800 text-xs sm:text-sm font-medium rounded-xl sm:rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none shadow-xs cursor-pointer hover:border-slate-300"
          >
            <option
              v-for="opt in receiverOptions"
              :key="opt.value"
              :value="opt.value"
            >{{ opt.label }}</option>
          </select>

          <!-- Chevron -->
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none text-slate-400 group-focus-within/select:text-primary transition-colors"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- 2) Identification code -->
      <InfoRow
        icon="id"
        :label="t('addresses.identCode') || 'Identification Code'"
        :value="selectedCode || ''"
      >
        <span
          v-if="selectedCode"
          class="font-mono text-[11px] sm:text-xs font-bold text-primary bg-primary/8 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg tracking-wide inline-block"
        >{{ selectedCode }}</span>
        <span v-else class="text-slate-400 text-xs italic">—</span>
      </InfoRow>

      <!-- Divider -->
      <div class="h-px bg-slate-100" />

      <!-- 3) Address -->
      <InfoRow
        icon="location"
        :label="t('addresses.address') || 'Address'"
        :value="office.fullAddress"
      >
        {{ office.fullAddress }}
      </InfoRow>

      <!-- 4) Country -->
      <InfoRow
        icon="globe"
        :label="t('addresses.country') || 'Country'"
        :value="countryName"
      >
        {{ countryName }}
      </InfoRow>

      <!-- 5) City -->
      <InfoRow
        icon="city"
        :label="t('addresses.city') || 'City'"
        :value="office.city"
      >
        {{ office.city }}
      </InfoRow>

      <!-- 6) Province -->
      <InfoRow
        icon="province"
        :label="t('addresses.province') || 'Province'"
        :value="office.province || ''"
      >
        {{ office.province || '—' }}
      </InfoRow>

      <!-- 7) Phone -->
      <InfoRow
        icon="phone"
        :label="t('addresses.phone') || 'Phone'"
        :value="office.phone"
      >
        <a :href="`tel:${office.phone}`" class="hover:text-primary transition-colors">
          {{ office.phone }}
        </a>
      </InfoRow>

      <!-- 8) Postal Code -->
      <InfoRow
        v-if="office.postalCode"
        icon="postal"
        :label="t('addresses.postalCode') || 'Postal Code'"
        :value="office.postalCode"
      >
        {{ office.postalCode }}
      </InfoRow>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import InfoRow from './InfoRow.vue'
import { useI18n } from '~/composables/useI18n'
import { useAuth } from '~/composables/useAuth'
import { useReceivers } from '~/composables/useReceivers'
import type { Office } from '~/types/office'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps<{
  office: Office
  /** Localised country name resolved by the parent */
  countryName: string
}>()

const { t } = useI18n()
const { user } = useAuth()

// ─── Receivers ────────────────────────────────────────────────────────────────
const { receivers, isLoading: isLoadingReceivers, fetchReceivers } = useReceivers()

onMounted(fetchReceivers)

// ─── Receiver options  ────────────────────────────────────────────────────────
// Special sentinel value for "myself"
const MYSELF_VALUE = '__myself__'

const receiverOptions = computed(() => {
  const opts: { value: string; label: string; code?: string | null }[] = []

  // "Myself" entry — the logged-in user
  if (user.value) {
    const name = [user.value.firstName, user.value.lastName].filter(Boolean).join(' ')
      || user.value.email
      || 'Myself'
    opts.push({ value: MYSELF_VALUE, label: `${name} (Me)`, code: user.value.code ?? null })
  }

  // Receivers
  for (const r of receivers.value) {
    const label = [r.firstName, r.lastName].filter(Boolean).join(' ') || `Receiver #${r.id.slice(0, 6)}`
    opts.push({ value: r.id, label, code: r.code ?? null })
  }

  return opts
})

// ─── Selected receiver ────────────────────────────────────────────────────────
const selectedReceiverValue = ref<string>(MYSELF_VALUE)

// Derive the code for the currently selected option
const selectedCode = computed<string | null>(() => {
  const opt = receiverOptions.value.find(o => o.value === selectedReceiverValue.value)
  return opt?.code ?? null
})

// Clean label for copying
const selectedReceiverLabel = computed(() => {
  const opt = receiverOptions.value.find(o => o.value === selectedReceiverValue.value)
  if (!opt) return ''
  return opt.label.replace(/\s*\(Me\)$/, '')
})

// Receiver copy state
const isCopiedReceiver = ref(false)
let receiverTimer: ReturnType<typeof setTimeout> | null = null

async function copyReceiver() {
  if (!selectedReceiverLabel.value) return
  try {
    await navigator.clipboard.writeText(selectedReceiverLabel.value)
    isCopiedReceiver.value = true
    if (receiverTimer) clearTimeout(receiverTimer)
    receiverTimer = setTimeout(() => {
      isCopiedReceiver.value = false
    }, 1800)
  } catch (err) {
    console.error('Failed to copy receiver:', err)
  }
}
</script>
