import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

export interface LocaleOption {
  code: 'ru' | 'en' | 'hy'
  name: string
  short: string
  flag: string
}

export const LOCALES: LocaleOption[] = [
  {
    code: 'ru',
    name: 'Русский',
    short: 'Рус',
    flag: `<svg viewBox="0 0 32 32" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="circleClipRu"><circle cx="16" cy="16" r="16"/></clipPath></defs>
  <g clip-path="url(#circleClipRu)">
    <rect width="32" height="10.67" y="0" fill="#FFFFFF"/>
    <rect width="32" height="10.67" y="10.67" fill="#0052B4"/>
    <rect width="32" height="10.66" y="21.34" fill="#D80027"/>
  </g>
</svg>`,
  },
  {
    code: 'en',
    name: 'English',
    short: 'Eng',
    flag: `<svg viewBox="0 0 32 32" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="circleClipEn"><circle cx="16" cy="16" r="16"/></clipPath></defs>
  <g clip-path="url(#circleClipEn)">
    <rect width="32" height="32" fill="#012169"/>
    <path fill="#FFFFFF" d="M0 0 32 32h-4.5L0 4.5V0z"/>
    <path fill="#FFFFFF" d="M32 0 0 32h4.5L32 4.5V0z"/>
    <rect x="13.5" width="5" height="32" fill="#FFFFFF"/>
    <rect y="13.5" width="32" height="5" fill="#FFFFFF"/>
    <path fill="#C8102E" d="M0 0 32 32h-2.2L0 2.2V0z"/>
    <path fill="#C8102E" d="M32 0 0 32h2.2L32 2.2V0z"/>
    <rect x="14.7" width="2.6" height="32" fill="#C8102E"/>
    <rect y="14.7" width="32" height="2.6" fill="#C8102E"/>
  </g>
</svg>`,
  },
  {
    code: 'hy',
    name: 'Հայերեն',
    short: 'Հայ',
    flag: `<svg viewBox="0 0 32 32" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="circleClipHy"><circle cx="16" cy="16" r="16"/></clipPath></defs>
  <g clip-path="url(#circleClipHy)">
    <rect width="32" height="10.67" y="0" fill="#D80027"/>
    <rect width="32" height="10.67" y="10.67" fill="#0052B4"/>
    <rect width="32" height="10.66" y="21.34" fill="#F08E00"/>
  </g>
</svg>`,
  },
]

export function useLanguage() {
  const { currentLanguage, setLanguage } = useI18n()

  const isOpen = ref(false)
  const menuRef = ref<HTMLElement | null>(null)

  const currentLocale = computed(
    () => LOCALES.find((l) => l.code === currentLanguage.value) ?? LOCALES[0],
  )

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const select = (code: LocaleOption['code']) => {
    setLanguage(code)
    isOpen.value = false
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
      isOpen.value = false
    }
  }

  onMounted(() => window.addEventListener('click', handleClickOutside))
  onUnmounted(() => window.removeEventListener('click', handleClickOutside))

  return {
    locales: LOCALES,
    currentLocale,
    currentLanguage,
    isOpen,
    menuRef,
    toggle,
    select,
  }
}
