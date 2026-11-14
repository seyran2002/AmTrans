<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false
})

interface Props {
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  loading?: 'eager' | 'lazy'
  fetchpriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'auto' | 'sync'
  sizes?: string
  format?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: 1200,
  height: 675,
  loading: 'eager',
  fetchpriority: 'high',
  decoding: 'async',
  class: ''
})

const isCloudinary = computed(() => {
  return typeof props.src === 'string' && props.src.includes('res.cloudinary.com')
})

const avifSrc = computed(() => {
  if (!isCloudinary.value) return undefined
  // Replace or inject Cloudinary transformations for AVIF
  const baseParts = props.src.split('/upload/')
  if (baseParts.length === 2) {
    return `${baseParts[0]}/upload/c_fill,g_auto,w_${props.width},h_${props.height},q_80,f_avif/${baseParts[1].replace(/^c_[^/]+\//, '')}`
  }
  return undefined
})

const webpSrc = computed(() => {
  if (!isCloudinary.value) return undefined
  const baseParts = props.src.split('/upload/')
  if (baseParts.length === 2) {
    return `${baseParts[0]}/upload/c_fill,g_auto,w_${props.width},h_${props.height},q_80,f_webp/${baseParts[1].replace(/^c_[^/]+\//, '')}`
  }
  return undefined
})

const computedFallbackSrc = computed(() => {
  if (isCloudinary.value) {
    const baseParts = props.src.split('/upload/')
    if (baseParts.length === 2) {
      return `${baseParts[0]}/upload/c_fill,g_auto,w_${props.width},h_${props.height},q_80,f_auto/${baseParts[1].replace(/^c_[^/]+\//, '')}`
    }
  }
  return props.src
})
</script>

<template>
  <picture class="contents">
    <source
      v-if="avifSrc"
      type="image/avif"
      :srcset="avifSrc"
      :sizes="sizes"
    />
    <source
      v-if="webpSrc"
      type="image/webp"
      :srcset="webpSrc"
      :sizes="sizes"
    />
    <img
      :src="computedFallbackSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :fetchpriority="fetchpriority"
      :decoding="decoding"
      crossorigin="anonymous"
      :class="props.class"
      v-bind="$attrs"
    />
  </picture>
</template>

