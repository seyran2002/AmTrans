<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-extrabold text-primary tracking-tight leading-tight">
        {{ t('dashboardNav.orders') }}
      </h1>
      <p class="text-slate-500 text-xs sm:text-sm font-medium mt-0.5 sm:mt-1">
        {{ t('orders.subtitle') }}
      </p>
    </div>

    <div class="w-full sm:w-auto">
      <BaseButton
        type="button"
        variant="primary"
        size="md"
        :block="false"
        class="w-full sm:w-auto !min-h-[40px] sm:!min-h-[44px]"
        @click="$emit('add-order')"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>{{ t('orders.addOrder') }}</span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'
import BaseButton from '~/components/ui/BaseButton.vue'

defineEmits<{
  (e: 'add-order'): void
}>()

const { t } = useI18n()
</script>

