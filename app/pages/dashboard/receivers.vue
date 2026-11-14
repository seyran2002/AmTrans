<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useReceivers } from '~/composables/useReceivers'
import BaseButton from '~/components/ui/BaseButton.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import SuccessBanner from '~/components/ui/SuccessBanner.vue'
import ReceiverModal from '~/components/dashboard/ReceiverModal.vue'
import DeleteConfirmModal from '~/components/dashboard/DeleteConfirmModal.vue'
import type { Receiver, CreateReceiverPayload } from '~/types/receiver'

definePageMeta({
  middleware: ['auth', 'customer'],
  layout: 'dashboard'
})

const { t, currentLanguage } = useI18n()
const {
  receivers,
  isLoading,
  isSubmitting,
  isDeleting,
  error,
  successMessage,
  clearMessages,
  fetchReceivers,
  createReceiver,
  updateReceiver,
  deleteReceiver
} = useReceivers()

// Modal states
const isReceiverModalOpen = ref(false)
const selectedReceiver = ref<Receiver | null>(null)

const isDeleteModalOpen = ref(false)
const receiverToDelete = ref<Receiver | null>(null)

// Local banner states for page-level notifications
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

const formatDocumentType = (receiver: Receiver): string => {
  if (currentLanguage.value === 'hy' && receiver.hyDocumentType) return receiver.hyDocumentType
  if (currentLanguage.value === 'en' && receiver.enDocumentType) return receiver.enDocumentType
  if (currentLanguage.value === 'ru' && receiver.ruDocumentType) return receiver.ruDocumentType

  return receiver.enDocumentType || receiver.hyDocumentType || receiver.ruDocumentType || receiver.documentType || '-'
}

// Open modal for creating
const handleOpenCreateModal = () => {
  clearMessages()
  selectedReceiver.value = null
  isReceiverModalOpen.value = true
}

// Open modal for editing
const handleOpenEditModal = (receiver: Receiver) => {
  clearMessages()
  selectedReceiver.value = receiver
  isReceiverModalOpen.value = true
}

// Close receiver modal
const handleCloseReceiverModal = () => {
  isReceiverModalOpen.value = false
  selectedReceiver.value = null
}

// Submit Create or Edit form
const handleSaveReceiver = async (payload: CreateReceiverPayload) => {
  clearMessages()
  if (selectedReceiver.value) {
    // Edit existing
    const updated = await updateReceiver(selectedReceiver.value.id, payload)
    if (updated) {
      isReceiverModalOpen.value = false
      selectedReceiver.value = null
      showNotification(t('receivers.updateSuccess'))
    }
  } else {
    // Create new
    const created = await createReceiver(payload)
    if (created) {
      isReceiverModalOpen.value = false
      showNotification(t('receivers.createSuccess'))
    }
  }
}

// Open delete confirm modal
const handleOpenDeleteModal = (receiver: Receiver) => {
  clearMessages()
  receiverToDelete.value = receiver
  isDeleteModalOpen.value = true
}

// Close delete confirm modal
const handleCloseDeleteModal = () => {
  isDeleteModalOpen.value = false
  receiverToDelete.value = null
}

// Confirm deletion
const handleConfirmDelete = async () => {
  if (!receiverToDelete.value) return
  clearMessages()

  const success = await deleteReceiver(receiverToDelete.value.id)
  if (success) {
    isDeleteModalOpen.value = false
    receiverToDelete.value = null
    showNotification(t('receivers.deleteSuccess'))
  }
}

