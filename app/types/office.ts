export interface Country {
  id: string
  hyName: string
  ruName: string
  enName: string
  icon?: string | null
  flag?: string | null
  code?: string
  createdAt: string
  updatedAt: string
}

export interface CountryWithOffices extends Country {
  offices: Office[]
}

export interface CreateCountryPayload {
  hyName: string
  ruName: string
  enName: string
  flag: File
}

export interface OperatorUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  role?: string
  code?: string
}

export interface Office {
  id: string
  countryId: string
  countryName?: string
  countryIcon?: string | null
  country?: Country
  province: string
  city: string
  postalCode: string
  fullAddress: string
  phone: string
  operators?: OperatorUser[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateOfficePayload {
  countryId: string
  province: string
  city: string
  postalCode: string
  fullAddress: string
  phone: string
}

export interface UpdateOfficePayload {
  countryId?: string
  province?: string
  city?: string
  postalCode?: string
  fullAddress?: string
  phone?: string
}
