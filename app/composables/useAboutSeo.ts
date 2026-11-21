import { computed, hasInjectionContext } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useHead, useSeoMeta } from '#imports'

export interface AboutOfferItem {
  name: string
  description: string
}

export interface AboutLocaleContent {
  title: string
  description: string
  keywords: string
  ogLocale: string
  alternateOgLocales: string[]
  ogImage: string
  ogImageAlt: string
  legalName: string
  services: AboutOfferItem[]
}

export const ABOUT_SEO_CONTENT: Record<'hy' | 'en' | 'ru', AboutLocaleContent> = {
  hy: {
    title: 'Մեր մասին — AmTrans Express Logistics',
    description: 'Իմացեք ավելին AmTrans-ի մասին՝ Ձեր վստահելի գործընկերը միջազգային ծանրոցների փոխադրման ոլորտում: Բացահայտեք մեր առաքելությունը, արժեքներն ու թափանցիկ սպասարկումը:',
    keywords: 'AmTrans մեր մասին, լոգիստիկ ընկերություն Հայաստանում, բեռնափոխադրման ընկերություն, հուսալի լոգիստիկա, ծանրոցների առաքում',
    ogLocale: 'hy_AM',
    alternateOgLocales: ['en_US', 'ru_RU'],
    ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1792777621/about-hero.jpg',
    ogImageAlt: 'AmTrans — Մեր Մասին | Լոգիստիկ Ընկերություն',
    legalName: '«ԱմՏրանս» ՍՊԸ',
    services: [
      {
        name: 'Ցամաքային Բեռնափոխադրումներ',
        description: 'Հուսալի և մատչելի ցամաքային ավտոբեռնափոխադրումներ միջազգային և տարածաշրջանային ուղղություններով:'
      },
      {
        name: 'Օդային Բեռնափոխադրումներ',
        description: 'Արագընթաց ավիափոխադրումներ շտապ, արժեքավոր և ժամանակատար բեռների համար աշխարհի ցանկացած կետից:'
      },
      {
        name: 'Հավաքական Բեռներ (LCL)',
        description: 'Տնտեսող համակցված բեռնափոխադրումներ փոքր և միջին ծավալի բեռների անվտանգ տեղափոխման համար:'
      },
      {
        name: 'Ծանրոցների Առաքում',
        description: 'Անհատական և կորպորատիվ փաթեթների էքսպրես առաքում մինչև ստացողի դուռը:'
      }
    ]
  },
  en: {
    title: 'About Us — AmTrans Express Logistics',
    description: 'Learn about AmTrans — your trusted partner for international parcel transportation. Discover our mission, values, and commitment to reliable, transparent delivery.',
    keywords: 'about AmTrans, logistics company Armenia, freight forwarding Armenia, reliable logistics, international parcel shipping',
    ogLocale: 'en_US',
    alternateOgLocales: ['hy_AM', 'ru_RU'],
    ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1792777621/about-hero.jpg',
    ogImageAlt: 'AmTrans — About Us | International Logistics',
    legalName: 'AmTrans LLC',
    services: [
      {
        name: 'Road Freight Forwarding',
        description: 'Reliable and cost-effective overland road transport across international and regional routes.'
      },
      {
        name: 'Air Cargo Services',
        description: 'High-speed air freight for time-sensitive, high-value consignments from worldwide origins.'
      },
      {
        name: 'Groupage & LCL Cargo',
        description: 'Economical consolidated freight shipping for secure small-to-medium volume shipments.'
      },
      {
        name: 'Parcel & Express Delivery',
        description: 'Express door-to-door courier delivery for personal and business parcels.'
      }
    ]
  },
  ru: {
    title: 'О нас — AmTrans Express Logistics',
    description: 'Узнайте больше об AmTrans — вашем надежном партнере по международной доставке посылок. Наша миссия, ценности и принципы надежной логистики.',
    keywords: 'о компании AmTrans, логистическая компания Армения, грузоперевозки Армения, надежная логистика, международная доставка посылок',
    ogLocale: 'ru_RU',
    alternateOgLocales: ['hy_AM', 'en_US'],
    ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1792777621/about-hero.jpg',
    ogImageAlt: 'AmTrans — О нас | Международные грузоперевозки',
    legalName: 'ООО «АмТранс»',
    services: [
      {
        name: 'Автомобильные грузоперевозки',
        description: 'Надежные и выгодные автоперевозки по международным и региональным маршрутам.'
      },
      {
        name: 'Авиаперевозки грузов',
        description: 'Скоростная доставка срочных, ценных и сборных грузов авиатранспортом по всему миру.'
      },
      {
        name: 'Сборные грузы (LCL)',
        description: 'Экономичная консолидированная перевозка для безопасной доставки небольших партий.'
      },
      {
        name: 'Доставка посылок',
        description: 'Экспресс-доставка индивидуальных и корпоративных посылок до двери получателя.'
      }
    ]
  }
}

