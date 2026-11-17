<template>
  <Transition name="fade-modal">
    <div
      v-if="isOpen"
      class="popup fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm !mt-0"
      @click.self="handleClose"
    >
      <div
        class="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 transform transition-all animate-scale-up flex flex-col max-h-[calc(100vh-70px)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        :aria-label="t('office.addCountry')"
      >
        <!-- Modal Header (Fixed at Top) -->
        <div class="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {{ t('office.addCountry') }}
            </h3>
            <p class="text-[11px] sm:text-xs text-slate-500 font-medium leading-normal mt-0.5">
              {{ t('office.addCountrySubtitle') }}
            </p>
          </div>

          <button
            type="button"
            class="min-h-[36px] min-w-[36px] p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            :disabled="isSubmitting"
            :aria-label="t('office.cancel')"
            @click="handleClose"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form (Wraps Scrollable Body + Fixed Footer) -->
        <form @submit.prevent="handleSubmit" class="flex flex-col flex-1 min-h-0 overflow-hidden">
          <!-- Scrollable Body Area -->
          <div class="px-4 sm:px-6 py-3.5 sm:py-4 space-y-3 sm:space-y-3.5 flex-1 overflow-y-auto overscroll-contain">
            <AlertBanner v-if="error" type="error" :message="error" />

            <!-- Armenian Name -->
            <BaseInput
              id="country-name-hy"
              v-model="form.hyName"
              label="Armenian Name (HY)"
              placeholder="e.g. Հայաստան"
              :error="touched.hyName ? errors.hyName : ''"
              :touched="touched.hyName"
              required
              @blur="touched.hyName = true; validateForm()"
            />

            <!-- Russian Name -->
            <BaseInput
              id="country-name-ru"
              v-model="form.ruName"
              label="Russian Name (RU)"
              placeholder="e.g. Армения"
              :error="touched.ruName ? errors.ruName : ''"
              :touched="touched.ruName"
              required
              @blur="touched.ruName = true; validateForm()"
            />

            <!-- English Name -->
            <BaseInput
              id="country-name-en"
              v-model="form.enName"
              label="English Name (EN)"
              placeholder="e.g. Armenia"
              :error="touched.enName ? errors.enName : ''"
              :touched="touched.enName"
              required
              @blur="touched.enName = true; validateForm()"
            />

            <!-- File Upload: Country Icon -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold uppercase tracking-wider text-primary/90">
                Country Icon / Flag Image <span class="text-tertiary ml-0.5 font-bold">*</span>
              </label>

              <!-- Drop / Selection Zone -->
              <label
                for="country-icon-file"
                class="flex flex-col items-center justify-center p-3 sm:p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all bg-slate-50/60 hover:bg-slate-100/70 border-slate-200 hover:border-primary/40"
                :class="touched.flag && errors.flag ? 'border-tertiary/60 bg-tertiary/5' : ''"
              >
                <template v-if="iconPreviewUrl">
                  <div class="flex items-center gap-3 w-full">
                    <div class="h-10 w-14 sm:h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                      <img :src="iconPreviewUrl" alt="Icon preview" class="w-full h-full object-cover" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-bold text-slate-800 truncate">{{ selectedFileName }}</p>
                      <p class="text-[11px] text-primary font-semibold mt-0.5">Click or drag to change image</p>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-1.5">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="text-center">
                    <p class="text-xs sm:text-sm font-bold text-slate-700">Click to upload country icon / flag</p>
                    <p class="text-[11px] text-slate-400 mt-0.5">PNG, JPG, SVG, WEBP — Max 5 MB</p>
                  </div>
                </template>
              </label>

              <input
                id="country-icon-file"
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="sr-only"
                @change="handleFileUpload"
              />

              <p v-if="touched.flag && errors.flag" class="text-xs text-tertiary font-semibold flex items-center gap-1.5 mt-1 animate-fade-in">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{{ errors.flag }}</span>
              </p>
            </div>
          </div>

          <!-- Modal Footer (Fixed at Bottom) -->
          <div class="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2.5 shrink-0">
            <BaseButton
              type="button"
              variant="outline"
              size="sm"
              :block="false"
              class="!min-h-[36px] !py-1.5 !px-4 text-xs"
              :disabled="isSubmitting"
              @click="handleClose"
            >
              {{ t('office.cancel') }}
            </BaseButton>

            <BaseButton
              type="submit"
              variant="primary"
              size="sm"
              :block="false"
              class="!min-h-[36px] !py-1.5 !px-5 text-xs"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? t('office.saving') : t('office.saveCountry') }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import AlertBanner from '~/components/ui/AlertBanner.vue'
