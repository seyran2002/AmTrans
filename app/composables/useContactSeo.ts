import { computed, hasInjectionContext } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useHead, useSeoMeta } from '#imports'

export interface ContactLocaleContent {
  title: string
  description: string
  keywords: string
  ogLocale: string
  alternateOgLocales: string[]
  ogImage: string
  ogImageAlt: string
  legalName: string
}

export const CONTACT_SEO_CONTENT: Record<'hy' | 'en' | 'ru', ContactLocaleContent> = {
  hy: {
    title: 'Կապ — AmTrans Express Logistics',
    description: 'Կապ հաստատեք AmTrans Express Logistics-ի հետ: Հեռախոսազանգ, էլ. փոստ, կապի ձևաթուղթ կամ այցելեք մեր տարածքային մասնաճյուղեր:',
    keywords: 'AmTrans կապ, հետադարձ կապ, լոգիստիկ ընկերություն հեռախոս, առաքման ծառայություն կապ, ծանրոցների առաքում Երևան',
    ogLocale: 'hy_AM',
    alternateOgLocales: ['en_US', 'ru_RU'],
    ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1790515541/home_hero.webp',
    ogImageAlt: 'AmTrans Express Logistics — Հետադարձ Կապ',
    legalName: '«ԱմՏրանս» ՍՊԸ'
  },
  en: {
    title: 'Contact Us — AmTrans Express Logistics',
    description: 'Get in touch with AmTrans Express Logistics. Reach out via phone, email, direct contact form, or visit our local branches.',
    keywords: 'contact AmTrans, logistics company contact, freight forwarding phone, parcel delivery customer service Armenia',
    ogLocale: 'en_US',
    alternateOgLocales: ['hy_AM', 'ru_RU'],
    ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1790515541/home_hero.webp',
    ogImageAlt: 'AmTrans Express Logistics — Contact Us',
    legalName: 'AmTrans LLC'
  },
  ru: {
    title: 'Контакты — AmTrans Express Logistics',
    description: 'Свяжитесь с AmTrans Express Logistics: телефон, электронная почта, форма обратной связи или посетите наши региональные отделения.',
    keywords: 'контакты AmTrans, телефон логистической компании, служба поддержки доставки Армения, международные перевозки контакты',
    ogLocale: 'ru_RU',
    alternateOgLocales: ['hy_AM', 'en_US'],
    ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1790515541/home_hero.webp',
    ogImageAlt: 'AmTrans Express Logistics — Контакты',
    legalName: 'ООО «АмТранс»'
  }
}

