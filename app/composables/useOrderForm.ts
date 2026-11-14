import { reactive, ref } from 'vue'
import { useI18n } from '~/composables/useI18n'
import type { Order, CreateOrderPayload, UpdateOrderPayload, OrderCurrency } from '~/types/order'

export type RecipientType = 'myself' | 'another'

export interface OrderFormState {
  recipientType: RecipientType
  receiverId: string
  fromOfficeId: string
  toOfficeId: string
  marketName: string
  productDescription: string
  productPrice: string
  currency: OrderCurrency
  pieceCount: string
  isNew: boolean
  weight: string
  length: string
  width: string
  height: string
  comment: string
  invoice: File | null
}

export function useOrderForm() {
  const { t } = useI18n()

  const form = reactive<OrderFormState>({
    recipientType: 'myself',
    receiverId: '',
    fromOfficeId: '',
    toOfficeId: '',
    marketName: '',
    productDescription: '',
    productPrice: '',
    currency: 'USD',
    pieceCount: '1',
    isNew: true,
    weight: '',
    length: '',
    width: '',
    height: '',
    comment: '',
    invoice: null
  })

  const errors = reactive<Record<string, string>>({})
  const fileInputRef = ref<HTMLInputElement | null>(null)

  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
  }

  const resetForm = () => {
    clearErrors()
    form.recipientType = 'myself'
    form.receiverId = ''
    form.fromOfficeId = ''
    form.toOfficeId = ''
    form.marketName = ''
    form.productDescription = ''
    form.productPrice = ''
    form.currency = 'USD'
    form.pieceCount = '1'
    form.isNew = true
    form.weight = ''
    form.length = ''
    form.width = ''
    form.height = ''
    form.comment = ''
    form.invoice = null
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }

  const populateForm = (order?: Order | null) => {
    clearErrors()
    if (order) {
      form.recipientType = order.receiver ? 'another' : 'myself'
      form.receiverId = order.receiver?.id || ''
      form.fromOfficeId = order.fromOffice?.id || ''
      form.toOfficeId = order.toOffice?.id || ''
      form.marketName = order.marketName || ''
      form.productDescription = order.productDescription || ''
      form.productPrice = order.productPrice !== undefined ? String(order.productPrice) : ''
      form.currency = order.currency || 'USD'
      form.pieceCount = order.pieceCount !== undefined && order.pieceCount !== null ? String(order.pieceCount) : '1'
      form.isNew = order.isNew !== undefined ? order.isNew : true
      form.weight = order.weight !== undefined ? String(order.weight) : ''
      form.length = order.length !== undefined ? String(order.length) : ''
      form.width = order.width !== undefined ? String(order.width) : ''
      form.height = order.height !== undefined ? String(order.height) : ''
      form.comment = order.comment || ''
      form.invoice = null
    } else {
      resetForm()
    }
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.value?.click()
  }

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    form.invoice = target.files?.[0] ?? null
  }

  const handleFileDrop = (event: DragEvent) => {
    const file = event.dataTransfer?.files?.[0] ?? null
    if (file) {
      form.invoice = file
    }
  }

  const removeFile = () => {
    form.invoice = null
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const validate = (canEditAllDetails: boolean): boolean => {
    clearErrors()
    let isValid = true

    if (form.recipientType === 'another' && !form.receiverId) {
      errors.receiverId = t('orders.errReceiverRequired')
      isValid = false
    }

    // When editing in non-registered status, only recipient can be edited
    if (!canEditAllDetails) {
      return isValid
    }

    if (!form.fromOfficeId) {
      errors.fromOfficeId = t('orders.errFromOfficeRequired')
      isValid = false
    }

    if (!form.toOfficeId) {
      errors.toOfficeId = t('orders.errToOfficeRequired')
      isValid = false
    }

    if (form.fromOfficeId && form.toOfficeId && form.fromOfficeId === form.toOfficeId) {
      errors.toOfficeId = t('orders.errSameOffice')
      isValid = false
    }

    if (!form.marketName.trim()) {
      errors.marketName = t('orders.errMarketNameRequired')
      isValid = false
    }

    if (!form.productDescription.trim()) {
      errors.productDescription = t('orders.errProductDescriptionRequired')
      isValid = false
    }

    const price = parseFloat(form.productPrice)
    if (!form.productPrice || isNaN(price) || price < 0) {
      errors.productPrice = t('orders.errProductPriceRequired')
      isValid = false
    }

    if (!form.currency) {
      errors.currency = t('orders.errCurrencyRequired')
      isValid = false
    }

    const pieces = Number(form.pieceCount)
    if (!form.pieceCount || isNaN(pieces) || pieces < 1 || !Number.isInteger(pieces)) {
      errors.pieceCount = t('orders.errPieceCountRequired')
      isValid = false
    }

    const weight = parseFloat(form.weight)
    if (!form.weight || isNaN(weight) || weight < 0) {
      errors.weight = t('orders.errWeightRequired')
      isValid = false
    }

    const length = parseFloat(form.length)
    if (!form.length || isNaN(length) || length < 0) {
      errors.length = t('orders.errLengthRequired')
      isValid = false
    }

    const width = parseFloat(form.width)
    if (!form.width || isNaN(width) || width < 0) {
      errors.width = t('orders.errWidthRequired')
      isValid = false
    }

    const height = parseFloat(form.height)
    if (!form.height || isNaN(height) || height < 0) {
      errors.height = t('orders.errHeightRequired')
      isValid = false
    }

    return isValid
  }

  const buildPayload = (
    isEditing: boolean,
    canEditAllDetails: boolean,
    calculatedPrice: number | null
  ): CreateOrderPayload | UpdateOrderPayload => {
    if (isEditing && !canEditAllDetails) {
      return {
        receiverId: form.recipientType === 'another' ? form.receiverId : ''
      }
    }

    const payload: CreateOrderPayload = {
      fromOfficeId: form.fromOfficeId,
      toOfficeId: form.toOfficeId,
      productPrice: parseFloat(form.productPrice),
      price: calculatedPrice !== null ? calculatedPrice : undefined,
      currency: form.currency,
      marketName: form.marketName.trim(),
      productDescription: form.productDescription.trim(),
      pieceCount: parseInt(form.pieceCount, 10),
      isNew: form.isNew,
      weight: parseFloat(form.weight),
      length: parseFloat(form.length),
      width: parseFloat(form.width),
      height: parseFloat(form.height),
      comment: form.comment.trim() || undefined,
      invoice: form.invoice || null
    }

    if (form.recipientType === 'another' && form.receiverId) {
      payload.receiverId = form.receiverId
    } else if (isEditing) {
      payload.receiverId = ''
    }

    return payload
  }

  return {
    form,
    errors,
    fileInputRef,
    clearErrors,
    resetForm,
    populateForm,
    triggerFileInput,
    handleFileChange,
    handleFileDrop,
    removeFile,
    formatFileSize,
    validate,
    buildPayload
  }
}

