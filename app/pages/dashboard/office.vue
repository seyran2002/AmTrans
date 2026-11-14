<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useCountries } from '~/composables/useCountries'
import { useOffices } from '~/composables/useOffices'
import { getCountryName, getCountryFlag, findOfficeCountry } from '~/composables/useOfficeHelpers'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import SuccessBanner from '~/components/ui/SuccessBanner.vue'
import OfficeHeader from '~/components/dashboard/office/OfficeHeader.vue'
import OfficeTabs from '~/components/dashboard/office/OfficeTabs.vue'
import CountryTable from '~/components/dashboard/office/CountryTable.vue'
import OfficeTable from '~/components/dashboard/office/OfficeTable.vue'
import CountryModal from '~/components/dashboard/CountryModal.vue'
import OfficeModal from '~/components/dashboard/OfficeModal.vue'
import DeleteOfficeConfirmModal, { type ItemDetail } from '~/components/dashboard/DeleteOfficeConfirmModal.vue'
import OfficeOperatorsModal from '~/components/dashboard/OfficeOperatorsModal.vue'
import type { Country, CreateCountryPayload, Office, CreateOfficePayload } from '~/types/office'

definePageMeta({
  middleware: ['auth', 'admin-or-operator'],
  layout: 'dashboard'
})

const { t, currentLanguage } = useI18n()

// Active Tab: 'countries' | 'offices'
const activeTab = ref<'countries' | 'offices'>('countries')

// Composables
const {
  countries,
  isLoading: isCountriesLoading,
  isSubmitting: isCountrySubmitting,
  isDeleting: isCountryDeleting,
  error: countryError,
  fetchCountries,
  createCountry,
  deleteCountry
} = useCountries()

const {
  offices,
  isLoading: isOfficesLoading,
  isSubmitting: isOfficeSubmitting,
  isDeleting: isOfficeDeleting,
  error: officeError,
  fetchOffices,
  createOffice,
  updateOffice,
  deleteOffice
} = useOffices()

// Operators modal state
const isOperatorsModalOpen = ref(false)
const selectedOfficeForOperators = ref<Office | null>(null)

const handleOpenOperatorsModal = (office: Office) => {
  selectedOfficeForOperators.value = office
  isOperatorsModalOpen.value = true
}

// Search and filter queries
const searchQuery = ref('')
const selectedCountryFilter = ref<string>('')

// Page-level notifications
const pageSuccessMessage = ref<string | null>(null)
const pageErrorMessage = ref<string | null>(null)

const showNotification = (msg: string, isError = false) => {
  if (isError) {
    pageErrorMessage.value = msg
    setTimeout(() => { pageErrorMessage.value = null }, 5000)
  } else {
    pageSuccessMessage.value = msg
    setTimeout(() => { pageSuccessMessage.value = null }, 4000)
  }
}

// Modal States
const isCountryModalOpen = ref(false)
const selectedCountry = ref<Country | null>(null)

const isOfficeModalOpen = ref(false)
const selectedOffice = ref<Office | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetType = ref<'country' | 'office'>('country')
const countryToDelete = ref<Country | null>(null)
const officeToDelete = ref<Office | null>(null)

// Filtered Lists
const filteredCountries = computed(() => {
  if (!searchQuery.value.trim()) return countries.value
  const query = searchQuery.value.toLowerCase().trim()
  return countries.value.filter(c =>
    c.hyName?.toLowerCase().includes(query) ||
    c.ruName?.toLowerCase().includes(query) ||
    c.enName?.toLowerCase().includes(query) ||
    c.code?.toLowerCase().includes(query)
  )
})