export function useContactSeo() {
  let route: RouteLocationNormalizedLoaded | null = null
  if (hasInjectionContext()) {
    try {
      route = useRoute()
    } catch {
      // outside Nuxt / Vue setup
    }
  }

  // Active locale derived reactively from current route path
  const activeLocale = computed<'hy' | 'en' | 'ru'>(() => {
    const path = route?.path || ''
    if (path === '/en' || path.startsWith('/en/')) return 'en'
    if (path === '/ru' || path.startsWith('/ru/')) return 'ru'
    return 'hy'
  })

  // Canonical base URL for active locale (matching sitemap and i18n prefix_except_default)
  const activeUrl = computed<string>(() => {
    if (activeLocale.value === 'en') return 'https://amtrans.am/en/contact-us'
    if (activeLocale.value === 'ru') return 'https://amtrans.am/ru/contact-us'
    return 'https://amtrans.am/contact-us'
  })

  // Localized SEO dictionary
  const currentContent = computed<ContactLocaleContent>(() => {
    return CONTACT_SEO_CONTENT[activeLocale.value] || CONTACT_SEO_CONTENT.hy
  })

  // ─── 1. Reactive computed refs for useSeoMeta (Devalue-safe & SSR reactive) ─
  const title = computed(() => currentContent.value.title)
  const description = computed(() => currentContent.value.description)
  const ogLocale = computed(() => currentContent.value.ogLocale)
  const ogUrl = computed(() => activeUrl.value)
  const ogImage = computed(() => currentContent.value.ogImage)
  const ogImageAlt = computed(() => currentContent.value.ogImageAlt)
  const twitterTitle = computed(() => currentContent.value.title)
  const twitterDescription = computed(() => currentContent.value.description)
  const twitterImage = computed(() => currentContent.value.ogImage)
  const twitterImageAlt = computed(() => currentContent.value.ogImageAlt)

  useSeoMeta({
    title,
    description,
    author: 'AmTrans',
    creator: 'AmTrans',
    publisher: 'https://amtrans.am',
    applicationName: 'AmTrans',
    themeColor: '#00338a',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    // Open Graph
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogSiteName: 'AmTrans',
    ogLocale,
    ogUrl,
    ogImage,
    ogImageAlt,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/webp',
    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterImageAlt
  })

  // ─── 2. Canonical & Hreflang Alternates (Strict Multi-language SEO) ────────
  const links = computed(() => {
    const canonicalHref = activeUrl.value
    return [
      {
        key: 'canonical',
        rel: 'canonical' as const,
        href: canonicalHref
      },
      {
        key: 'hreflang-hy',
        rel: 'alternate' as const,
        hreflang: 'hy',
        href: 'https://amtrans.am/contact-us'
      },
      {
        key: 'hreflang-en',
        rel: 'alternate' as const,
        hreflang: 'en',
        href: 'https://amtrans.am/en/contact-us'
      },
      {
        key: 'hreflang-ru',
        rel: 'alternate' as const,
        hreflang: 'ru',
        href: 'https://amtrans.am/ru/contact-us'
      },
      {
        key: 'hreflang-x-default',
        rel: 'alternate' as const,
        hreflang: 'x-default',
        href: 'https://amtrans.am/contact-us'
      }
    ]
  })

  // ─── 3. Additional Meta Tags ──────────────────────────────────────────────
  const metaTags = computed(() => [
    {
      name: 'keywords',
      content: currentContent.value.keywords
    },
    ...currentContent.value.alternateOgLocales.map((altLocale) => ({
      key: `og:locale:alternate:${altLocale}`,
      property: 'og:locale:alternate',
      content: altLocale
    })),
    {
      key: 'og-image-secure',
      property: 'og:image:secure_url',
      content: currentContent.value.ogImage
    }
  ])

  // ─── 4. Schema.org JSON-LD Structured Data (ContactPage & Organization) ──
  const structuredData = computed(() => {
    const locale = activeLocale.value
    const pageUrl = activeUrl.value
    const homeUrl = locale === 'hy' ? 'https://amtrans.am/' : `https://amtrans.am/${locale}`
    const homeName = locale === 'hy' ? 'Գլխավոր' : locale === 'ru' ? 'Главная' : 'Home'
    const contactName = locale === 'hy' ? 'Կապ' : locale === 'ru' ? 'Контакты' : 'Contact Us'

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: currentContent.value.title,
          description: currentContent.value.description,
          inLanguage: locale,
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://amtrans.am/#website'
          },
          about: {
            '@id': 'https://amtrans.am/#organization'
          },
          mainEntity: {
            '@id': 'https://amtrans.am/#organization'
          },
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`
          }
        },
        {
          '@type': ['Organization', 'CourierService', 'LocalBusiness'],
          '@id': 'https://amtrans.am/#organization',
          name: 'AmTrans',
          legalName: currentContent.value.legalName,
          alternateName: ['ԱմՏրանս', 'AmTrans', 'АмТранс'],
          url: 'https://amtrans.am/',
          logo: 'https://amtrans.am/logo.webp',
          image: currentContent.value.ogImage,
          telephone: '+374 98 890-233',
          email: 'amtransaircargo@gmail.com',
          priceRange: '֏֏',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Tigran Mets Ave',
            addressLocality: 'Yerevan',
            postalCode: '0018',
            addressCountry: 'AM'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 40.1792,
            longitude: 44.4991
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '19:00'
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Saturday',
              opens: '10:00',
              closes: '16:00'
            }
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+374 98 890-233',
            contactType: 'customer service',
            email: 'amtransaircargo@gmail.com',
            availableLanguage: ['Armenian', 'English', 'Russian'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '19:00'
            }
          },
          sameAs: [
            'https://www.facebook.com/share/19PvZDK58u/?mibextid=wwXIfr',
            'https://www.instagram.com/amtranss?vrfl=MTA3ZnpxMmtnbXBhbA%3D%3D&utm_source=qr',
            'https://t.me/+37498890233',
            'https://wa.me/37498890233'
          ],
          areaServed: ['AM', 'US', 'RU', 'EU'],
          availableLanguage: ['Armenian', 'English', 'Russian']
        },
        {
          '@type': 'WebSite',
          '@id': 'https://amtrans.am/#website',
          url: 'https://amtrans.am/',
          name: 'AmTrans',
          publisher: {
            '@id': 'https://amtrans.am/#organization'
          },
          inLanguage: locale
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: homeName,
              item: homeUrl
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: contactName,
              item: pageUrl
            }
          ]
        }
      ]
    }
  })

  // Safe JSON-LD script (protects against premature tag closure while remaining standard JSON-LD)
  const scripts = computed(() => [
    {
      key: 'contact-jsonld',
      type: 'application/ld+json' as const,
      innerHTML: JSON.stringify(structuredData.value).replace(/</g, '\\u003c')
    }
  ])

  // Pass reactive properties into useHead:
  useHead({
    htmlAttrs: {
      lang: activeLocale,
      dir: 'ltr'
    },
    meta: metaTags,
    link: links,
    script: scripts
  })

  return {
    activeLocale,
    activeUrl,
    title,
    description,
    keywords: computed(() => currentContent.value.keywords),
    currentContent
  }
}
