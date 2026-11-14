import type { Office } from './office'

export interface Tariff {
  id: string
  fromOfficeId: string
  toOfficeId: string
  pricePerKg: number | string
  createdAt?: string
  updatedAt?: string
  fromOffice?: Office
  toOffice?: Office
}

export interface CreateTariffPayload {
  fromOfficeId: string
  toOfficeId: string
  pricePerKg: number
}

export interface UpdateTariffPayload {
  fromOfficeId?: string
  toOfficeId?: string
  pricePerKg?: number
}

export interface TariffByRouteQuery {
  fromOfficeId: string
  toOfficeId: string
}
