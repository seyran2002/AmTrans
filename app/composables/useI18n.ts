import { ref, computed, hasInjectionContext } from 'vue'
import { useRoute } from 'vue-router'
import hy from '../../i18n/locales/hy.json'
import en from '../../i18n/locales/en.json'
import ru from '../../i18n/locales/ru.json'

export type SupportedLanguage = 'hy' | 'en' | 'ru'

export interface LanguageOption {
  code: SupportedLanguage
  label: string
  flag: string
  nativeName: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hy', label: 'Armenian', flag: '🇦🇲', nativeName: 'Հայերեն' },
  { code: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺', nativeName: 'Русский' }
]

const translations: Record<SupportedLanguage, Record<string, any>> = {
  hy,
  en,
  ru
}

function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const parts = path.split('.')
  let current: any = obj
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return undefined
    }
  }
  return typeof current === 'string' ? current : undefined
}

const currentLanguage = ref<SupportedLanguage>('hy')

export function useI18n() {
  let route: any = null
  if (hasInjectionContext()) {
    try {
      route = useRoute()
    } catch {
      // outside Nuxt/Vue setup
    }
  }

  const activeLang = computed<SupportedLanguage>({
    get: () => {
      const path = route?.path || ''
      if (path === '/en' || path.startsWith('/en/')) return 'en'
      if (path === '/ru' || path.startsWith('/ru/')) return 'ru'
      return currentLanguage.value || 'hy'
    },
    set: (lang: SupportedLanguage) => {
      currentLanguage.value = lang
    }
  })

  const setLanguage = (lang: SupportedLanguage) => {
    currentLanguage.value = lang
  }

  const t = (key: string): string => {
    const lang = activeLang.value || currentLanguage.value || 'hy'
    const langDict = translations[lang] || translations.hy
    const val = getNestedValue(langDict, key) ?? getNestedValue(translations.hy, key)
    return val ?? key
  }

  return {
    currentLanguage: activeLang,
    setLanguage,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES
  }
}