const filteredOffices = computed(() => {
  let list = offices.value

  if (selectedCountryFilter.value) {
    list = list.filter(o => o.countryId === selectedCountryFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    list = list.filter(o => {
      const countryObj = findOfficeCountry(countries.value, o.countryId)
      const countryName = countryObj ? getCountryName(countryObj, currentLanguage.value).toLowerCase() : ''
      return (
        o.city.toLowerCase().includes(query) ||
        o.province.toLowerCase().includes(query) ||
        o.fullAddress.toLowerCase().includes(query) ||
        o.postalCode.toLowerCase().includes(query) ||
        o.phone.toLowerCase().includes(query) ||
        countryName.includes(query)
      )
    })
  }

  return list
})

// Handlers for Countries
const handleOpenAddCountry = () => {
  selectedCountry.value = null
  isCountryModalOpen.value = true
}

const handleSaveCountry = async (payload: CreateCountryPayload) => {
  const created = await createCountry(payload)
  if (created) {
    isCountryModalOpen.value = false
    showNotification(t('office.createCountrySuccess'))
  }
}

const handleOpenDeleteCountry = (c: Country) => {
  deleteTargetType.value = 'country'
  countryToDelete.value = c
  officeToDelete.value = null
  isDeleteModalOpen.value = true
}

// Handlers for Offices
const handleOpenAddOffice = () => {
  selectedOffice.value = null
  isOfficeModalOpen.value = true
}

const handleOpenEditOffice = (o: Office) => {
  selectedOffice.value = o
  isOfficeModalOpen.value = true
}

const handleSaveOffice = async (payload: CreateOfficePayload) => {
  if (selectedOffice.value) {
    const updated = await updateOffice(selectedOffice.value.id, payload)
    if (updated) {
      isOfficeModalOpen.value = false
      selectedOffice.value = null
      showNotification(t('office.updateOfficeSuccess'))
    }
  } else {
    const created = await createOffice(payload)
    if (created) {
      isOfficeModalOpen.value = false
      showNotification(t('office.createOfficeSuccess'))
    }
  }
}

const handleOpenDeleteOffice = (o: Office) => {
  deleteTargetType.value = 'office'
  officeToDelete.value = o
  countryToDelete.value = null
  isDeleteModalOpen.value = true
}

// Delete Confirmation Modal Details
const deleteModalTitle = computed(() => {
  return deleteTargetType.value === 'country'
    ? t('office.confirmDeleteCountryTitle')
    : t('office.confirmDeleteOfficeTitle')
})

const deleteModalMessage = computed(() => {
  return deleteTargetType.value === 'country'
    ? t('office.confirmDeleteCountryMessage')
    : t('office.confirmDeleteOfficeMessage')
})

const deleteModalItemDetail = computed<ItemDetail | null>(() => {
  if (deleteTargetType.value === 'country' && countryToDelete.value) {
    return {
      title: getCountryName(countryToDelete.value, currentLanguage.value),
      subtitle: `${countryToDelete.value.hyName} / ${countryToDelete.value.ruName} / ${countryToDelete.value.enName}`,
      icon: getCountryFlag(countryToDelete.value)
    }
  }
  if (deleteTargetType.value === 'office' && officeToDelete.value) {
    const country = findOfficeCountry(countries.value, officeToDelete.value.countryId)
    return {
      title: `${officeToDelete.value.city}, ${officeToDelete.value.province}`,
      subtitle: `${officeToDelete.value.fullAddress} (${officeToDelete.value.phone})`,
      icon: getCountryFlag(country) || '🏢'
    }
  }
  return null
})

const isDeletingCombined = computed(() => {
  return deleteTargetType.value === 'country' ? isCountryDeleting.value : isOfficeDeleting.value
})

const deleteErrorCombined = computed(() => {
  return deleteTargetType.value === 'country' ? countryError.value : officeError.value
})

const handleConfirmDelete = async () => {
  if (deleteTargetType.value === 'country' && countryToDelete.value) {
    const success = await deleteCountry(countryToDelete.value.id)
    if (success) {
      isDeleteModalOpen.value = false
      countryToDelete.value = null
      showNotification(t('office.deleteCountrySuccess'))
    }
  } else if (deleteTargetType.value === 'office' && officeToDelete.value) {
    const success = await deleteOffice(officeToDelete.value.id)
    if (success) {
      isDeleteModalOpen.value = false
      officeToDelete.value = null
      showNotification(t('office.deleteOfficeSuccess'))
    }
  }
}

onMounted(async () => {
  await Promise.all([fetchCountries(), fetchOffices()])
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 [&>.popup]:!mt-0 [&>.popup]:!mt-0">
    <!-- Header Section -->
    <OfficeHeader
      :active-tab="activeTab"
      @add-country="handleOpenAddCountry"
      @add-office="handleOpenAddOffice"
    />

    <!-- Notification Banners -->
    <SuccessBanner
      v-if="pageSuccessMessage"
      :title="pageSuccessMessage"
    />
    <AlertBanner
      v-if="pageErrorMessage || countryError || officeError"
      :message="pageErrorMessage || countryError || officeError || ''"
    />

    <!-- Navigation Tabs & Content Container -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6 [&>.popup]:!mt-0  [&>.popup]:!mt-0">
      <!-- Tab Buttons & Search Controls Row -->
      <OfficeTabs
        v-model:active-tab="activeTab"
        v-model:search-query="searchQuery"
        v-model:selected-country-filter="selectedCountryFilter"
        :countries-count="countries.length"
        :offices-count="offices.length"
        :countries="countries"
        :current-language="currentLanguage"
      />

      <!-- TAB 1: COUNTRIES -->
      <CountryTable
        v-if="activeTab === 'countries'"
        :countries="filteredCountries"
        :offices="offices"
        :is-loading="isCountriesLoading"
        :current-language="currentLanguage"
        @add="handleOpenAddCountry"
        @delete="handleOpenDeleteCountry"
      />

      <!-- TAB 2: OFFICES -->
      <OfficeTable
        v-else-if="activeTab === 'offices'"
        :offices="filteredOffices"
        :countries="countries"
        :is-loading="isOfficesLoading"
        :current-language="currentLanguage"
        @add="handleOpenAddOffice"
        @edit="handleOpenEditOffice"
        @delete="handleOpenDeleteOffice"
        @operators="handleOpenOperatorsModal"
      />
    </div>

    <!-- Country Form Modal -->
    <CountryModal
      :is-open="isCountryModalOpen"
      :is-submitting="isCountrySubmitting"
      :error="countryError"
      @close="isCountryModalOpen = false"
      @submit="handleSaveCountry"
    />

    <!-- Office Form Modal -->
    <OfficeModal
      :is-open="isOfficeModalOpen"
      :office="selectedOffice"
      :countries="countries"
      :is-submitting="isOfficeSubmitting"
      :error="officeError"
      @close="isOfficeModalOpen = false"
      @submit="handleSaveOffice"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteOfficeConfirmModal
      :is-open="isDeleteModalOpen"
      :title="deleteModalTitle"
      :message="deleteModalMessage"
      :item-detail="deleteModalItemDetail"
      :is-deleting="isDeletingCombined"
      :error="deleteErrorCombined"
      @close="isDeleteModalOpen = false"
      @confirm="handleConfirmDelete"
    />

    <!-- Office Operators Modal -->
    <OfficeOperatorsModal
      :is-open="isOperatorsModalOpen"
      :office="selectedOfficeForOperators"
      @close="isOperatorsModalOpen = false"
      @updated="showNotification(t('office.operatorAssignedSuccess'))"
    />
  </div>
</template>
