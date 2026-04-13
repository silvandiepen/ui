import type { LanguageSwitchOption } from './LanguageSwitch.model'

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
  if (option.code) {
    return option.code
  }

  if (!option.value) {
    return ''
  }

  return option.value
    .replace(/_/g, '-')
    .split('-')
    .filter(Boolean)
    .map((segment, index) => {
      if (index === 0 || segment.length <= 3) {
        return segment.toUpperCase()
      }

      return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
    })
    .join('-')
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
  return option.flagSrc ?? null
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

  return implicitCode ?? null
}
