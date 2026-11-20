<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const localePath = useLocalePath()
const { t } = useI18n()
const currentYear = new Date().getFullYear()

const quickLinks = [
  { label: () => t('footer.home'), to: '/' },
  { label: () => t('footer.aboutUs'), to: '/about-us' },
  { label: () => t('footer.howItWorks'), to: '/how-to-use' },
  { label: () => t('footer.contactUs'), to: '/contact-us' },
]
</script>

<template>
  <footer class="relative w-full mt-auto overflow-hidden z-10">
    <!-- ── Main Footer ── -->
    <div class="bg-gradient-to-br from-[#00338a] via-[#002566] to-[#001a45] text-white">
      <!-- Decorative top accent line -->
      <div class="h-1 w-full bg-gradient-to-r from-secondary via-amber-400 to-secondary" />

      <!-- Background decorative elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-secondary/[0.04] rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 sm:pt-16 sm:pb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          <!-- ── Brand Section (4 cols) ── -->
          <div class="lg:col-span-4">
            <NuxtLink
              :to="localePath('/')"
              class="relative z-10 flex items-center shrink-0 min-h-[48px] outline-none select-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
              aria-label="AmTrans Logistics Homepage"
            >
              <img src="~/assets/logo-footer.png" fetchpriority="high" alt="AmTrans Logo" class="h-16" />
            </NuxtLink>

            <p class="text-sm text-slate-200 leading-relaxed max-w-xs mb-6">
              {{ t('footer.brandDescription') }}
            </p>

            <!-- Social Icons -->
            <div class="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/19PvZDK58u/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                class="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/20 flex items-center justify-center text-slate-200 hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/amtranss?vrfl=MTA3ZnpxMmtnbXBhbA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                class="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/20 flex items-center justify-center text-slate-200 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://t.me/+37498890233"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                class="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/20 flex items-center justify-center text-slate-200 hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href="https://wa.me/37498890233"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                class="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/20 flex items-center justify-center text-slate-200 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.59 1.981 14.119.957 11.5.957c-5.442 0-9.87 4.372-9.874 9.802-.001 1.73.461 3.413 1.34 4.906L1.93 21.03l5.525-1.454zm10.37-6.843c-.27-.135-1.597-.788-1.845-.878-.247-.09-.427-.135-.607.135-.18.27-.697.878-.854 1.058-.158.18-.315.202-.585.067-.27-.135-1.14-.42-2.172-1.34-.803-.717-1.345-1.603-1.502-1.873-.158-.27-.017-.417.118-.552.122-.121.27-.315.405-.473.135-.158.18-.27.27-.45.09-.18.045-.338-.022-.473-.068-.135-.607-1.463-.832-2.003-.22-.53-.44-.457-.607-.466-.157-.008-.337-.009-.517-.009-.18 0-.472.067-.719.338-.247.27-.944.923-.944 2.25s.967 2.61 1.102 2.79c.135.18 1.902 2.904 4.609 4.074.645.278 1.148.445 1.54.57.65.207 1.241.177 1.709.107.521-.078 1.597-.653 1.822-1.283.225-.63.225-1.17.157-1.283-.067-.113-.247-.203-.517-.338z" />
                </svg>
              </a>
            </div>
          </div>

          <!-- ── Quick Links (3 cols) ── -->
          <div class="lg:col-span-3">
            <h3 class="text-sm font-bold uppercase tracking-wider text-white/90 mb-5 flex items-center gap-2">
              <span class="w-5 h-0.5 bg-secondary rounded-full" />
              {{ t('footer.quickLinksTitle') }}
            </h3>
            <ul class="space-y-3">
              <li v-for="link in quickLinks" :key="link.to">
                <NuxtLink
                  :to="localePath(link.to)"
                  class="group inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md"
                >
                  <svg
                    class="w-3 h-3 text-secondary group-hover:translate-x-0.5 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{{ link.label() }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- ── Contact Info (3 cols) ── -->
          <div class="lg:col-span-3">
            <h3 class="text-sm font-bold uppercase tracking-wider text-white/90 mb-5 flex items-center gap-2">
              <span class="w-5 h-0.5 bg-secondary rounded-full" />
              {{ t('footer.contactTitle') }}
            </h3>
            <ul class="space-y-4">
              <!-- Phone -->
              <li>
                <a
                  href="tel:+37498890233"
                  class="group flex items-center gap-3 text-slate-200 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md"
                >
                  <div class="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 group-hover:border-secondary/30 transition-all duration-300 mt-0.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span class="text-sm leading-relaxed">{{ t('footer.phone') }}</span>
                </a>
              </li>
              <!-- Email -->
              <li>
                <a
                  href="mailto:amtransaircargo@gmail.com"
                  class="group flex items-center gap-3 text-slate-200 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md"
                >
                  <div class="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 group-hover:border-secondary/30 transition-all duration-300 mt-0.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span class="text-sm leading-relaxed break-all">{{ t('footer.email') }}</span>
                </a>
              </li>
              <!-- Address -->
              <li>
                <div class="group flex items-center gap-3 text-slate-200">
                  <div class="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span class="text-sm leading-relaxed">{{ t('footer.address') }}</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- ── Working Hours (2 cols) ── -->
          <div class="lg:col-span-2">
            <h3 class="text-sm font-bold uppercase tracking-wider text-white/90 mb-5 flex items-center gap-2">
              <span class="w-5 h-0.5 bg-secondary rounded-full" />
              {{ t('footer.workingHoursTitle') }}
            </h3>
            <div class="space-y-2.5 text-sm text-slate-200">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{{ t('footer.weekdays') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{{ t('footer.saturday') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>{{ t('footer.sunday') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Bottom Bar ── -->
      <div class="border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p class="text-xs text-slate-300 font-medium">
              {{ t('footer.copyright').replace('{year}', String(currentYear)) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