onMounted(() => {
  fetchReceivers()
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 [&>.popup]:!mt-0">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-primary tracking-tight">
          {{ t('receivers.title') }}
        </h1>
        <p class="text-slate-600 font-medium text-sm mt-1">
          {{ t('receivers.subtitle') }}
        </p>
      </div>

      <BaseButton
        type="button"
        variant="primary"
        size="md"
        :block="false"
        @click="handleOpenCreateModal"
      >
        <svg class="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>{{ t('receivers.addReceiver') }}</span>
      </BaseButton>
    </div>

    <!-- Notification Banners -->
    <SuccessBanner
      v-if="pageSuccessMessage"
      :title="pageSuccessMessage"
    />
    <AlertBanner
      v-if="pageErrorMessage || error"
      :message="pageErrorMessage || error"
    />

    <!-- Main Container -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 transition-all">
      <!-- Loading Skeleton State -->
      <div v-if="isLoading" class="space-y-4 py-4">
        <div class="h-10 bg-slate-100 rounded-2xl animate-pulse w-full"></div>
        <div class="space-y-3">
          <div v-for="i in 4" :key="i" class="h-16 bg-slate-50 rounded-2xl animate-pulse w-full"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!isLoading && receivers.length === 0"
        class="text-center py-12 px-4 max-w-md mx-auto"
      >
        <div class="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">
          {{ t('receivers.emptyTitle') }}
        </h3>
        <p class="text-slate-500 text-sm mb-6 leading-relaxed">
          {{ t('receivers.emptySubtitle') }}
        </p>
        <BaseButton
          type="button"
          variant="secondary"
          size="md"
          :block="false"
          @click="handleOpenCreateModal"
        >
          <svg class="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{{ t('receivers.addReceiver') }}</span>
        </BaseButton>
      </div>

      <!-- Receivers List / Table -->
      <div v-else class="overflow-x-auto -mx-6 sm:mx-0">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th class="py-4 px-6 rounded-l-2xl">{{ t('receivers.firstName') }}</th>
              <th class="py-4 px-6">{{ t('receivers.lastName') }}</th>
              <th class="py-4 px-6">{{ t('receivers.documentType') }}</th>
              <th class="py-4 px-6">{{ t('receivers.documentNumber') }}</th>
              <th class="py-4 px-6">{{ t('receivers.address') }}</th>
              <th class="py-4 px-6">{{ t('receivers.phoneNumber') }}</th>
              <th class="py-4 px-6 text-right rounded-r-2xl">{{ t('receivers.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm font-medium text-slate-700">
            <tr
              v-for="receiver in receivers"
              :key="receiver.id"
              class="hover:bg-slate-50/80 transition-colors group"
            >
              <!-- First Name -->
              <td class="py-4 px-6 font-bold text-slate-900">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                    {{ receiver.firstName?.[0]?.toUpperCase() || 'R' }}
                  </div>
                  <span>{{ receiver.firstName }}</span>
                </div>
              </td>

              <!-- Last Name -->
              <td class="py-4 px-6">
                {{ receiver.lastName }}
              </td>

              <!-- Document Type -->
              <td class="py-4 px-6">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  {{ formatDocumentType(receiver) }}
                </span>
              </td>

              <!-- Document Number -->
              <td class="py-4 px-6 font-mono text-xs text-slate-800 font-bold">
                {{ receiver.documentNumber }}
              </td>

              <!-- Address -->
              <td class="py-4 px-6 text-slate-600 max-w-xs truncate" :title="receiver.address">
                {{ receiver.address }}
              </td>

              <!-- Phone Number -->
              <td class="py-4 px-6 text-slate-800 font-medium">
                {{ receiver.phoneNumber }}
              </td>

              <!-- Actions -->
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <!-- Edit Button -->
                  <button
                    type="button"
                    @click="handleOpenEditModal(receiver)"
                    class="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                    :title="t('receivers.edit')"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <!-- Delete Button -->
                  <button
                    type="button"
                    @click="handleOpenDeleteModal(receiver)"
                    class="p-2 text-slate-500 hover:text-tertiary hover:bg-red-50 rounded-xl transition-all"
                    :title="t('receivers.delete')"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Receiver Form Modal (Create / Edit) -->
    <ReceiverModal
      :is-open="isReceiverModalOpen"
      :receiver="selectedReceiver"
      :is-submitting="isSubmitting"
      :error="error"
      @close="handleCloseReceiverModal"
      @submit="handleSaveReceiver"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      :receiver="receiverToDelete"
      :is-deleting="isDeleting"
      :error="error"
      @close="handleCloseDeleteModal"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>
