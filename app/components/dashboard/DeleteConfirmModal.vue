<template>
  <Transition name="fade-modal">
    <div
      v-if="isOpen"
      class="popup fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
      @click.self="handleClose"
    >
      <div
        class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transform transition-all animate-scale-up my-8 text-center"
      >
        <!-- Warning Icon -->
        <div class="w-14 h-14 bg-red-100 text-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 class="text-xl font-bold text-slate-900 mb-2">
          {{ t('receivers.confirmDeleteTitle') }}
        </h3>

        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          {{ t('receivers.confirmDeleteMessage') }}
        </p>

        <div v-if="receiver" class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 text-left text-xs space-y-1 text-slate-700">
          <div class="font-bold text-slate-900 text-sm">
            {{ receiver.firstName }} {{ receiver.lastName }}
          </div>
          <div class="text-slate-500">
            {{ receiver.documentNumber }} ({{ receiver.phoneNumber }})
          </div>
        </div>

        <!-- Alert Banner for Error -->
        <div v-if="error" class="mb-5 text-left">
          <AlertBanner :message="error" />
        </div>

        <!-- Modal Actions -->
        <div class="flex items-center justify-center gap-3">
          <BaseButton
            type="button"
            variant="outline"
            size="md"
            :block="false"
            :disabled="isDeleting"
            @click="handleClose"
          >
            {{ t('receivers.cancel') }}
          </BaseButton>

          <BaseButton
            type="button"
            variant="tertiary"
            size="md"
            :block="false"
            :loading="isDeleting"
            :disabled="isDeleting"
            @click="handleConfirm"
          >
            {{ isDeleting ? t('receivers.deleting') : t('receivers.delete') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import { useI18n } from '~/composables/useI18n'
import type { Receiver } from '~/types/receiver'

const props = defineProps<{
  isOpen: boolean
  receiver?: Receiver | null
  isDeleting?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()

const handleConfirm = () => {
  if (!props.isDeleting) {
    emit('confirm')
  }
}

const handleClose = () => {
  if (!props.isDeleting) {
    emit('close')
  }
}
</script>

<style scoped>
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.25s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
