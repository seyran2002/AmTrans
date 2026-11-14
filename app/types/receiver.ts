export interface Receiver {
  id: string
  code?: string | null
  firstName: string
  lastName: string
  documentType?: string
  hyDocumentType?: string
  enDocumentType?: string
  ruDocumentType?: string
  documentNumber: string
  address: string
  phoneNumber: string
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateReceiverPayload {
  firstName: string
  lastName: string
  hyDocumentType: string
  enDocumentType: string
  ruDocumentType: string
  documentNumber: string
  address: string
  phoneNumber: string
}

export interface UpdateReceiverPayload {
  firstName?: string
  lastName?: string
  hyDocumentType?: string
  enDocumentType?: string
  ruDocumentType?: string
  documentNumber?: string
  address?: string
  phoneNumber?: string
}
