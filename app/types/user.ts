export enum Role {
  CUSTOMER = 'CUSTOMER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN'
}

export interface UserItem {
  id: string
  email: string
  role: Role | string
  isSupporter?: boolean
  firstName?: string
  lastName?: string
  phoneNumber?: string
  isIndividual?: boolean
  companyName?: string
  taxpayerId?: string
  hyDocumentType?: string
  enDocumentType?: string
  ruDocumentType?: string
  documentNumber?: string
  address?: string
  code?: string
  officeId?: string | null
  office?: any
  status?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export interface UpdateUserRolePayload {
  role: Role | string
}
