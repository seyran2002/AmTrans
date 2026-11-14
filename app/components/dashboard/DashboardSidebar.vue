<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from '~/composables/useI18n'

interface Props {
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
const { t } = useI18n()
const { user, logout } = useAuth()

interface NavItem {
  key: string
  labelKey: string
  to: string
  icon: 'orders' | 'addresses' | 'receivers' | 'office' | 'users' | 'profile' | 'settings' | 'support'
  roles?: string[]
}

const ALL_NAV_ITEMS: NavItem[] = [
  { key: 'orders', labelKey: 'dashboardNav.orders', to: '/dashboard/orders', icon: 'orders', roles: ['CUSTOMER'] },
  { key: 'manage-orders', labelKey: 'dashboardNav.manageOrders', to: '/dashboard/manage-orders', icon: 'orders', roles: ['ADMIN', 'OPERATOR'] },
  { key: 'addresses', labelKey: 'dashboardNav.addresses', to: '/dashboard/addresses', icon: 'addresses', roles: ['CUSTOMER'] },
  { key: 'receivers', labelKey: 'dashboardNav.receivers', to: '/dashboard/receivers', icon: 'receivers', roles: ['CUSTOMER'] },
  { key: 'office', labelKey: 'dashboardNav.office', to: '/dashboard/office', icon: 'office', roles: ['ADMIN', 'OPERATOR'] },
  { key: 'users', labelKey: 'dashboardNav.users', to: '/dashboard/users', icon: 'users', roles: ['ADMIN', 'OPERATOR'] },
  { key: 'support-chat', labelKey: 'dashboardNav.supportChat', to: '/dashboard/support-chat', icon: 'support', roles: ['ADMIN', 'OPERATOR'] },
  { key: 'system-settings', labelKey: 'dashboardNav.systemSettings', to: '/dashboard/system-settings', icon: 'settings', roles: ['ADMIN'] },
  { key: 'profile', labelKey: 'dashboardNav.profile', to: '/dashboard/profile', icon: 'profile' }
]

const NAV_ITEMS = computed(() => {
  const currentRole = user.value?.role?.toUpperCase() || ''
  const isSupporter = Boolean(user.value?.isSupporter)
  return ALL_NAV_ITEMS.filter(item => {
    if (item.key === 'support-chat' && isSupporter) return true
    if (!item.roles) return true
    return item.roles.includes(currentRole)
  })
})

const isActive = (to: string) => {
  return route.path === to || route.path.startsWith(to + '/')
}

const handleNavItemClick = () => {
  emit('close')
  isHovered.value = false;
  isFocused.value = false;
}

const handleExit = async () => {
  emit('close')
  await logout()
}

// Expand on hover/focus on desktop, or when mobile drawer isOpen is true
const isHovered = ref(false)
const isFocused = ref(false)

const isExpanded = computed(() => isHovered.value || isFocused.value || props.isOpen)
</script>

<template>
  <div>
    <!-- Mobile/Tablet Backdrop Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
        @click="emit('close')"
        aria-hidden="true"
      />
    </Transition>

