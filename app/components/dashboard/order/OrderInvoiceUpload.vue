<template>
  <div class="space-y-1.5">
    <label class="block text-xs font-bold uppercase tracking-wider text-primary/90">
      {{ t('orders.invoice') }}
      <span class="text-slate-400 normal-case font-normal ml-1">({{ t('orders.invoiceOptional') }})</span>
    </label>

    <!-- Existing attached invoice display -->
    <div
      v-if="existingInvoiceUrl && !modelValue"
      class="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between gap-3 mb-2"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="truncate text-left">
          <p class="text-xs font-semibold text-slate-800">{{ t('orders.currentInvoice') }}</p>
          <a
            :href="existingInvoiceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-primary hover:underline font-medium truncate block max-w-xs"
            @click.stop
          >
            {{ t('orders.viewInvoice') }}
          </a>
        </div>
      </div>
      <span v-if="!canEdit" class="text-[11px] font-semibold text-slate-400 px-2 py-0.5 bg-slate-200/60 rounded-md">
        Locked
      </span>
    </div>

    <!-- Upload Dropzone (active only when canEdit) -->
    <div
      :class="[
        'relative border-2 border-dashed rounded-2xl p-6 text-center transition-colors group',
        !canEdit
          ? 'border-slate-200 bg-slate-50/50 opacity-60 cursor-not-allowed'
          : 'border-slate-200 hover:border-primary/40 cursor-pointer'
      ]"
      @dragover.prevent="canEdit ? undefined : null"
      @drop.prevent="canEdit ? onDrop($event) : null"
      @click="canEdit ? triggerFileInput() : null"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*,.pdf"
        :disabled="!canEdit || disabled"
        class="hidden"
        @change="onChange"
      />
      <div v-if="!modelValue" class="space-y-2">
        <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto group-hover:bg-primary/10 transition-colors">
          <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p class="text-sm text-slate-500 font-medium">
          {{ existingInvoiceUrl ? (canEdit ? 'Click or drop a file to replace document' : t('orders.invoiceUploadHint')) : t('orders.invoiceUploadHint') }}
        </p>
        <p class="text-xs text-slate-400">{{ t('orders.invoiceFormats') }}</p>
      </div>
      <div v-else class="flex items-center justify-center gap-3">
        <div class="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="text-left">
          <p class="text-sm font-semibold text-slate-800 max-w-xs truncate">{{ modelValue.name }}</p>
          <p class="text-xs text-slate-500">{{ formatFileSize(modelValue.size) }}</p>
        </div>
        <button
          type="button"
          @click.stop="onRemove"
          :disabled="!canEdit"
          class="ml-auto p-1.5 text-slate-400 hover:text-tertiary hover:bg-red-50 rounded-lg transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '~/composables/useI18n'

const props = withDefaults(
  defineProps<{
    modelValue: File | null
    existingInvoiceUrl?: string | null
    canEdit?: boolean
    disabled?: boolean
  }>(),
  {
    existingInvoiceUrl: null,
    canEdit: true,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', file: File | null): void
}>()

const { t } = useI18n()
const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  emit('update:modelValue', file)
}

const onDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0] ?? null
  if (file) {
    emit('update:modelValue', file)
  }
}

const onRemove = () => {
  emit('update:modelValue', null)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

