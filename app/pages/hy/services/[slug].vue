<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import { useSeoMeta, useHead } from '#imports'

definePageMeta({ layout: 'guest' })

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

interface ServiceData {
  title: string
  subtitle: string
  description: string
  icon: string
  benefits: string[]
  routes: string[]
}

const servicesMap: Record<string, ServiceData> = {
  'road-freight': {
    title: 'Ցամաքային Բեռնափոխադրումներ (Road Freight)',
    subtitle: 'Միջազգային ապահով և մատչելի ցամաքային ավտոբեռնափոխադրումներ',
    description: 'AmTrans-ն ապահովում է կանոնավոր ցամաքային բեռնափոխադրումներ (ամբողջական FTL և հավաքական LTL մեքենաներով) Ռուսաստանից, Վրաստանից, Իրանից, ԱՄԷ-ից և եվրոպական երկրներից դեպի Հայաստան: Մեր ցամաքային լոգիստիկ ցանցը երաշխավորում է բեռի անվտանգությունը, արագ մաքսային ձևակերպումը և օպտիմալ գնային առաջարկը:',
    icon: 'road',
    benefits: [
      'Մատչելի սակագներ մեծածավալ և ծանրաքաշ բեռների համար',
      'Ամբողջական մաքսային փաստաթղթավորման աջակցություն',
      'Հավաքական բեռների (Groupage) պարբերական շաբաթական ուղերթեր',
      'GPS հետևում և բեռի ապահովագրություն ողջ երթուղու ընթացքում'
    ],
    routes: ['Ռուսաստան - Հայաստան', 'Վրաստան - Հայաստան', 'Իրան - Հայաստան', 'ԱՄԷ - Հայաստան', 'Եվրոպա - Հայաստան']
  },
  'air-freight': {
    title: 'Օդային Բեռնափոխադրումներ (Air Cargo Freight)',
    subtitle: 'Էքսպրես ավիափոխադրումներ միջազգային առանցքային օդանավակայաններից',
    description: 'Շտապ և արժեքավոր բեռների օդային փոխադրում ամենասեղմ ժամկետներում: Կանոնավոր ավիաչվերթեր Դուբայից (DXB), Գուանչժոուից (CAN), Ֆրանկֆուրտից (FRA) և Լոս Անջելեսից (LAX) ուղիղ դեպի Երևանի «Զվարթնոց» (EVN) միջազգային օդանավակայան:',
    icon: 'plane',
    benefits: [
      'Առաքման ժամկետը՝ 3-7 աշխատանքային օր',
      'Փխրուն, թանկարժեք և էլեկտրոնային ապրանքների ապահովագրություն',
      'Արագացված մաքսային զննում և պահեստավորում',
      'Օդանավակայանից դռնեդուռ կամ մասնաճյուղից ստացման հնարավորություն'
    ],
    routes: ['Դուբայ (ԱՄԷ) - Երևան', 'Գուանչժոու (Չինաստան) - Երևան', 'Լոս Անջելես (ԱՄՆ) - Երևան', 'Մոսկվա (ՌԴ) - Երևան']
  },
  'groupage-parcels': {
    title: 'Հավաքական Բեռներ և Ծանրոցներ (LCL & Parcels)',
    subtitle: 'Փոքր բեռների և օնլայն գնումների խմբաքանակային առաքում',
    description: 'Հավաքական բեռնափոխադրումների (LCL) շնորհիվ Դուք վճարում եք միայն Ձեր բեռի փաստացի զբաղեցրած ծավալի կամ քաշի համար: Իդեալական լուծում է միջազգային օնլայն խանութներից (Amazon, Taobao, Noon, eBay) անհատական և առևտրային ծանրոցներ պատվիրելու համար՝ կիրառելով 5 կգ նվազագույն քաշի քաղաքականություն:',
    icon: 'box',
    benefits: [
      '5 կգ նվազագույն վճարելի քաշի քաղաքականություն փոքր ծանրոցների համար',
      'Անվճար արտերկրյա պահեստների հասցեներ և նույնականացում',
      'Ստացում Երևանի կենտրոնական մասնաճյուղից թվային QR կոդով',
      'Բեռների համախմբում (Consolidation)՝ լոգիստիկ ծախսերը նվազեցնելու համար'
    ],
    routes: ['ԱՄԷ Պահեստ - Հայաստան', 'Չինաստանի Պահեստ - Հայաստան', 'ԱՄՆ Պահեստ - Հայաստան', 'ՌԴ Պահեստ - Հայաստան']
  }
}

