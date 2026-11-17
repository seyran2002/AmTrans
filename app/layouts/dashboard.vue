<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardSidebar from '~/components/dashboard/DashboardSidebar.vue'
import LanguageSelector from '~/components/LanguageSelector.vue'
import SupportChatWidget from '~/components/SupportChatWidget.vue'
import { useI18n } from '~/composables/useI18n'
import { useSupporterChatNotification } from '~/composables/useSupporterChatNotification'
import CalculatorModal from '~/components/CalculatorModal.vue'

const route = useRoute()
const { t } = useI18n()
const { isSupporter, unreadCount } = useSupporterChatNotification()
const isMobileSidebarOpen = ref(false)
const isCalculatorOpen = ref(false)

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

// Automatically close mobile sidebar on route change
watch(() => route.path, () => {
  closeMobileSidebar()
})

const routeTitle = computed(() => {
  const segment = route.path.split('/').pop() || 'orders'
  if (segment === 'orders') return t('dashboardNav.orders')
  if (segment === 'manage-orders') return t('dashboardNav.manageOrders')
  if (segment === 'addresses') return t('dashboardNav.addresses')
  if (segment === 'receivers') return t('dashboardNav.receivers')
  if (segment === 'profile') return t('dashboardNav.profile')
  if (segment === 'office' || segment === 'offices') return t('dashboardNav.office')
  if (segment === 'users') return t('dashboardNav.users')
  return segment.charAt(0).toUpperCase() + segment.slice(1)
})
</script>

<template>
  <div class="min-h-screen bg-bgPrimary text-slate-800 font-sans antialiased flex flex-col">
    <!-- Reusable Dashboard Sidebar -->
    <DashboardSidebar :is-open="isMobileSidebarOpen" @close="closeMobileSidebar" />

    <!-- Main Wrapper -->
    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Top Bar (Full Width Spanning Across Screen) -->
      <header class="h-12 sm:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:pl-28 lg:pr-8 flex items-center justify-between sticky top-0 z-20 w-full transition-all duration-300">
        <div class="flex items-center gap-0 sm:gap-3">
          <!-- Mobile Menu Toggle Button (Below LG) -->
          <button
            type="button"
            @click="toggleMobileSidebar"
            class="lg:hidden p-2 rounded-xl text-slate-600 hover:text-primary hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 min-[420px]:w-6 min-[420px]:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Breadcrumb / Header Title -->
          <NuxtLink
            to="/"
            class="relative z-10 flex items-center shrink-0 min-h-8 sm:min-h-12 outline-none select-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            aria-label="AmTrans Logistics Homepage"
          >
            <NuxtImg 
              src="/logo.png"
              preload 
              fetchpriority="high"
              alt="AmTrans Logo" 
              class="translate-y-[10%] h-9 min-[420px]:h-12 sm:h-16 w-auto object-contain" 
            />  
          </NuxtLink>
        </div>

        <!-- Right Header Actions (Language Selector & Support Notifications) -->
        <div class="flex items-center gap-2.5 sm:gap-3">
          <!-- Support Notification Button (Supporters only) -->
          <NuxtLink
            v-if="isSupporter"
            to="/admin/support-chat"
            class="relative p-2 sm:p-2.5 rounded-full transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/40 flex items-center justify-center cursor-pointer bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-primary"
            aria-label="Support inquiries"
            title="Support inquiries"
          >
            <!-- Chat Bubble Icon -->
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>

            <!-- Unread Messages Badge -->
            <ClientOnly>
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </ClientOnly>
          </NuxtLink>

          <div class="flex items-center gap-4 ">
            <!-- Calculator Trigger Button -->
            <button
              type="button"
              @click="isCalculatorOpen = true"
              class="group flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full transition-all duration-300 outline-none select-none border cursor-pointer bg-white border-zinc-200 text-zinc-700 hover:text-primary hover:bg-zinc-50 hover:border-zinc-300 shadow-sm"
              :title="t('calculator.title')"
              :aria-label="t('calculator.title')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 lg:w-[18px] lg:h-[18px] transition-transform duration-300 group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.5h6" />
              </svg>
            </button>
            <LanguageSelector :is-transparent="false" />
          </div>
        </div>
      </header>

      <!-- Dashboard View Content -->
      <main class="flex-1 p-4 sm:p-6 lg:pl-28 transition-all duration-300">
        <slot />
      </main>
    </div>

    <!-- Shipping Cost Calculator Modal -->
    <CalculatorModal
      :is-open="isCalculatorOpen"
      @close="isCalculatorOpen = false"
    />

    <!-- Floating Support Chat Widget (Dashboard only) -->
    <SupportChatWidget  v-if="!isSupporter"/>
  </div>
</template>
