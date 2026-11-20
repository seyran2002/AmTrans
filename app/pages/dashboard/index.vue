<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: [
    'auth',
    async () => {
      const localePath = useLocalePath()
      const { user, checkAuth, token, isAuthenticated } = useAuth()
      if (!isAuthenticated.value && token.value) {
        await checkAuth()
      }
      const role = user.value?.role?.toUpperCase()
      if (role === 'ADMIN' || role === 'OPERATOR') {
        return navigateTo(localePath('/dashboard/manage-orders'))
      }
      return navigateTo(localePath('/dashboard/orders'))
    }
  ],
  layout: 'dashboard'
})
</script>

<template>
  <div class="p-4" />
</template>
