<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

// Computed real-time open status (Armenia local time: UTC+4)
const isCurrentlyOpen = computed(() => {
  const now = new Date()
  // Armenia is UTC+4
  const utcHours = now.getUTCHours()
  const utcDay = now.getUTCDay() // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const armeniaHour = (utcHours + 4) % 24

  // Mon (1) - Fri (5): 09:00 - 19:00
  if (utcDay >= 1 && utcDay <= 5) {
    return armeniaHour >= 9 && armeniaHour < 19
  }
  // Sat (6): 10:00 - 16:00
  if (utcDay === 6) {
    return armeniaHour >= 10 && armeniaHour < 16
  }
  // Sun (0): Closed
  return false
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
    <!-- ── Card 1: Phone Support ── -->
    <div
      class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
    >
      <div
        class="absolute -top-10 -right-10 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none"
      />

      <div>
        <div
          class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>

        <h3 class="text-base font-bold text-slate-900 mb-1">
          {{ t('contact.cards.phoneTitle') }}
        </h3>
        <p class="text-xs text-slate-500 mb-3 leading-relaxed">
          {{ t('contact.cards.phoneDesc') }}
        </p>

        <a
          href="tel:+37410555123"
          class="text-sm sm:text-base font-extrabold text-primary hover:text-primary-dark transition-colors tracking-tight block select-all"
        >
          {{ t('contact.cards.phoneValue') }}
        </a>
      </div>

      <div class="mt-5 pt-4 border-t border-slate-100">
        <a
          href="tel:+37410555123"
          class="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-secondary-hover transition-colors group-hover:translate-x-0.5 duration-200"
        >
          <span>{{ t('contact.cards.phoneAction') }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>

    <!-- ── Card 2: Email Inquiries ── -->
    <div
      class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between"
    >
      <div
        class="absolute -top-10 -right-10 w-28 h-28 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/15 transition-colors pointer-events-none"
      />

      <div>
        <div
          class="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h3 class="text-base font-bold text-slate-900 mb-1">
          {{ t('contact.cards.emailTitle') }}
        </h3>
        <p class="text-xs text-slate-500 mb-3 leading-relaxed">
          {{ t('contact.cards.emailDesc') }}
        </p>

        <a
          href="mailto:amtransaircargo@gmail.com"
          class="text-sm sm:text-base font-extrabold text-slate-800 hover:text-secondary transition-colors tracking-tight block select-all break-all"
        >
          {{ t('contact.cards.emailValue') }}
        </a>
      </div>

      <div class="mt-5 pt-4 border-t border-slate-100">
        <a
          href="mailto:amtransaircargo@gmail.com"
          class="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-secondary-hover transition-colors group-hover:translate-x-0.5 duration-200"
        >
          <span>{{ t('contact.cards.emailAction') }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>

    <!-- ── Card 3: Connect With Us (Social & Messengers) ── -->
    <div
      class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-violet-400/30 transition-all duration-300 flex flex-col justify-between"
    >
      <div
        class="absolute -top-10 -right-10 w-28 h-28 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/10 transition-colors pointer-events-none"
      />

      <div>
        <div
          class="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shadow-sm"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
        </div>

        <h3 class="text-base font-bold text-slate-900 mb-1">
          {{ t('contact.cards.socialTitle') }}
        </h3>
        <p class="text-xs text-slate-500 mb-4 leading-relaxed">
          {{ t('contact.cards.socialDesc') }}
        </p>

        <!-- Social / Messenger Icons -->
        <div class="flex items-center gap-2.5">
          <!-- Telegram -->
          <a
            href="https://t.me/+37498890233"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>
          <!-- WhatsApp -->
          <a
            href="https://wa.me/37498890233"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.59 1.981 14.119.957 11.5.957c-5.442 0-9.87 4.372-9.874 9.802-.001 1.73.461 3.413 1.34 4.906L1.93 21.03l5.525-1.454zm10.37-6.843c-.27-.135-1.597-.788-1.845-.878-.247-.09-.427-.135-.607.135-.18.27-.697.878-.854 1.058-.158.18-.315.202-.585.067-.27-.135-1.14-.42-2.172-1.34-.803-.717-1.345-1.603-1.502-1.873-.158-.27-.017-.417.118-.552.122-.121.27-.315.405-.473.135-.158.18-.27.27-.45.09-.18.045-.338-.022-.473-.068-.135-.607-1.463-.832-2.003-.22-.53-.44-.457-.607-.466-.157-.008-.337-.009-.517-.009-.18 0-.472.067-.719.338-.247.27-.944.923-.944 2.25s.967 2.61 1.102 2.79c.135.18 1.902 2.904 4.609 4.074.645.278 1.148.445 1.54.57.65.207 1.241.177 1.709.107.521-.078 1.597-.653 1.822-1.283.225-.63.225-1.17.157-1.283-.067-.113-.247-.203-.517-.338z" />
            </svg>
          </a>
          <!-- Instagram -->
          <a
            href="https://www.instagram.com/amtranss?vrfl=MTA3ZnpxMmtnbXBhbA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <!-- Facebook -->
          <a
            href="https://www.facebook.com/share/19PvZDK58u/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
      </div>

      <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>{{ t('contact.cards.socialFooter') }}</span>
        <div class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span class="text-emerald-600 font-bold">Online</span>
        </div>
      </div>
    </div>

    <!-- ── Card 4: Working Hours ── -->
    <div
      class="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
    >
      <div
        class="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"
      />

      <div>
        <div class="flex items-center justify-between mb-5">
          <div
            class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Real-time badge -->
          <span
            :class="[
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border',
              isCurrentlyOpen
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            ]"
          >
            <span
              :class="[
                'w-1.5 h-1.5 rounded-full',
                isCurrentlyOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              ]"
            />
            {{ isCurrentlyOpen ? t('contact.cards.statusOpen') : t('contact.cards.statusClosed') }}
          </span>
        </div>

        <h3 class="text-base font-bold text-slate-900 mb-1">
          {{ t('contact.cards.hoursTitle') }}
        </h3>
        <p class="text-xs text-slate-500 mb-3 leading-relaxed">
          {{ t('contact.cards.hoursDesc') }}
        </p>

        <div class="space-y-1 text-xs sm:text-xs text-slate-600 font-medium">
          <p class="font-bold text-slate-800">{{ t('contact.cards.hoursWeekdays') }}</p>
          <p>{{ t('contact.cards.hoursSaturday') }}</p>
          <p class="text-slate-400">{{ t('contact.cards.hoursSunday') }}</p>
        </div>
      </div>

      <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>Yerevan GMT+4</span>
        <span class="text-emerald-600 font-bold">AmTrans Express</span>
      </div>
    </div>
  </div>
</template>