export function useAboutSeo() {
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
    if (activeLocale.value === 'en') return 'https://amtrans.am/en/about-us'
    if (activeLocale.value === 'ru') return 'https://amtrans.am/ru/about-us'
    return 'https://amtrans.am/about-us'
  })

  // Localized SEO dictionary
  const currentContent = computed<AboutLocaleContent>(() => {
    return ABOUT_SEO_CONTENT[activeLocale.value] || ABOUT_SEO_CONTENT.hy
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
    ogImageType: 'image/jpeg',
    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterImageAlt
  })

  // ─── 2. Reactive Head configuration: htmlAttrs, alternates, canonical & JSON-LD ─
  const metaTags = computed(() => [
    {
      name: 'keywords',
      content: currentContent.value.keywords
    },
    ...currentContent.value.alternateOgLocales.map(altLocale => ({
      key: `og:locale:alternate:${altLocale}`,
      property: 'og:locale:alternate',
      content: altLocale
    })),
    {
      key: 'og:image:secure_url',
      property: 'og:image:secure_url',
      content: currentContent.value.ogImage
    }
  ])

  const links = computed(() => [
    {
      key: 'canonical',
      rel: 'canonical' as const,
      href: activeUrl.value
    },
    {
      key: 'hreflang-hy',
      rel: 'alternate' as const,
      hreflang: 'hy',
      href: 'https://amtrans.am/about-us'
    },
    {
      key: 'hreflang-en',
      rel: 'alternate' as const,
      hreflang: 'en',
      href: 'https://amtrans.am/en/about-us'
    },
    {
      key: 'hreflang-ru',
      rel: 'alternate' as const,
      hreflang: 'ru',
      href: 'https://amtrans.am/ru/about-us'
    },
    {
      key: 'hreflang-x-default',
      rel: 'alternate' as const,
      hreflang: 'x-default',
      href: 'https://amtrans.am/about-us'
    }
  ])

  // Google Schema.org Graph with AboutPage, Organization, CourierService, WebSite & BreadcrumbList
  const structuredData = computed(() => {
    const locale = activeLocale.value
    const pageUrl = activeUrl.value
    const homeUrl = locale === 'en' ? 'https://amtrans.am/en' : locale === 'ru' ? 'https://amtrans.am/ru' : 'https://amtrans.am/'
    const homeName = locale === 'hy' ? 'Գլխավոր' : locale === 'ru' ? 'Главная' : 'Home'
    const aboutName = locale === 'hy' ? 'Մեր մասին' : locale === 'ru' ? 'О нас' : 'About Us'
    const catalogName = locale === 'hy' ? 'Բեռնափոխադրման Ծառայություններ' : locale === 'ru' ? 'Логистические услуги' : 'Freight & Logistics Services'

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title.value,
          description: description.value,
          inLanguage: locale,
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://amtrans.am/#website',
            name: 'AmTrans',
            url: 'https://amtrans.am/'
          },
          about: {
            '@id': 'https://amtrans.am/#organization'
          },
          breadcrumb: {
            '@id': `${pageUrl}#breadcrumb`
          }
        },
        {
          '@type': ['Organization', 'CourierService'],
          '@id': 'https://amtrans.am/#organization',
          name: 'AmTrans',
          legalName: currentContent.value.legalName,
          alternateName: ['ԱմՏրանս', 'AmTrans', 'АмТранс'],
          url: 'https://amtrans.am/',
          logo: 'https://amtrans.am/logo.webp',
          image: currentContent.value.ogImage,
          telephone: '+374 10 000000',
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
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['Armenian', 'English', 'Russian']
          },
          areaServed: ['AM', 'US', 'RU', 'EU'],
          availableLanguage: ['Armenian', 'English', 'Russian'],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: catalogName,
            itemListElement: currentContent.value.services.map(svc => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: svc.name,
                description: svc.description
              }
            }))
          }
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
              name: aboutName,
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
      key: 'about-jsonld',
      type: 'application/ld+json' as const,
      innerHTML: JSON.stringify(structuredData.value).replace(/</g, '\\u003c')
    }
  ])

  // Pass reactive properties into useHead:
  // - htmlAttrs properties can be reactive refs (lang: activeLocale)
  // - meta, link, script can be computed arrays
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
