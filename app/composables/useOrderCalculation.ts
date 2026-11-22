import { computed, type Ref } from 'vue'

export interface OrderDimensionsInput {
  weight: string
  length: string
  width: string
  height: string
}

export interface TariffRateInput {
  pricePerKg?: number | string | null
}

export interface SystemSettingsInput {
  volumetricDivisor?: number | string | null
}

export function useOrderCalculation(
  dimensions: OrderDimensionsInput,
  routeTariff: Ref<TariffRateInput | null | undefined>,
  settings: Ref<SystemSettingsInput | null | undefined>
) {
  const formatPrice = (price?: number | string | null): string => {
    if (price === undefined || price === null || price === '') return '0'
    const num = Number(price)
    return isNaN(num) ? String(price) : num.toLocaleString()
  }

  const volumetricDivisor = computed<number>(() => {
    const div = Number(settings.value?.volumetricDivisor)
    return div > 0 ? div : 6000
  })

  const numericWeight = computed<number | null>(() => {
    if (!dimensions.weight) return null
    const w = parseFloat(dimensions.weight)
    return !isNaN(w) && w > 0 ? w : null
  })

  const numericDimensions = computed<{ length: number; width: number; height: number } | null>(() => {
    if (!dimensions.length || !dimensions.width || !dimensions.height) return null
    const l = parseFloat(dimensions.length)
    const w = parseFloat(dimensions.width)
    const h = parseFloat(dimensions.height)
    if (!isNaN(l) && l > 0 && !isNaN(w) && w > 0 && !isNaN(h) && h > 0) {
      return { length: l, width: w, height: h }
    }
    return null
  })

  const volumetricWeight = computed<number | null>(() => {
    if (!numericDimensions.value) return null
    const { length, width, height } = numericDimensions.value
    const divisor = volumetricDivisor.value
    const vol = (length * width * height) / divisor
    return Math.round(vol * 100) / 100
  })

  const chargeableWeight = computed<number | null>(() => {
    const actual = numericWeight.value
    const vol = volumetricWeight.value
    if (actual === null || vol === null) return null
    return Math.round(Math.max(actual, vol) * 100) / 100
  })

  const isVolumetricLarger = computed<boolean>(() => {
    if (numericWeight.value === null || volumetricWeight.value === null) return false
    return volumetricWeight.value > numericWeight.value
  })

  const tariffPricePerKg = computed<number | null>(() => {
    if (!routeTariff.value?.pricePerKg) return null
    const price = parseFloat(String(routeTariff.value.pricePerKg))
    return !isNaN(price) && price > 0 ? price : null
  })

  // ─── Minimum Chargeable Weight Policy (5 kg minimum) ──────────────────────
  const MIN_BILLABLE_KG = 5

  const billableWeight = computed<number | null>(() => {
    if (chargeableWeight.value === null) return null
    return Math.max(chargeableWeight.value, MIN_BILLABLE_KG)
  })

  const minimumPrice = computed<number | null>(() => {
    if (tariffPricePerKg.value === null) return null
    return Math.round(tariffPricePerKg.value * MIN_BILLABLE_KG * 100) / 100
  })

  const calculatedOrderPrice = computed<number | null>(() => {
    if (billableWeight.value === null || tariffPricePerKg.value === null) return null
    const total = billableWeight.value * tariffPricePerKg.value
    return Math.round(total * 100) / 100
  })

  return {
    formatPrice,
    volumetricDivisor,
    numericWeight,
    numericDimensions,
    volumetricWeight,
    chargeableWeight,
    billableWeight,
    isVolumetricLarger,
    tariffPricePerKg,
    minimumPrice,
    calculatedOrderPrice
  }
}

