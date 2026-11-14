<script setup lang="ts">
import { useHead, useSeoMeta, definePageMeta } from '#imports'
import HomeHero from '~/components/home/HomeHero.vue'

definePageMeta({ layout: 'guest' })

// ─── 1. Core SEO Metadata Streaming (SSR) ──────────────────────────────────
useSeoMeta({
  title: 'AmTrans | Միջազգային և Տեղական Բեռնափոխադրումներ',
  description: 'Արագ և հուսալի բեռնափոխադրումներ: Ցամաքային և օդային լոգիստիկ ծառայություններ, հավաքական բեռների տեղափոխում: Հաշվեք արժեքը և հետևեք բեռին առցանց:',
  keywords: 'բեռնափոխադրումներ, միջազգային բեռնափոխադրումներ, լոգիստիկ ծառայություններ, օդային բեռնափոխադրումներ, ցամաքային բեռնափոխադրումներ, հավաքական բեռներ, հետևել բեռին, հաշվել բեռնափոխադրման արժեքը',
  
  // Open Graph
  ogTitle: 'AmTrans | Միջազգային և Տեղական Բեռնափոխադրումներ',
  ogDescription: 'Արագ և հուսալի բեռնափոխադրումներ: Ցամաքային և օդային լոգիստիկ ծառայություններ, հավաքական բեռների տեղափոխում:',
  ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_80,f_auto/v1790515541/home_hero.webp',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'AmTrans Logistics',
  ogUrl: 'https://amtrans.am/hy',
  ogType: 'website',
  ogLocale: 'hy_AM',
  ogLocaleAlternate: ['en_US', 'ru_RU'],
  
  // Twitter Card
  twitterCard: 'summary_large_image',
  twitterTitle: 'AmTrans | Միջազգային և Տեղական Բեռնափոխադրումներ',
  twitterDescription: 'Արագ և հուսալի բեռնափոխադրումներ: Ցամաքային և օդային լոգիստիկ ծառայություններ, հավաքական բեռների տեղափոխում:',
  twitterImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_80,f_auto/v1790515541/home_hero.webp'
})

// ─── 2. Interconnected Linked Data Graph (@graph) ───────────────────────────
// Excludes sea freight (ծովային) strictly per guidelines
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LogisticsService',
      '@id': 'https://amtrans.am/#organization',
      name: 'AmTrans Logistics',
      legalName: '«ԱմՏրանս» ՍՊԸ',
      alternateName: ['ԱմՏրանս', 'AmTrans', 'АмТранс'],
      url: 'https://amtrans.am/hy',
      logo: 'https://res.cloudinary.com/tgatbuws/image/upload/v1790515541/home_hero.webp',
      image: 'https://res.cloudinary.com/tgatbuws/image/upload/v1790515541/home_hero.webp',
      telephone: '+374 10 000000',
      priceRange: '֏֏',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Տիգրան Մեծի պողոտա',
        addressLocality: 'Երևան',
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
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00'
        }
      ],
      areaServed: ['AM', 'RU', 'GE', 'CN', 'US', 'AE', 'EU'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Բեռնափոխադրման Ծառայություններ',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Ցամաքային Բեռնափոխադրումներ',
              description: 'Հուսալի և մատչելի ցամաքային ավտոբեռնափոխադրումներ միջազգային և տարածաշրջանային ուղղություններով:'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Օդային Բեռնափոխադրումներ',
              description: 'Արագընթաց ավիափոխադրումներ շտապ, արժեքավոր և ժամանակատար բեռների համար աշխարհի ցանկացած կետից:'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Հավաքական Բեռներ (LCL)',
              description: 'Տնտեսող համակցված բեռնափոխադրումներ փոքր և միջին ծավալի բեռների անվտանգ տեղափոխման համար:'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Ծանրոցների Առաքում',
              description: 'Անհատական և կորպորատիվ փաթեթների էքսպրես առաքում մինչև ստացողի դուռը:'
            }
          }
        ]
      }
    },
    {
      '@type': 'WebSite',
      '@id': 'https://amtrans.am/#website',
      url: 'https://amtrans.am/hy',
      name: 'AmTrans',
      publisher: {
        '@id': 'https://amtrans.am/#organization'
      },
      inLanguage: 'hy',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://amtrans.am/hy/tracking?id={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://amtrans.am/hy#faq',
      isPartOf: {
        '@id': 'https://amtrans.am/#website'
      },
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Որքա՞ն է տևում միջազգային առաքումը:',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Առաքման տևողությունը սովորաբար 5-ից 9 աշխատանքային օր է՝ կախված մեկնման երկրից և մաքսային ձևակերպումներից:'
          }
        },
        {
          '@type': 'Question',
          name: 'Ինչպե՞ս կարող եմ հետևել իմ ծանրոցին:',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Դուք կարող եք իրական ժամանակում հետևել Ձեր ծանրոցների կարգավիճակին AmTrans-ի անձնական էջում:'
          }
        },
        {
          '@type': 'Question',
          name: 'Կարո՞ղ եմ ինքնուրույն վերցնել ծանրոցը:',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Այո, կարող եք մոտենալ Ձեր նախընտրած AmTrans մասնաճյուղ աշխատանքային ժամերին կամ պատվիրել առաքում մինչև Ձեր հասցեն:'
          }
        },
        {
          '@type': 'Question',
          name: 'Ինչպե՞ս է հաշվարկվում առաքման արժեքը:',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Հաշվարկն իրականացվում է ըստ իրական կամ ծավալային քաշի՝ համաձայն հստակ սակագների, առանց որևէ թաքնված վճարների:'
          }
        }
      ]
    }
  ]
}

// ─── 3. Head Configuration (Canonicals, Hreflang & Structured Data) ──────────
useHead({
  htmlAttrs: {
    lang: 'hy'
  },
  link: [
    { rel: 'canonical', href: 'https://amtrans.am/hy' },
    { rel: 'alternate', hreflang: 'hy', href: 'https://amtrans.am/hy' },
    { rel: 'alternate', hreflang: 'ru', href: 'https://amtrans.am/ru' },
    { rel: 'alternate', hreflang: 'en', href: 'https://amtrans.am/en' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://amtrans.am/hy' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData)
    }
  ]
})
</script>

<template>
  <div class="w-full min-h-screen bg-bgPrimary">
    <!-- 1. Hero Section -->
    <HomeHero />

    <!-- 2. Shipping Tariffs Section -->
    <LazyHomeShippingTariffs />

    <!-- 3. Why Choose AmTrans Section -->
    <LazyHomeWhyChooseUs />

    <!-- 4. How It Works Section -->
    <LazyHomeHowItWorks />

    <!-- 5. Frequently Asked Questions Section -->
    <LazyHomeFaq />

    <!-- 6. Final Call to Action Section -->
    <LazyHomeCallToAction />
  </div>
</template>
