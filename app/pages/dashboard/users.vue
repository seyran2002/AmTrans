<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { useAuth } from '~/composables/useAuth'
import { useUsers } from '~/composables/useUsers'
import { Role, type UserItem } from '~/types/user'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import SuccessBanner from '~/components/ui/SuccessBanner.vue'

definePageMeta({
  middleware: ['auth', 'admin-or-operator'],
  layout: 'dashboard'
})

const { t, currentLanguage } = useI18n()
const { user: currentUser } = useAuth()
const {
  users,
  isLoading,
  savingUserIds,
  updatingSupporterUserIds,
  error,
  fetchUsers,
  updateUserRole,
  updateSupporterStatus,
  clearMessages
} = useUsers()

// Role checking
const isAdmin = computed(() => currentUser.value?.role?.toUpperCase() === 'ADMIN')
const isOperator = computed(() => currentUser.value?.role?.toUpperCase() === 'OPERATOR')

// Local role selection state for ADMIN role edits
const pendingRoles = reactive<Record<string, string>>({})

// Page notifications
const pageSuccessMessage = ref<string | null>(null)
const pageErrorMessage = ref<string | null>(null)

const showNotification = (msg: string, isErr = false) => {
  if (isErr) {
    pageErrorMessage.value = msg
    setTimeout(() => { pageErrorMessage.value = null }, 5000)
  } else {
    pageSuccessMessage.value = msg
    setTimeout(() => { pageSuccessMessage.value = null }, 4000)
  }
}

// Available role options for dropdown
const roleOptions = computed(() => [
  { value: Role.CUSTOMER, label: t('users.roles.CUSTOMER') },
  { value: Role.OPERATOR, label: t('users.roles.OPERATOR') },
  { value: Role.ADMIN, label: t('users.roles.ADMIN') }
])

// Sync pending roles when users array updates
const syncPendingRoles = () => {
  users.value.forEach(u => {
    pendingRoles[u.id] = u.role
  })
}

watch(users, () => {
  syncPendingRoles()
}, { immediate: true, deep: true })

// Check if user's pending role is changed from server state
const isRoleChanged = (userItem: UserItem): boolean => {
  const pending = pendingRoles[userItem.id]
  if (!pending) return false
  return pending.toUpperCase() !== String(userItem.role).toUpperCase()
}

// Helper for user full name
const getUserFullName = (userItem: UserItem): string => {
  const parts = [userItem.firstName, userItem.lastName].filter(Boolean)
  if (parts.length > 0) return parts.join(' ')
  return userItem.email?.split('@')[0] || 'User'
}

// Helper to get localized document type based on current locale
const getDocumentType = (userItem: UserItem): string => {
  if (currentLanguage.value === 'hy' && userItem.hyDocumentType) return userItem.hyDocumentType
  if (currentLanguage.value === 'ru' && userItem.ruDocumentType) return userItem.ruDocumentType
  if (currentLanguage.value === 'en' && userItem.enDocumentType) return userItem.enDocumentType
  return userItem.hyDocumentType || userItem.enDocumentType || userItem.ruDocumentType || ''
}

