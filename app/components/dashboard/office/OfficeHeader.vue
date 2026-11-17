<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
        {{ t('office.pageTitle') }}
      </h1>
      <p class="text-slate-600 font-medium text-xs sm:text-sm mt-0.5 sm:mt-1">
        {{ t('office.pageSubtitle') }}
      </p>
    </div>

    <!-- Action Button matching Active Tab -->
    <div v-if="isAdmin" class="w-full sm:w-auto">
      <BaseButton
        v-if="activeTab === 'countries'"
        type="button"
        variant="primary"
        size="md"
        :block="false"
        class="w-full sm:w-auto !min-h-[40px] sm:!min-h-[44px]"
        @click="$emit('add-country')"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>{{ t('office.addCountry') }}</span>
      </BaseButton>

      <BaseButton
        v-else
        type="button"
        variant="primary"
        size="md"
        :block="false"
        class="w-full sm:w-auto !min-h-[40px] sm:!min-h-[44px]"
        @click="$emit('add-office')"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>{{ t('office.addOffice') }}</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useAuth } from '~/composables/useAuth'
import BaseButton from '~/components/ui/BaseButton.vue'

defineProps<{
  activeTab: 'countries' | 'offices'
}>()

defineEmits<{
  (e: 'add-country'): void
  (e: 'add-office'): void
}>()

const { t } = useI18n()

const { user: currentUser } = useAuth()
const isAdmin = computed(() => currentUser.value?.role?.toUpperCase() === 'ADMIN')
</script>
