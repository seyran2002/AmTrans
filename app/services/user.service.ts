import { useApi } from '~/composables/useApi'
import type { UserItem, Role } from '~/types/user'

/**
 * User Service
 * Dedicated service for user management and administration endpoints.
 */
export const userService = {
  /**
   * Fetch all users
   */
  async getUsers(): Promise<UserItem[]> {
    const { apiFetch } = useApi()
    const response = await apiFetch<UserItem[] | { data?: UserItem[]; users?: UserItem[] }>('/users', {
      method: 'GET',
    })

    if (Array.isArray(response)) return response
    if (response && Array.isArray(response.data)) return response.data
    if (response && Array.isArray(response.users)) return response.users
    return []
  },

  /**
   * Update user role via PATCH /users/:id/role
   */
  async updateUserRole(userId: string, role: Role | string): Promise<UserItem> {
    const { apiFetch } = useApi()
    return await apiFetch<UserItem>(`/users/${userId}/role`, {
      method: 'PATCH',
      body: { role },
    })
  },

  /**
   * Update user supporter status via PATCH /users/:id/supporter
   */
  async updateSupporterStatus(userId: string, isSupporter: boolean): Promise<UserItem> {
    const { apiFetch } = useApi()
    return await apiFetch<UserItem>(`/users/${userId}/supporter`, {
      method: 'PATCH',
      body: { isSupporter },
    })
  },
}

/**
 * Composable wrapper for User Service
 */
export function useUserService() {
  return userService
}