// Helper for status badge styling
const getStatusBadgeClass = (status?: string): string => {
  const s = status?.toUpperCase()
  if (s === 'ACTIVE' || s === 'VERIFIED') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (s === 'PENDING' || s === 'UNVERIFIED') return 'bg-amber-50 text-amber-700 border-amber-200'
  if (s === 'BLOCKED' || s === 'INACTIVE' || s === 'SUSPENDED') return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

// Save role change handler
const handleSaveRole = async (userItem: UserItem) => {
  clearMessages()
  const newRole = pendingRoles[userItem.id]

  // Prevent unnecessary API request if role was not changed
  if (!newRole || !isRoleChanged(userItem)) return

  const success = await updateUserRole(userItem.id, newRole)
  if (success) {
    showNotification(t('users.saveSuccess'))
  }
}

// Supporter toggle handler (ADMIN only)
const handleToggleSupporter = async (userItem: UserItem) => {
  if (!isAdmin.value || updatingSupporterUserIds.value[userItem.id]) return

  clearMessages()
  const nextVal = !userItem.isSupporter
  const success = await updateSupporterStatus(userItem.id, nextVal)
  if (success) {
    showNotification(t('users.supporterSuccess'))
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 [&>.popup]:!mt-0">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-primary tracking-tight">
          {{ t('users.title') }}
        </h1>
        <p class="text-slate-600 font-medium text-sm mt-1">
          {{ t('users.subtitle') }}
        </p>
      </div>
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
          <div v-for="i in 5" :key="i" class="h-16 bg-slate-50 rounded-2xl animate-pulse w-full"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!isLoading && users.length === 0"
        class="text-center py-12 px-4 max-w-md mx-auto"
      >
        <div class="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">
          {{ t('users.emptyTitle') }}
        </h3>
        <p class="text-slate-500 text-sm mb-6 leading-relaxed">
          {{ t('users.emptySubtitle') }}
        </p>
      </div>

      <!-- Users Table -->
      <div v-else class="overflow-x-auto -mx-6 sm:mx-0">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th class="py-4 px-6 rounded-l-2xl">{{ t('users.user') }}</th>
              <th class="py-4 px-6">{{ t('users.email') }}</th>
              <th class="py-4 px-6">{{ t('users.phone') }}</th>
              <th class="py-4 px-6">{{ t('users.accountType') }}</th>
              <th class="py-4 px-6">{{ t('users.document') }}</th>
              <th class="py-4 px-6">{{ t('users.address') }}</th>
              <th class="py-4 px-6">{{ t('users.status') }}</th>
              <th class="py-4 px-6 min-w-[170px]">{{ t('users.role') }}</th>
              <th class="py-4 px-6 text-center min-w-[120px]" :class="{ 'rounded-r-2xl': !isAdmin }">{{ t('users.supporter') }}</th>
              <th v-if="isAdmin" class="py-4 px-6 text-right rounded-r-2xl min-w-[120px]">{{ t('users.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm font-medium text-slate-700">
            <tr
              v-for="userItem in users"
              :key="userItem.id"
              class="hover:bg-slate-50/80 transition-colors group"
            >
              <!-- Name, Avatar & Code -->
              <td class="py-4 px-6 font-bold text-slate-900">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                    {{ (userItem.firstName?.[0] || userItem.lastName?.[0] || userItem.email?.[0] || 'U').toUpperCase() }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="font-bold text-slate-900 truncate">{{ getUserFullName(userItem) }}</p>
                      <span v-if="userItem.code" class="text-[10px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
                        {{ userItem.code }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-400 font-normal truncate sm:hidden">{{ userItem.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="py-4 px-6 text-slate-800 font-medium">
                {{ userItem.email }}
              </td>

              <!-- Phone -->
              <td class="py-4 px-6 text-slate-600 font-mono text-xs">
                {{ userItem.phoneNumber || '-' }}
              </td>

              <!-- Account Type (isIndividual) -->
              <td class="py-4 px-6">
                <span
                  v-if="userItem.isIndividual === false"
                  class="inline-flex w-max items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  {{ t('users.legalEntity') }}
                </span>
                <span
                  v-else
                  class="inline-flex w-max items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {{ t('users.individual') }}
                </span>
              </td>

              <!-- Document / Company Details -->
              <td class="py-4 px-6">
                <!-- If Individual (isIndividual !== false) -->
                <div v-if="userItem.isIndividual !== false" class="space-y-0.5">
                  <div v-if="getDocumentType(userItem)" class="text-xs font-semibold text-slate-800">
                    {{ getDocumentType(userItem) }}
                  </div>
                  <div v-if="userItem.documentNumber" class="text-xs font-mono text-slate-500">
                    {{ userItem.documentNumber }}
                  </div>
                  <div v-if="!getDocumentType(userItem) && !userItem.documentNumber" class="text-slate-400 text-xs">
                    -
                  </div>
                </div>

                <!-- If Legal Entity (isIndividual === false) -->
                <div v-else class="space-y-0.5">
                  <div v-if="userItem.companyName" class="text-xs font-bold text-indigo-900">
                    {{ userItem.companyName }}
                  </div>
                  <div v-if="userItem.taxpayerId" class="text-[11px] font-mono text-indigo-700">
                    {{ t('users.taxpayerId') }}: {{ userItem.taxpayerId }}
                  </div>
                  <div v-if="userItem.documentNumber" class="text-xs font-mono text-slate-500">
                    Doc #: {{ userItem.documentNumber }}
                  </div>
                  <div v-if="!userItem.companyName && !userItem.taxpayerId && !userItem.documentNumber" class="text-slate-400 text-xs">
                    -
                  </div>
                </div>
              </td>

              <!-- Address -->
              <td class="py-4 px-6 text-slate-700 text-xs max-w-xs truncate" :title="userItem.address || '-'">
                {{ userItem.address || '-' }}
              </td>

              <!-- Status -->
              <td class="py-4 px-6">
                <span
                  v-if="userItem.status"
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize',
                    getStatusBadgeClass(userItem.status)
                  ]"
                >
                  {{ userItem.status }}
                </span>
                <span v-else class="text-slate-400 text-xs">
                  -
                </span>
              </td>

              <!-- Role (Select dropdown for ADMIN, Badge for OPERATOR) -->
              <td class="py-4 px-6">
                <!-- ADMIN: Editable BaseSelect -->
                <div v-if="isAdmin" class="max-w-[170px] min-w-[160px]">
                  <BaseSelect
                    :model-value="pendingRoles[userItem.id] || String(userItem.role)"
                    :options="roleOptions"
                    :disabled="savingUserIds[userItem.id]"
                    @update:model-value="val => pendingRoles[userItem.id] = val"
                  />
                </div>

                <!-- OPERATOR: Read-Only Role Badge -->
                <div v-else>
                  <span
                    v-if="String(userItem.role).toUpperCase() === 'ADMIN'"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs"
                  >
                    ADMIN
                  </span>
                  <span
                    v-else-if="String(userItem.role).toUpperCase() === 'OPERATOR'"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs"
                  >
                    OPERATOR
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {{ String(userItem.role).toUpperCase() }}
                  </span>
                </div>
              </td>

              <!-- Supporter (Toggle for ADMIN, Read-only Switch/Indicator for OPERATOR) -->
              <td class="py-4 px-6 text-center">
                <div class="inline-flex items-center justify-center">
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="Boolean(userItem.isSupporter)"
                    :disabled="!isAdmin || updatingSupporterUserIds[userItem.id]"
                    @click="handleToggleSupporter(userItem)"
                    :class="[
                      'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 select-none',
                      userItem.isSupporter ? 'bg-primary' : 'bg-slate-200',
                      !isAdmin ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-90',
                      updatingSupporterUserIds[userItem.id] ? 'opacity-50 cursor-wait' : ''
                    ]"
                    :title="isAdmin ? (userItem.isSupporter ? t('users.supporter') : t('users.supporter')) : (userItem.isSupporter ? t('users.supporter') : '-')"
                  >
                    <span class="sr-only">{{ t('users.supporter') }}</span>
                    <span
                      aria-hidden="true"
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center',
                        userItem.isSupporter ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    >
                      <svg
                        v-if="updatingSupporterUserIds[userItem.id]"
                        class="animate-spin h-3 w-3 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      <svg
                        v-else-if="userItem.isSupporter"
                        class="h-3 w-3 text-primary stroke-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </td>

              <!-- Save Action (ADMIN only) -->
              <td v-if="isAdmin" class="py-4 px-6 text-right">
                <div class="flex items-center justify-end">
                  <BaseButton
                    type="button"
                    variant="primary"
                    size="sm"
                    :block="false"
                    :disabled="!isRoleChanged(userItem) || savingUserIds[userItem.id]"
                    :loading="savingUserIds[userItem.id]"
                    @click="handleSaveRole(userItem)"
                  >
                    {{ t('users.save') }}
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
