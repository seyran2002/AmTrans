<template>
  <fieldset class="space-y-3">
    <legend class="block text-xs font-bold uppercase tracking-wider text-primary/90 mb-2">
      {{ t('orders.recipient') }}
    </legend>

    <!-- Recipient toggle -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        :disabled="disabled"
        @click="$emit('update:recipientType', 'myself')"
        :class="[
          'flex-1 py-3 px-4 rounded-2xl border-2 text-sm font-bold transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed',
          recipientType === 'myself'
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-slate-200 text-slate-500 hover:border-slate-300'
        ]"
      >
        <span class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ t('orders.recipientMyself') }}
        </span>
      </button>

      <button
        type="button"
        :disabled="disabled"
        @click="switchToAnother"
        :class="[
          'flex-1 py-3 px-4 rounded-2xl border-2 text-sm font-bold transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed',
          recipientType === 'another'
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-slate-200 text-slate-500 hover:border-slate-300'
        ]"
      >
        <span class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {{ t('orders.recipientAnother') }}
        </span>
      </button>
    </div>

    <!-- Receiver selector (Another mode) -->
    <div v-if="recipientType === 'another'">
      <div v-if="loading" class="text-xs text-slate-500 py-2 flex items-center gap-2">
        <svg class="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {{ t('orders.loadingReceivers') }}
      </div>
      <BaseSelect
        v-else
        id="orderReceiverId"
        :model-value="receiverId"
        @update:model-value="$emit('update:receiverId', $event)"
        :label="t('orders.selectReceiver')"
        :placeholder="t('orders.selectReceiverPlaceholder')"
        :options="options"
        :required="true"
        :error="error"
        :disabled="disabled"
      />
      <p
        v-if="!loading && options.length === 0"
        class="text-xs text-slate-500 mt-2"
      >
        {{ t('orders.noReceivers') }}
      </p>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import BaseSelect, { type SelectOption } from '~/components/ui/BaseSelect.vue'
import { useI18n } from '~/composables/useI18n'
import type { RecipientType } from '~/composables/useOrderForm'

const props = withDefaults(
  defineProps<{
    recipientType: RecipientType
    receiverId: string
    options: SelectOption[]
    loading?: boolean
    disabled?: boolean
    error?: string
  }>(),
  {
    loading: false,
    disabled: false,
    error: undefined
  }
)

const emit = defineEmits<{
  (e: 'update:recipientType', value: RecipientType): void
  (e: 'update:receiverId', value: string): void
}>()

const { t } = useI18n()

const switchToAnother = () => {
  emit('update:recipientType', 'another')
  emit('update:receiverId', '')
}
</script>

