import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '~/composables/useI18n'

export interface NavLink {
  labelKey: string
  to: string
  icon: string
  ariaLabel: string
}

const NAV_LINKS: NavLink[] = [
  { labelKey: 'nav.home',      to: '/',            icon: 'home',                    ariaLabel: 'Home' },
  { labelKey: 'nav.howToUse', to: '/how-to-use',  icon: 'book_open',               ariaLabel: 'How to Use' },
  { labelKey: 'nav.aboutUs',  to: '/about-us',    icon: 'users',                   ariaLabel: 'About Us' },
  { labelKey: 'nav.contactUs', to: '/contact-us', icon: 'envelope',                ariaLabel: 'Contact Us' },
  { labelKey: 'nav.login',    to: '/auth/login',  icon: 'arrow_right_on_rectangle', ariaLabel: 'Log in' },
]

export function useNavLinks() {
  const route = useRoute()
  const { t } = useI18n()

  /** All 5 links including login — used by the mobile tab bar */
  const allLinks = computed(() =>
    NAV_LINKS.map((link) => ({
      ...link,
      label: t(link.labelKey),
      isActive: route.path === link.to,
    })),
  )

  /** First 4 links — used by the desktop nav (no login pill needed here) */
  const navLinks = computed(() => allLinks.value.slice(0, 4))

  return {
    allLinks,
    navLinks,
  }
}
