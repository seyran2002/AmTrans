import { computed } from 'vue'

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface PasswordCriteria {
  length: boolean
  upper: boolean
  lower: boolean
  special: boolean
}

/**
 * Evaluate password strength criteria for registration
 */
export function evaluatePasswordCriteria(password: string): PasswordCriteria {
  const p = password || ''
  return {
    length: p.length >= 8,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p)
  }
}

/**
 * Check if password fulfills all registration criteria
 */
export function isPasswordValidForRegister(password: string): boolean {
  const criteria = evaluatePasswordCriteria(password)
  return criteria.length && criteria.upper && criteria.lower && criteria.special
}

/**
 * Validate email field
 */
export function validateEmail(email: string, t: (key: string) => string): string {
  if (!email || !email.trim()) {
    return t('auth.errEmailRequired')
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return t('auth.errEmailInvalid')
  }
  return ''
}

/**
 * Validate password for login (required + minimum appropriate length)
 */
export function validateLoginPassword(password: string, t: (key: string) => string): string {
  if (!password) {
    return t('auth.errPasswordRequired')
  }
  if (password.length < 8) {
    return t('auth.errPasswordMinLength')
  }
  return ''
}

/**
 * Validate password for registration (required + strict security criteria)
 */
export function validateRegisterPassword(password: string, t: (key: string) => string): string {
  if (!password) {
    return t('auth.errPasswordRequired')
  }
  if (!isPasswordValidForRegister(password)) {
    return t('auth.errPasswordCriteria')
  }
  return ''
}

/**
 * Validate confirm password field
 */
export function validateConfirmPassword(password: string, confirmPassword: string, t: (key: string) => string): string {
  if (!confirmPassword) {
    return t('auth.errConfirmPasswordRequired')
  }
  if (password !== confirmPassword) {
    return t('auth.errPasswordsDontMatch')
  }
  return ''
}

/**
 * Reusable Auth Validation Composable
 */
export function useAuthValidation() {
  return {
    EMAIL_REGEX,
    evaluatePasswordCriteria,
    isPasswordValidForRegister,
    validateEmail,
    validateLoginPassword,
    validateRegisterPassword,
    validateConfirmPassword
  }
}