const currentService = computed(() => {
  return servicesMap[slug.value] || servicesMap['road-freight']
})

const currentCanonical = computed(() => `https://amtrans.am/hy/services/${slug.value}`)

useSeoMeta({
  title: computed(() => `${currentService.value.title} | AmTrans`),
  description: computed(() => currentService.value.description),
  ogTitle: computed(() => `${currentService.value.title} | AmTrans`),
  ogDescription: computed(() => currentService.value.description),
  ogUrl: currentCanonical,
  canonical: currentCanonical
})

useHead({
  htmlAttrs: { lang: 'hy' },
  link: [
    { rel: 'canonical', href: currentCanonical },
    { rel: 'alternate', hreflang: 'hy', href: currentCanonical },
    { rel: 'alternate', hreflang: 'x-default', href: currentCanonical }
  ]
})
</script>

<template>
  <div class="w-full min-h-screen bg-slate-50 pt-28 pb-20">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="mb-8 flex items-center gap-2 text-xs font-semibold text-slate-500">
        <NuxtLink to="/hy" class="hover:text-primary transition-colors">Գլխավոր</NuxtLink>
        <span>/</span>
        <NuxtLink to="/hy#services" class="hover:text-primary transition-colors">Ծառայություններ</NuxtLink>
        <span>/</span>
        <span class="text-slate-800 font-bold truncate">{{ currentService.title }}</span>
      </nav>

      <!-- Main Service Header -->
      <header class="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 mb-8">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <span>AmTrans Լոգիստիկ Ծառայություն</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {{ currentService.title }}
        </h1>
        <p class="text-base sm:text-lg text-slate-600 font-medium">
          {{ currentService.subtitle }}
        </p>
      </header>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <main class="md:col-span-8 space-y-6">
          <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 class="text-xl font-black text-slate-900">Ծառայության Նկարագրություն</h2>
            <p class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {{ currentService.description }}
            </p>
          </div>

          <div class="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 class="text-xl font-black text-slate-900">Առավելություններ և Հնարավորություններ</h2>
            <ul class="space-y-3 text-sm text-slate-700 font-medium">
              <li v-for="(b, idx) in currentService.benefits" :key="idx" class="flex items-start gap-2.5">
                <svg class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                <span>{{ b }}</span>
              </li>
            </ul>
          </div>
        </main>

        <!-- Sidebar / Actions -->
        <aside class="md:col-span-4 space-y-6">
          <div class="p-6 rounded-3xl bg-gradient-to-br from-primary to-[#1a2d54] text-white shadow-lg space-y-4">
            <h3 class="text-lg font-bold">Հաշվել Բեռնափոխադրման Արժեքը</h3>
            <p class="text-xs text-slate-200 leading-relaxed font-normal">
              Օգտագործեք մեր առցանց հաշվիչը՝ 5 կգ նվազագույն քաշի քաղաքականության հիման վրա ճշգրիտ սակագինը ստանալու համար:
            </p>
            <NuxtLink
              to="/hy#calculator"
              class="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors"
            >
              <span>Անցնել Հաշվիչին</span>
              <span>→</span>
            </NuxtLink>
          </div>

          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 class="text-sm font-bold text-slate-900">Հիմնական Երթուղիներ</h3>
            <div class="space-y-2 text-xs font-semibold text-slate-600">
              <div v-for="(r, idx) in currentService.routes" :key="idx" class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-secondary" />
                <span>{{ r }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

