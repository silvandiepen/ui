import type { LanguageSwitchOption } from './LanguageSwitch.model'

const LANGUAGE_SWITCH_FLAG_BASE_URL = 'https://arevdata.com/flags/svg'

export function findLanguageSwitchOption(
  options: LanguageSwitchOption[],
  value?: string,
): LanguageSwitchOption | null {
  if (!value) {
    return null
  }

  for (const option of options) {
    if (option.value === value) {
      return option
    }

    if (!option.children?.length) {
      continue
    }

    const nestedMatch = findLanguageSwitchOption(option.children, value)

    if (nestedMatch) {
      return nestedMatch
    }
  }

  return null
}

export function isLanguageSwitchOptionSelectable(option: LanguageSwitchOption) {
  return Boolean(option.value) && !option.disabled
}

export function flattenLanguageSwitchOptions(options: LanguageSwitchOption[]) {
  const flattened: LanguageSwitchOption[] = []

  for (const option of options) {
    if (isLanguageSwitchOptionSelectable(option)) {
      flattened.push(option)
    }

    if (option.children?.length) {
      flattened.push(...flattenLanguageSwitchOptions(option.children))
    }
  }

  return flattened
}

export function getLanguageSwitchPrimaryOption(
  option: LanguageSwitchOption,
): LanguageSwitchOption | null {
  if (isLanguageSwitchOptionSelectable(option)) {
    return option
  }

  if (!option.children?.length) {
    return null
  }

  for (const child of option.children) {
    const primaryOption = getLanguageSwitchPrimaryOption(child)

    if (primaryOption) {
      return primaryOption
    }
  }

  return null
}

export function optionHasSelectedDescendant(
  option: LanguageSwitchOption,
  value?: string,
): boolean {
  if (!value || !option.children?.length) {
    return false
  }

  return option.children.some((child) =>
    child.value === value || optionHasSelectedDescendant(child, value),
  )
}

export function getLanguageSwitchOptionCode(option: LanguageSwitchOption) {
  const primaryOption = getLanguageSwitchPrimaryOption(option) ?? option

  if (primaryOption.code) {
    return primaryOption.code
  }

  if (!primaryOption.value) {
    return ''
  }

  return primaryOption.value
    .replace(/_/g, '-')
}

export function getLanguageSwitchFlagEmoji(option: LanguageSwitchOption) {
  if (option.flagEmoji) {
    return option.flagEmoji
  }

  const regionCode = getLanguageSwitchRegionCode(option)

  if (!regionCode) {
    return null
  }

  return regionCode
    .split('')
    .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
    .join('')
}

export function getLanguageSwitchFlagSrc(option: LanguageSwitchOption) {
  if (option.flagSrc) {
    return option.flagSrc
  }

  const regionCode = getLanguageSwitchRegionCode(option)

  if (!regionCode) {
    return null
  }

  return `${LANGUAGE_SWITCH_FLAG_BASE_URL}/${regionCode.toLowerCase()}.svg`
}

function getLanguageSwitchRegionCode(option: LanguageSwitchOption) {
  const explicitCode = option.regionCode?.trim().toUpperCase()

  if (explicitCode && /^[A-Z]{2}$/.test(explicitCode)) {
    return explicitCode
  }

  const implicitCode = option.value
    ?.replace(/_/g, '-')
    .split('-')
    .slice(1)
    .find((segment) => /^[a-z]{2}$/i.test(segment))
    ?.toUpperCase()

  if (implicitCode) {
    return implicitCode
  }

  const primaryOption = getLanguageSwitchPrimaryOption(option)

  if (!primaryOption || primaryOption === option) {
    return null
  }

  return getLanguageSwitchRegionCode(primaryOption)
}
