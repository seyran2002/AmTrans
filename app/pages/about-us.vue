<script setup lang="ts">
import { useHead, useSeoMeta, definePageMeta } from '#imports'
import AboutHero from '~/components/about/AboutHero.vue'

definePageMeta({ layout: 'guest' })

// ─── 1. Strict Core SEO Metadata Streaming (SSR) ────────────────────────────
useSeoMeta({
  title: 'Մեր Մասին | AmTrans Լոգիստիկ Ընկերություն',
  description: 'Ծանոթացեք AmTrans լոգիստիկ ընկերության պատմությանը և թիմին: Միջազգային ցամաքային և օդային բեռնափոխադրումների հուսալի գործընկեր Հայաստանում:',
  keywords: 'AmTrans մեր մասին, լոգիստիկ ընկերություն Հայաստանում, բեռնափոխադրման ընկերություն, հուսալի լոգիստիկա',

  // Open Graph
  ogTitle: 'Մեր Մասին | AmTrans Լոգիստիկ Ընկերություն',
  ogDescription: 'Ծանոթացեք AmTrans լոգիստիկ ընկերության պատմությանը և թիմին: Միջազգային ցամաքային և օդային բեռնափոխադրումների հուսալի գործընկեր Հայաստանում:',
  ogImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_80,f_auto/v1792777621/about-hero.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'AmTrans Logistics About Us',
  ogUrl: 'https://amtrans.am/hy/about',
  ogType: 'website',
  ogLocale: 'hy_AM',
  ogLocaleAlternate: ['en_US', 'ru_RU'],

  // Twitter Card
  twitterCard: 'summary_large_image',
  twitterTitle: 'Մեր Մասին | AmTrans Լոգիստիկ Ընկերություն',
  twitterDescription: 'Ծանոթացեք AmTrans լոգիստիկ ընկերության պատմությանը և թիմին: Միջազգային ցամաքային և օդային բեռնափոխադրումների հուսալի գործընկեր Հայաստանում:',
  twitterImage: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_80,f_auto/v1792777621/about-hero.jpg'
})

// ─── 2. Interconnected JSON-LD Linked Data Graph (@graph) ───────────────────
// Strict constraint: Excludes Sea Freight (ծովային).
// Strictly limited to Road Freight, Air Freight, Parcel Delivery, and LCL Groupage Freight.
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://amtrans.am/hy/about#webpage',
      url: 'https://amtrans.am/hy/about',
      name: 'Մեր Մասին | AmTrans Լոգիստիկ Ընկերություն',
      description: 'Ծանոթացեք AmTrans լոգիստիկ ընկերության պատմությանը և թիմին: Միջազգային ցամաքային և օդային բեռնափոխադրումների հուսալի գործընկեր Հայաստանում:',
      inLanguage: 'hy',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://amtrans.am/#website',
        name: 'AmTrans',
        url: 'https://amtrans.am/hy'
      },
      about: {
        '@id': 'https://amtrans.am/#organization'
      },
      breadcrumb: {
        '@id': 'https://amtrans.am/hy/about#breadcrumb'
      }
    },
    {
      '@type': ['Organization', 'LogisticsService'],
      '@id': 'https://amtrans.am/#organization',
      name: 'AmTrans Logistics',
      legalName: '«ԱմՏրանս» ՍՊԸ',
      alternateName: ['ԱմՏրանս', 'AmTrans', 'АмТранс'],
      url: 'https://amtrans.am/hy',
      logo: 'https://res.cloudinary.com/tgatbuws/image/upload/v1790515541/home_hero.webp',
      image: 'https://res.cloudinary.com/tgatbuws/image/upload/c_fill,w_1200,h_630,q_80,f_auto/v1792777621/about-hero.jpg',
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
      areaServed: ['AM', 'RU', 'GE', 'CN', 'US', 'AE', 'EU'],
      knowsAbout: [
        'Ցամաքային Բեռնափոխադրումներ',
        'Օդային Բեռնափոխադրումներ',
        'Ծանրոցների Առաքում',
        'Հավաքական Բեռներ',
        'Road Freight',
        'Air Freight',
        'Parcel Delivery',
        'LCL Groupage Freight'
      ],
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
      '@type': 'BreadcrumbList',
      '@id': 'https://amtrans.am/hy/about#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Գլխավոր',
          item: 'https://amtrans.am/hy'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Մեր Մասին',
          item: 'https://amtrans.am/hy/about'
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
    { rel: 'canonical', href: 'https://amtrans.am/hy/about' },
    { rel: 'alternate', hreflang: 'hy', href: 'https://amtrans.am/hy/about' },
    { rel: 'alternate', hreflang: 'en', href: 'https://amtrans.am/en/about' },
    { rel: 'alternate', hreflang: 'ru', href: 'https://amtrans.am/ru/about' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://amtrans.am/hy/about' }
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
    <AboutHero />

    <!-- 2. Our Mission Section -->
    <LazyAboutMissionSection />

    <!-- 3. How It Works Section -->
    <LazyAboutHowItWorksSection />

    <!-- 4. Why Choose Us Section -->
    <LazyAboutWhyUsSection />

    <!-- 5. Our Commitment Section -->
    <LazyAboutCommitmentSection />
  </div>
</template>
