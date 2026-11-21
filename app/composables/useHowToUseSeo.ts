import { computed, hasInjectionContext } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useHead, useSeoMeta } from '#imports'

export interface HowToStepItem {
  id: string
  name: string
  text: string
}

export interface HowToUseLocaleContent {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogLocale: string
  alternateOgLocales: string[]
  ogImage: string
  ogImageAlt: string
  legalName: string
  steps: HowToStepItem[]
}

export const HOW_TO_USE_SEO_CONTENT: Record<'hy' | 'en' | 'ru', HowToUseLocaleContent> = {
  hy: {
    title: 'AmTrans-ով առաքման ուղեցույց - Օգտատիրոջ ամբողջական ձեռնարկ',
    description: 'Մանրամասն ուղեցույց AmTrans-ով առաքումների համար. գրանցում, անձնագրային տվյալների հաստատում, արտերկրյա պահեստների հասցեներ, պատվերի նախնական գրանցում, առաքման արժեքի հաշվարկ, հետևում և QR կոդով ստացում:',
    keywords: 'AmTrans ուղեցույց, բեռնափոխադրման ուղեցույց, ինչպես պատվիրել, ծանրոցների հետևում, առաքման սակագներ, Հայաստան առաքում',
    ogTitle: 'AmTrans-ով առաքման ուղեցույց - Օգտատիրոջ ամբողջական ձեռնարկ',
    ogDescription: 'Իմացեք, թե ինչպես կատարել միջազգային առաքումներ դեպի Հայաստան AmTrans լոգիստիկ հարթակի միջոցով:',
    ogLocale: 'hy_AM',
    alternateOgLocales: ['en_US', 'ru_RU'],
    ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1790515541/home_hero.webp',
    ogImageAlt: 'AmTrans — Օգտագործողի ամբողջական ուղեցույց',
    legalName: '«ԱմՏրանս» ՍՊԸ',
    steps: [
      {
        id: 'chapter-01',
        name: 'Ինչպես սկսել AmTrans-ի հետ',
        text: 'Գրանցում, էլ. հասցեի հաստատում և առաջին մուտքը վահանակ:'
      },
      {
        id: 'chapter-02',
        name: 'Կարգավորեք ձեր հաշիվը և պրոֆիլը',
        text: 'Պրոֆիլի տվյալներ, անձը հաստատող փաստաթղթեր և սուբյեկտի տեսակ:'
      },
      {
        id: 'chapter-03',
        name: 'Կառավարեք հասցեները և ստացողներին',
        text: 'Արտերկրյա պահեստների հասցեներ և լիազորված ստացողներ:'
      },
      {
        id: 'chapter-04',
        name: 'Գրանցեք առաքման պատվերը',
        text: 'Նախնական հայտարարագրում, ապրանքի չափսեր, կշիռ և հաշիվ-ապրանքագրեր:'
      },
      {
        id: 'chapter-05',
        name: 'Հասկացեք առաքման արժեքը և սակագները',
        text: 'Սակագներ, ծավալային կշիռ, 5 կգ նվազագույն քաղաքականություն և նախահաշիվներ:'
      },
      {
        id: 'chapter-06',
        name: 'Հետևեք ձեր ծանրոցին և իմացեք կարգավիճակները',
        text: '10 կարգավիճակների փուլերը, ժամանակացույցը և հետևման կոդերը:'
      },
      {
        id: 'chapter-07',
        name: 'Ստացեք ձեր ծանրոցը և ստացման QR կոդը',
        text: 'Պատրաստ է ստացման, ակնթարթային QR ստուգում, գրասենյակներ և աջակցություն:'
      }
    ]
  },
  en: {
    title: 'Your Guide to Shipping with AmTrans - Complete Customer Tutorial',
    description: 'Comprehensive guide to shipping with AmTrans: account registration, customs verification, warehouse addresses, order pre-registration, shipping cost calculations, live tracking, and digital QR package pickup.',
    keywords: 'how to use AmTrans, AmTrans shipping guide, parcel forwarding Armenia, international delivery tutorial, track parcel Armenia, shipping cost calculator',
    ogTitle: 'Your Guide to Shipping with AmTrans - Complete Customer Tutorial',
    ogDescription: 'Learn how to ship packages internationally to Armenia with AmTrans logistics platform.',
    ogLocale: 'en_US',
    alternateOgLocales: ['hy_AM', 'ru_RU'],
    ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1790515541/home_hero.webp',
    ogImageAlt: 'AmTrans — Complete User Guide & Shipping Tutorial',
    legalName: 'AmTrans LLC',
    steps: [
      {
        id: 'chapter-01',
        name: 'Getting Started with AmTrans',
        text: 'Registration, verification, and first dashboard access.'
      },
      {
        id: 'chapter-02',
        name: 'Set Up Your Account & Profile',
        text: 'Profiles, identification documents, and entity types.'
      },
      {
        id: 'chapter-03',
        name: 'Manage Addresses & Receivers',
        text: 'Overseas warehouse addresses and authorized package recipients.'
      },
      {
        id: 'chapter-04',
        name: 'Register a Shipment',
        text: 'Pre-alerts, product parameters, dimensions, and invoice uploads.'
      },
      {
        id: 'chapter-05',
        name: 'Understand Shipping Costs & Tariffs',
        text: 'Tariffs, actual vs volumetric weight, 5kg minimum, and price estimates.'
      },
      {
        id: 'chapter-06',
        name: 'Track Your Shipment & Understand Statuses',
        text: 'The 10-status lifecycle, progress timeline, and tracking numbers.'
      },
      {
        id: 'chapter-07',
        name: 'Receive Your Package & Pickup QR Code',
        text: 'Ready status, instant QR verification, office locations, and support.'
      }
    ]
  },
  ru: {
    title: 'Руководство по доставке с AmTrans - Полная инструкция для клиентов',
    description: 'Подробное руководство по доставке с AmTrans: регистрация, подтверждение документов, адреса зарубежных складов, предварительное оформление заказа, расчёт стоимости, отслеживание и получение по QR-коду.',
    keywords: 'руководство AmTrans, как пользоваться AmTrans, инструкция по доставке в Армению, отслеживание посылок Армения, расчет стоимости доставки',
    ogTitle: 'Руководство по доставке с AmTrans - Полная инструкция для клиентов',
    ogDescription: 'Узнайте, как доставлять посылки в Армению с помощью логистической платформы AmTrans.',
    ogLocale: 'ru_RU',
    alternateOgLocales: ['hy_AM', 'en_US'],
    ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_auto,f_auto/v1790515541/home_hero.webp',
    ogImageAlt: 'AmTrans — Полная пошаговая инструкция для пользователей',
    legalName: 'ООО «АмТранс»',
    steps: [
      {
        id: 'chapter-01',
        name: 'С чего начать работу с AmTrans',
        text: 'Регистрация, подтверждение почты и первый вход в кабинет.'
      },
      {
        id: 'chapter-02',
        name: 'Настройте профиль и аккаунт',
        text: 'Персональные данные, документы и форма субъекта.'
      },
      {
        id: 'chapter-03',
        name: 'Управление адресами и получателями',
        text: 'Адреса зарубежных складов и доверенные получатели.'
      },
      {
        id: 'chapter-04',
        name: 'Зарегистрируйте отправление',
        text: 'Предварительное декларирование, габариты, вес и загрузка инвойсов.'
      },
      {
        id: 'chapter-05',
        name: 'Как рассчитывается стоимость и тарифы',
        text: 'Тарифы, объемный вес, правило 5 кг и согласование сметы.'
      },
      {
        id: 'chapter-06',
        name: 'Отслеживание отправления и все статусы',
        text: 'Жизненный цикл из 10 статусов, таймлайн и номера отслеживания.'
      },
      {
        id: 'chapter-07',
        name: 'Получение посылки и QR-пропуск',
        text: 'Статус готовности, мгновенный QR-код, адреса филиалов и поддержка.'
      }
    ]
  }
}

