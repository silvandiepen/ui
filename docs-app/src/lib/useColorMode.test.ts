import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DOCS_COLOR_MODE_STORAGE_KEY,
  applyColorMode,
  getInitialColorMode,
  normalizeColorMode,
  resolveSystemColorMode,
} from './useColorMode'

describe('useColorMode helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()

    const storage = new Map<string, string>()

    vi.stubGlobal('document', {
      documentElement: {
        dataset: {},
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
      matchMedia: vi.fn().mockReturnValue({ matches: false }),
    })

    document.documentElement.dataset.colorMode = ''
    window.localStorage.clear()
  })

  it('normalizes only supported color modes', () => {
    expect(normalizeColorMode('light')).toBe('light')
    expect(normalizeColorMode('dark')).toBe('dark')
    expect(normalizeColorMode('system')).toBeNull()
    expect(normalizeColorMode(null)).toBeNull()
  })

  it('applies the color mode to the document root', () => {
    applyColorMode('dark')

    expect(document.documentElement.dataset.colorMode).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('prefers the document color mode when present', () => {
    document.documentElement.dataset.colorMode = 'dark'

    expect(getInitialColorMode()).toBe('dark')
  })

  it('falls back to stored color mode before system preference', () => {
    window.localStorage.setItem(DOCS_COLOR_MODE_STORAGE_KEY, 'light')

    expect(getInitialColorMode()).toBe('light')
  })

  it('uses system preference when no document or stored mode exists', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })

    expect(resolveSystemColorMode()).toBe('dark')
    expect(getInitialColorMode()).toBe('dark')
  })
})