import { useI18n } from '~/composables/useI18n'
import type { CreateCountryPayload } from '~/types/office'

const props = defineProps<{
  isOpen: boolean
  isSubmitting?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: CreateCountryPayload): void
}>()

const { t } = useI18n()

// Form State
const form = reactive<{
  hyName: string
  ruName: string
  enName: string
}>({
  hyName: '',
  ruName: '',
  enName: ''
})

const touched = reactive<{
  hyName: boolean
  ruName: boolean
  enName: boolean
  flag: boolean
}>({
  hyName: false,
  ruName: false,
  enName: false,
  flag: false
})

const errors = reactive<{
  hyName: string
  ruName: string
  enName: string
  flag: string
}>({
  hyName: '',
  ruName: '',
  enName: '',
  flag: ''
})

// File Upload State
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const iconPreviewUrl = ref<string>('')
const selectedFileName = ref<string>('')

const handleFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (iconPreviewUrl.value && iconPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(iconPreviewUrl.value)
  }

  selectedFile.value = file
  selectedFileName.value = file.name
  iconPreviewUrl.value = URL.createObjectURL(file)
  touched.flag = true
  validateForm()
}

const resetForm = () => {
  form.hyName = ''
  form.ruName = ''
  form.enName = ''

  selectedFile.value = null
  selectedFileName.value = ''
  if (iconPreviewUrl.value && iconPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(iconPreviewUrl.value)
  }
  iconPreviewUrl.value = ''

  touched.hyName = false
  touched.ruName = false
  touched.enName = false
  touched.flag = false

  errors.hyName = ''
  errors.ruName = ''
  errors.enName = ''
  errors.flag = ''

  if (fileInputRef.value) fileInputRef.value.value = ''
}

// ─── Background Page Scroll Lock ───────────────────────────────────────────
let originalOverflow = ''
let originalPaddingRight = ''
let isScrollLocked = false

const lockScroll = () => {
  if (!import.meta.client || isScrollLocked) return
  originalOverflow = document.body.style.overflow
  originalPaddingRight = document.body.style.paddingRight

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
  document.body.style.overflow = 'hidden'
  isScrollLocked = true
}

const unlockScroll = () => {
  if (!import.meta.client || !isScrollLocked) return
  document.body.style.overflow = originalOverflow
  document.body.style.paddingRight = originalPaddingRight
  isScrollLocked = false
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen && !props.isSubmitting) {
    handleClose()
  }
}

// ─── Watchers & Lifecycle ──────────────────────────────────────────────────
watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      lockScroll()
      resetForm()
    } else {
      unlockScroll()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.isOpen) {
    lockScroll()
  }
  if (import.meta.client) {
    window.addEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  unlockScroll()
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeydown)
  }
})

const validateForm = (): boolean => {
  let isValid = true

  if (!form.hyName.trim()) {
    errors.hyName = t('office.errHyNameRequired')
    isValid = false
  } else {
    errors.hyName = ''
  }

  if (!form.ruName.trim()) {
    errors.ruName = t('office.errRuNameRequired')
    isValid = false
  } else {
    errors.ruName = ''
  }

  if (!form.enName.trim()) {
    errors.enName = t('office.errEnNameRequired')
    isValid = false
  } else {
    errors.enName = ''
  }

  if (!selectedFile.value) {
    errors.flag = t('office.errFlagRequired')
    isValid = false
  } else {
    errors.flag = ''
  }

  return isValid
}

const handleSubmit = () => {
  touched.hyName = true
  touched.ruName = true
  touched.enName = true
  touched.flag = true

  if (!validateForm()) return

  emit('submit', {
    hyName: form.hyName.trim(),
    ruName: form.ruName.trim(),
    enName: form.enName.trim(),
    flag: selectedFile.value!
  })
}

const handleClose = () => {
  if (!props.isSubmitting) {
    emit('close')
  }
}
</script>

<style scoped>
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.25s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-scale-up {
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
