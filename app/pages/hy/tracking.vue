<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import { useSeoMeta, useHead } from '#imports'

definePageMeta({ layout: 'guest' })

const route = useRoute()
const trackingId = computed(() => String(route.query.id || ''))

useSeoMeta({
  title: computed(() => trackingId.value ? `Բեռի Հետևում: ${trackingId.value} | AmTrans` : 'Բեռի Տեղաշարժի Հետևում | AmTrans'),
  description: 'Առցանց բեռնափոխադրումների հետևում AmTrans հարթակում: Իմացեք Ձեր ծանրոցի և բեռի ընթացիկ կարգավիճակը իրական ժամանակում:',
  robots: 'noindex, follow'
})

useHead({
  htmlAttrs: { lang: 'hy' }
})
</script>

<template>
  <div class="w-full min-h-screen bg-slate-50 pt-32 pb-20">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-lg text-center space-y-6">
        <div class="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl font-black">
          📍
        </div>

        <div class="space-y-2">
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900">
            Բեռի Տեղաշարժի Հետևում
          </h1>
          <p class="text-sm text-slate-600">
            Արդյունքներ հետագծման ծածկագրի համար՝
            <span class="font-mono font-bold text-primary">{{ trackingId || 'Չի նշված' }}</span>
          </p>
        </div>

        <div v-if="trackingId" class="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Կարգավիճակ</span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Ճանապարհին է (In Transit)
            </span>
          </div>
          <div class="text-xs text-slate-600 space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Ելման Պահեստ՝</span>
              <span class="font-bold text-slate-800">Dubai Hub, UAE</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Նպատակակետ՝</span>
              <span class="font-bold text-slate-800">Երևանի Կենտրոնական Գրասենյակ</span>
            </div>
          </div>
        </div>

        <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <NuxtLink
            to="/dashboard/orders"
            class="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-[#1a2d54] text-white font-bold text-xs shadow-md transition-all"
          >
            Դիտել Իմ Պատվերները Վահանակում
          </NuxtLink>
          <NuxtLink
            to="/hy#tracking"
            class="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Վերադառնալ Գլխավոր Էջ
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