    <!-- Unified Floating Sidebar (Mobile drawer & Desktop hover-expand) -->
    <aside
      :class="[
        'fixed top-20 sm:top-[115px] left-0 h-screen z-40',
        'flex flex-col items-start pl-4 sm:pl-6',
        'transition-transform duration-300 ease-in-out select-none',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @focusin="isFocused = true"
      @focusout="isFocused = false"
      aria-label="Dashboard Sidebar Navigation"
    >
      <!-- Floating Card Container -->
      <nav
        :class="[
          'bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl transition-all duration-300 ease-in-out flex flex-col overflow-hidden shadow-xl hover:shadow-2xl',
          isExpanded ? 'w-64 p-3 gap-1' : 'w-20 p-2 gap-1'
        ]"
      >
        <!-- Sidebar Header / Brand Logo Swap -->
        <div class="border-b border-slate-100 pb-3 mb-1 shrink-0 px-3 pt-2">
          <NuxtLink to="/" @click="handleNavItemClick" class="flex items-center h-8 w-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl">
            <!-- Collapsed Logo (logo-small.png) -->
            <img
              src="~/assets/logo-small.png"
              alt="AmTrans Brand Icon"
              class="h-8 w-auto object-contain absolute left-1 sm:left-1.5 top-1/2 -translate-y-1/2 transition-opacity duration-200"
              :class="isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'"
            />

            <!-- Expanded Logo (logo.png) -->
            <img
              src="~/assets/logo.png"
              alt="AmTrans Logo"
              class="h-8 w-auto object-contain absolute left-1 sm:left-1.5 top-1/2 -translate-y-1/2 transition-opacity duration-200"
              :class="isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            />
          </NuxtLink>
        </div>

        <!-- User Information Card -->
        <div
          v-if="user"
          :class="[
            'rounded-xl bg-slate-50 border border-slate-100 flex items-center transition-all duration-300 overflow-hidden shrink-0 my-1',
            isExpanded ? 'px-3 py-2.5 gap-3' : 'p-2 justify-center'
          ]"
          :title="!isExpanded ? user.email : undefined"
        >
          <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {{ (user.email?.[0] || 'U').toUpperCase() }}
          </div>
          <div
            class="min-w-0 flex-1 transition-all duration-300 overflow-hidden"
            :class="isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'"
          >
            <p class="text-xs font-bold text-slate-800 truncate">{{ user.email }}</p>
            <p class="text-[10px] text-slate-500 font-medium capitalize truncate">{{ user.role || 'User' }}</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-1">
          <NuxtLink
            v-for="item in NAV_ITEMS"
            :key="item.key"
            :to="item.to"
            @click="handleNavItemClick"
            :title="!isExpanded ? t(item.labelKey) : undefined"
            :class="[
              'flex items-center rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 outline-none select-none group/item focus-visible:ring-2 focus-visible:ring-primary/40',
              isExpanded ? 'px-3 py-2.5 justify-start gap-3' : 'py-2.5 justify-center gap-0',
              isActive(item.to)
                ? 'bg-primary/10 text-primary font-bold shadow-xs border-l-4 border-primary'
                : 'text-slate-600 hover:text-primary hover:bg-slate-50'
            ]"
          >
            <!-- SVG Icons -->
            <svg v-if="item.icon === 'orders'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>

            <svg v-else-if="item.icon === 'addresses'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>

            <svg v-else-if="item.icon === 'receivers'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 1 0 7.75"/>
            </svg>

            <svg v-else-if="item.icon === 'office'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
              <path d="M9 22v-4h6v4"/>
              <path d="M8 6h.01"/><path d="M16 6h.01"/>
              <path d="M8 10h.01"/><path d="M16 10h.01"/>
              <path d="M8 14h.01"/><path d="M16 14h.01"/>
            </svg>

            <svg v-else-if="item.icon === 'users'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 1 0 7.75"/>
            </svg>

            <svg v-else-if="item.icon === 'profile'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
            </svg>

            <svg v-else-if="item.icon === 'settings'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>

            <svg v-else-if="item.icon === 'support'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>

            <span
              class="truncate transition-all duration-300 whitespace-nowrap"
              :class="isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 hidden'"
            >
              {{ t(item.labelKey) }}
            </span>

            <span
              v-if="isExpanded && isActive(item.to)"
              class="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0"
            />
          </NuxtLink>
        </div>

        <!-- Sidebar Footer / Exit Action -->
        <div class="pt-2 border-t border-slate-100 shrink-0">
          <button
            type="button"
            @click="handleExit"
            :title="!isExpanded ? t('dashboardNav.exit') : undefined"
            :class="[
              'w-full flex items-center rounded-xl text-xs xl:text-sm font-bold text-slate-600 hover:text-[#8A1115] hover:bg-[#8A1115]/10 border border-transparent hover:border-[#8A1115]/20 transition-all duration-200 outline-none select-none group/exit focus-visible:ring-2 focus-visible:ring-[#8A1115]/40 cursor-pointer',
              isExpanded ? 'px-3 py-2.5 justify-start gap-3' : 'py-2.5 justify-center gap-0'
            ]"
            aria-label="Exit dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-400 group-hover/exit:text-[#8A1115] transition-colors duration-200 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span
              class="truncate transition-all duration-300 whitespace-nowrap"
              :class="isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 hidden'"
            >
              {{ t('dashboardNav.exit') }}
            </span>
          </button>
        </div>
      </nav>
    </aside>
  </div>
</template>
