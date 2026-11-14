import { ref } from 'vue'
import { userService } from '~/services/user.service'
import { Role, type UserItem } from '~/types/user'

export function useUsers() {
  const users = ref<UserItem[]>([])
  const isLoading = ref<boolean>(false)
  const savingUserIds = ref<Record<string, boolean>>({})
  const updatingSupporterUserIds = ref<Record<string, boolean>>({})
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const clearMessages = () => {
    error.value = null
    successMessage.value = null
  }

  /**
   * Fetch all users from GET /users API
   */
  const fetchUsers = async (): Promise<UserItem[]> => {
    isLoading.value = true
    error.value = null

    try {
      users.value = await userService.getUsers()
      return users.value
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to fetch users list.')
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update user role via PATCH /users/:id/role
   */
  const updateUserRole = async (userId: string, newRole: Role | string): Promise<boolean> => {
    if (savingUserIds.value[userId]) return false

    savingUserIds.value = { ...savingUserIds.value, [userId]: true }
    clearMessages()

    try {
      const response = await userService.updateUserRole(userId, newRole)

      // Update local state for the user
      const targetUser = users.value.find(u => u.id === userId)
      if (targetUser) {
        targetUser.role = newRole
      } else if (response && response.role) {
        const index = users.value.findIndex(u => u.id === userId)
        if (index !== -1) {
          users.value[index] = { ...users.value[index], ...response }
        }
      }

      return true
    } catch (err: any) {
      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to update user role.')
      return false
    } finally {
      const newSaving = { ...savingUserIds.value }
      delete newSaving[userId]
      savingUserIds.value = newSaving
    }
  }

  /**
   * Update user supporter status via PATCH /users/:id/supporter
   * Handles optimistic update and rolls back on failure
   */
  const updateSupporterStatus = async (userId: string, isSupporter: boolean): Promise<boolean> => {
    if (updatingSupporterUserIds.value[userId]) return false

    // Optimistically update
    const userIndex = users.value.findIndex(u => u.id === userId)
    const previousStatus = userIndex !== -1 ? users.value[userIndex].isSupporter : undefined

    if (userIndex !== -1) {
      users.value[userIndex].isSupporter = isSupporter
    }

    updatingSupporterUserIds.value = { ...updatingSupporterUserIds.value, [userId]: true }
    clearMessages()

    try {
      const response = await userService.updateSupporterStatus(userId, isSupporter)

      // Confirm with response if provided
      if (userIndex !== -1 && response && typeof response.isSupporter === 'boolean') {
        users.value[userIndex].isSupporter = response.isSupporter
      }

      return true
    } catch (err: any) {
      // Revert optimistic update on failure
      if (userIndex !== -1) {
        users.value[userIndex].isSupporter = previousStatus
      }

      const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
      error.value = Array.isArray(serverMsg)
        ? serverMsg.join(', ')
        : (typeof serverMsg === 'string' ? serverMsg : 'Failed to update supporter status.')
      return false
    } finally {
      const newUpdating = { ...updatingSupporterUserIds.value }
      delete newUpdating[userId]
      updatingSupporterUserIds.value = newUpdating
    }
  }

  return {
    users,
    isLoading,
    savingUserIds,
    updatingSupporterUserIds,
    error,
    successMessage,
    clearMessages,
    fetchUsers,
    updateUserRole,
    updateSupporterStatus,
  }
}
