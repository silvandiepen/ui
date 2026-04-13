import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DOCS_DEFAULT_LOCALE, i18n } from '../i18n'
import {
  DOCS_LOCALE_STORAGE_KEY,
  applyDocsLocale,
  getInitialDocsLocale,
  normalizeDocsLocale,
} from './useDocsLocale'

describe('useDocsLocale helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()

    const storage = new Map<string, string>()

    vi.stubGlobal('document', {
      documentElement: {
        dataset: {},
        lang: '',
      },
    })

    vi.stubGlobal('window', {
      localStorage: {
        clear() {
          storage.clear()
        },
        getItem(key: string) {
          return storage.get(key) ?? null
        },
        removeItem(key: string) {
          storage.delete(key)
        },
        setItem(key: string, value: string) {
          storage.set(key, value)
        },
      },
    })

    document.documentElement.lang = ''
    window.localStorage.clear()
    i18n.global.locale.value = DOCS_DEFAULT_LOCALE
  })

  it('normalizes only supported docs locales', () => {
    expect(normalizeDocsLocale('en')).toBe('en')
    expect(normalizeDocsLocale('en-US')).toBe('en-US')
    expect(normalizeDocsLocale('de')).toBeNull()
    expect(normalizeDocsLocale(null)).toBeNull()
  })

  it('applies the locale to the document root', () => {
    applyDocsLocale('nl')

    expect(document.documentElement.lang).toBe('nl')
  })

  it('prefers the document language when present', () => {
    document.documentElement.lang = 'fr'

    expect(getInitialDocsLocale()).toBe('fr')
  })

  it('falls back to stored locale before the i18n default', () => {
    window.localStorage.setItem(DOCS_LOCALE_STORAGE_KEY, 'en-AU')

    expect(getInitialDocsLocale()).toBe('en-AU')
  })

  it('returns the default locale when no valid source exists', () => {
    expect(getInitialDocsLocale()).toBe(DOCS_DEFAULT_LOCALE)
  })
})
