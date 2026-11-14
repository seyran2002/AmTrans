import type { Country, Office } from '~/types/office'

/**
 * Returns localized country name based on the active language code
 */
export const getCountryName = (c: Country, lang = 'en'): string => {
  const langKey = `${lang}Name` as keyof Country
  return (c[langKey] as string) || c.hyName || c.enName || c.ruName || 'Unnamed Country'
}

/**
 * Returns the country's flag image URL or icon emoji
 */
export const getCountryFlag = (c?: Country | null): string | null => {
  if (!c) return null
  return c.flag || c.icon || null
}

/**
 * Determines whether a country flag value is an image URL/data URI
 */
export const isFlagImageUrl = (flag?: string | null): boolean => {
  if (!flag) return false
  return flag.startsWith('http') || flag.startsWith('data:')
}

/**
 * Finds country corresponding to office's countryId
 */
export const findOfficeCountry = (countries: Country[], countryId: string): Country | undefined => {
  return countries.find(c => c.id === countryId)
}

/**
 * Counts total offices residing in a given country
 */
export const countOfficesInCountry = (offices: Office[], countryId: string): number => {
  return offices.filter(o => o.countryId === countryId).length
}
