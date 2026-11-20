import { computed, hasInjectionContext } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useHead, useSeoMeta } from '#imports'

export interface HomeFaqItem {
  question: string
  answer: string
}

export interface LocaleContent {
  title: string
  description: string
  keywords: string
  ogLocale: string
  alternateOgLocales: string[]
  ogImage: string
  ogImageAlt: string
  faqs: HomeFaqItem[]
}

export const SEO_CONTENT: Record<'hy' | 'en' | 'ru', LocaleContent> = {
  hy: {
    title: 'AmTrans — Միջազգային բեռնափոխադրումներ և ծանրոցների առաքում Հայաստան',
    description: 'Արագ և ապահով միջազգային բեռնափոխադրումներ, ծանրոցների և բեռների առաքում դեպի Հայաստան և արտերկիր։ Առցանց գնի հաշվիչ, QR հետևում և մատչելի սակագներ AmTrans-ի հետ։',
    keywords: 'բեռնափոխադրումներ, միջազգային բեռնափոխադրումներ, ծանրոցների առաքում Հայաստան, լոգիստիկ ծառայություններ, օդային բեռնափոխադրումներ, ցամաքային բեռնափոխադրումներ, բեռի առցանց հաշվիչ, QR հետևում, AmTrans',
    ogLocale: 'hy_AM',
    alternateOgLocales: ['en_US', 'ru_RU'],
    ogImage: 'https://amtrans.am/og-image-hy.jpg',
    ogImageAlt: 'AmTrans — Միջազգային բեռնափոխադրումներ և ծանրոցների առաքում',
    faqs: [
      {
        question: 'Որքա՞ն է տևում միջազգային առաքումը:',
        answer: 'Առաքման տևողությունը սովորաբար 5-ից 9 աշխատանքային օր է՝ կախված մեկնման երկրից և մաքսային ձևակերպումներից:'
      },
      {
        question: 'Ինչպե՞ս կարող եմ հետևել իմ ծանրոցին:',
        answer: 'Դուք կարող եք իրական ժամանակում հետևել Ձեր ծանրոցների կարգավիճակին AmTrans-ի անձնական էջում:'
      },
      {
        question: 'Կարո՞ղ եմ ինքնուրույն վերցնել ծանրոցը:',
        answer: 'Այո, կարող եք մոտենալ Ձեր նախընտրած AmTrans մասնաճյուղ աշխատանքային ժամերին կամ պատվիրել առաքում մինչև Ձեր հասցեն:'
      },
      {
        question: 'Ինչպե՞ս է հաշվարկվում առաքման արժեքը:',
        answer: 'Հաշվարկն իրականացվում է ըստ իրական կամ ծավալային քաշի՝ համաձայն հստակ սակագների, առանց որևէ թաքնված վճարների:'
      }
    ]
  },
  en: {
    title: 'AmTrans — International Cargo & Parcel Shipping to and from Armenia',
    description: 'Fast, reliable international freight, cargo, and parcel delivery to and from Armenia. Calculate shipping costs online, track parcels with QR codes, and ship worldwide with AmTrans.',
    keywords: 'international cargo Armenia, parcel shipping Armenia, freight forwarding, air freight, road transport, shipping cost calculator, QR parcel tracking, AmTrans',
    ogLocale: 'en_US',
    alternateOgLocales: ['hy_AM', 'ru_RU'],
    ogImage: 'https://amtrans.am/og-image-en.jpg',
    ogImageAlt: 'AmTrans — International Cargo & Parcel Shipping',
    faqs: [
      {
        question: 'How long does international delivery take?',
        answer: 'Delivery times typically range between 5 to 9 business days depending on origin country and customs clearance. Express options are also available.'
      },
      {
        question: 'How do I track my incoming package?',
        answer: 'Log in to your AmTrans account to view live tracking updates, warehouse arrival notifications, and customs status in real time.'
      },
      {
        question: 'Can I pick up my parcels in person?',
        answer: 'Yes! You can pick up shipments at any of our designated local branch offices during working hours, or choose door-to-door delivery.'
      },
      {
        question: 'How are delivery charges calculated?',
        answer: 'Pricing is calculated based on parcel weight and volumetric dimensions according to our transparent route tariffs, with zero hidden surcharges.'
      }
    ]
  },
  ru: {
    title: 'AmTrans — Международные грузоперевозки и доставка посылок в Армению',
    description: 'Быстрые и надежные международные грузоперевозки, доставка посылок и грузов в Армению и за рубеж. Онлайн-калькулятор стоимости, QR-отслеживание и выгодные тарифы от AmTrans.',
    keywords: 'международные грузоперевозки Армения, доставка посылок Армения, логистика, авиаперевозки, автоперевозки, калькулятор доставки, отслеживание посылок QR, AmTrans',
    ogLocale: 'ru_RU',
    alternateOgLocales: ['hy_AM', 'en_US'],
    ogImage: 'https://amtrans.am/og-image-ru.jpg',
    ogImageAlt: 'AmTrans — Международные грузоперевозки',
    faqs: [
      {
        question: 'Сколько длится доставка посылки?',
        answer: 'Сроки доставки обычно составляют от 5 до 9 рабочих дней в зависимости от страны отправления и таможенных процедур.'
      },
      {
        question: 'Как отследить статус отправления?',
        answer: 'Вы можете отслеживать статус вашей посылки в реальном времени в личном кабинете AmTrans по присвоенному номеру отслеживания.'
      },
      {
        question: 'Можно ли забрать посылку самостоятельно?',
        answer: 'Да, вы можете получить отправление в любом удобном филиале AmTrans в рабочие часы либо заказать доставку курьером до двери.'
      },
      {
        question: 'Как рассчитывается стоимость перевозки?',
        answer: 'Расчет производится по фактическому или объемному весу согласно прозрачным тарифам маршрута, без скрытых комиссий.'
      }
    ]
  }
}

