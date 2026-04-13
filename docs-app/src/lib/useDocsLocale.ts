import { onMounted, ref } from 'vue'

import {
  DOCS_DEFAULT_LOCALE,
  DOCS_SUPPORTED_LOCALES,
  i18n,
  type DocsLocale,
} from '../i18n'

export const DOCS_LOCALE_STORAGE_KEY = 'ui-docs-locale'

export function normalizeDocsLocale(value?: string | null): DocsLocale | null {
  if (!value) {
    return null
  }

  return DOCS_SUPPORTED_LOCALES.includes(value as DocsLocale)
    ? value as DocsLocale
    : null
}

export function applyDocsLocale(locale: DocsLocale) {
  i18n.global.locale.value = locale

  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.lang = locale
}

export function getInitialDocsLocale(): DocsLocale {
  if (typeof document !== 'undefined') {
    const documentLocale = normalizeDocsLocale(document.documentElement.lang)

    if (documentLocale) {
      return documentLocale
    }
  }

  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    const storedLocale = normalizeDocsLocale(window.localStorage.getItem(DOCS_LOCALE_STORAGE_KEY))

    if (storedLocale) {
      return storedLocale
    }
  }

  return normalizeDocsLocale(i18n.global.locale.value) ?? DOCS_DEFAULT_LOCALE
}

export function useDocsLocale() {
  const locale = ref<DocsLocale>(getInitialDocsLocale())

  const setLocale = (value: string) => {
    const nextLocale = normalizeDocsLocale(value) ?? DOCS_DEFAULT_LOCALE

    locale.value = nextLocale
    applyDocsLocale(nextLocale)

    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(DOCS_LOCALE_STORAGE_KEY, nextLocale)
    }
  }

  applyDocsLocale(locale.value)

  onMounted(() => {
    applyDocsLocale(locale.value)
  })

  return {
    locale,
    setLocale,
  }
}
