export interface ContactPayload {
  name: string
  email: string
  message: string
  _hp?: string
}

export interface ContactApiResponse {
  success: boolean
  message: string
}

export interface ContactFormState {
  name: string
  email: string
  message: string
  _hp: string
}

export interface ContactValidationErrors {
  name?: string
  email?: string
  message?: string
}

export interface WorkingHoursInfo {
  isOpen: boolean
  statusTextKey: string
  badgeClass: string
}