export function useHomeSeo() {
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

  // Canonical base URL for active locale
  const activeUrl = computed<string>(() => {
    if (activeLocale.value === 'en') return 'https://amtrans.am/en'
    if (activeLocale.value === 'ru') return 'https://amtrans.am/ru'
    return 'https://amtrans.am/'
  })

  // Localized SEO dictionary
  const currentContent = computed<LocaleContent>(() => {
    return SEO_CONTENT[activeLocale.value] || SEO_CONTENT.hy
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
      href: 'https://amtrans.am/'
    },
    {
      key: 'hreflang-en',
      rel: 'alternate' as const,
      hreflang: 'en',
      href: 'https://amtrans.am/en'
    },
    {
      key: 'hreflang-ru',
      rel: 'alternate' as const,
      hreflang: 'ru',
      href: 'https://amtrans.am/ru'
    },
    {
      key: 'hreflang-x-default',
      rel: 'alternate' as const,
      hreflang: 'x-default',
      href: 'https://amtrans.am/'
    }
  ])

  // Google Schema.org Graph with Organization, CourierService, WebSite, WebPage & FAQPage
  const structuredData = computed(() => {
    const locale = activeLocale.value
    const pageUrl = activeUrl.value
    const homeName = locale === 'hy' ? 'Գլխավոր' : locale === 'ru' ? 'Главная' : 'Home'

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'CourierService'],
          '@id': 'https://amtrans.am/#organization',
          name: 'AmTrans',
          url: 'https://amtrans.am/',
          logo: 'https://amtrans.am/logo.webp',
          image: 'https://amtrans.am/og-image-hy.jpg',
          description: currentContent.value.description,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Tigran Mets Ave',
            addressLocality: 'Yerevan',
            addressCountry: 'AM'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['Armenian', 'English', 'Russian']
          },
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
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title.value,
          description: description.value,
          inLanguage: locale,
          isPartOf: {
            '@id': 'https://amtrans.am/#website'
          },
          about: {
            '@id': 'https://amtrans.am/#organization'
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: homeName,
                item: pageUrl
              }
            ]
          }
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          isPartOf: {
            '@id': `${pageUrl}#webpage`
          },
          mainEntity: currentContent.value.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        }
      ]
    }
  })

  // Safe JSON-LD script (protects against premature tag closure while remaining standard JSON-LD)
  const scripts = computed(() => [
    {
      key: 'home-jsonld',
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
    currentContent,
    faqs: computed(() => currentContent.value.faqs)
  }
}