export function useHowToUseSeo() {
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
    if (activeLocale.value === 'en') return 'https://amtrans.am/en/how-to-use'
    if (activeLocale.value === 'ru') return 'https://amtrans.am/ru/how-to-use'
    return 'https://amtrans.am/how-to-use'
  })

  // Localized SEO dictionary
  const currentContent = computed<HowToUseLocaleContent>(() => {
    return HOW_TO_USE_SEO_CONTENT[activeLocale.value] || HOW_TO_USE_SEO_CONTENT.hy
  })

  // ─── 1. Reactive computed refs for useSeoMeta (Devalue-safe & SSR reactive) ─
  const title = computed(() => currentContent.value.title)
  const description = computed(() => currentContent.value.description)
  const ogTitle = computed(() => currentContent.value.ogTitle)
  const ogDescription = computed(() => currentContent.value.ogDescription)
  const ogLocale = computed(() => currentContent.value.ogLocale)
  const ogUrl = computed(() => activeUrl.value)
  const ogImage = computed(() => currentContent.value.ogImage)
  const ogImageAlt = computed(() => currentContent.value.ogImageAlt)
  const twitterTitle = computed(() => currentContent.value.ogTitle)
  const twitterDescription = computed(() => currentContent.value.ogDescription)
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
    ogTitle,
    ogDescription,
    ogType: 'article',
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
        href: 'https://amtrans.am/how-to-use'
      },
      {
        key: 'hreflang-en',
        rel: 'alternate' as const,
        hreflang: 'en',
        href: 'https://amtrans.am/en/how-to-use'
      },
      {
        key: 'hreflang-ru',
        rel: 'alternate' as const,
        hreflang: 'ru',
        href: 'https://amtrans.am/ru/how-to-use'
      },
      {
        key: 'hreflang-x-default',
        rel: 'alternate' as const,
        hreflang: 'x-default',
        href: 'https://amtrans.am/how-to-use'
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

  // ─── 4. Schema.org JSON-LD Structured Data (HowTo & WebPage) ─────────────
  const structuredData = computed(() => {
    const locale = activeLocale.value
    const pageUrl = activeUrl.value
    const homeUrl = locale === 'hy' ? 'https://amtrans.am/' : `https://amtrans.am/${locale}`
    const homeName = locale === 'hy' ? 'Գլխավոր' : locale === 'ru' ? 'Главная' : 'Home'
    const guideName = locale === 'hy' ? 'Ուղեցույց' : locale === 'ru' ? 'Как пользоваться' : 'How to Use'

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'HowTo',
          '@id': `${pageUrl}#howto`,
          name: currentContent.value.title,
          description: currentContent.value.description,
          inLanguage: locale,
          image: currentContent.value.ogImage,
          totalTime: 'PT15M',
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'AMD',
            value: '0'
          },
          step: currentContent.value.steps.map((st, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            url: `${pageUrl}#${st.id}`,
            name: st.name,
            itemListElement: [
              {
                '@type': 'HowToDirection',
                text: st.text
              }
            ]
          }))
        },
        {
          '@type': 'WebPage',
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
            '@id': `${pageUrl}#howto`
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
          telephone: '+374 98 890-233',
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
              name: guideName,
              item: pageUrl
            }
          ]
        }
      ]
    }
  })

  // Safe JSON-LD script
  const scripts = computed(() => [
    {
      key: 'howto-jsonld',
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
