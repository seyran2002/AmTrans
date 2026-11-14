<template>
  <div class="text-center py-12 px-4 max-w-md mx-auto">
    <!-- Icon Container -->
    <div class="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
      <slot name="icon">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </slot>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-bold text-slate-900 mb-1">
      <slot name="title">{{ title }}</slot>
    </h3>

    <!-- Subtitle / Description -->
    <p
      v-if="subtitle || description || $slots.description"
      class="text-slate-500 text-sm mb-6 leading-relaxed"
    >
      <slot name="description">{{ subtitle || description }}</slot>
    </p>

    <!-- Action Button Slot -->
    <slot name="action">
      <BaseButton
        v-if="actionText"
        type="button"
        :variant="actionVariant"
        size="md"
        :block="false"
        @click="$emit('action')"
      >
        <slot name="action-icon">
          <svg class="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </slot>
        <span>{{ actionText }}</span>
      </BaseButton>
    </slot>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

interface Props {
  title: string
  subtitle?: string
  description?: string
  actionText?: string
  actionVariant?: 'primary' | 'secondary' | 'outline' | 'tertiary'
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  description: '',
  actionText: '',
  actionVariant: 'secondary'
})

defineEmits<{
  (e: 'action'): void
}>()
</script>
