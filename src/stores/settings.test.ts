import { beforeEach, describe, expect, it, vi } from 'vitest'

import { configureSettings, useSettings } from './settings'

describe('settings store', () => {
  beforeEach(() => {
    const storage = new Map<string, string>()

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value)
        },
        removeItem: (key: string) => {
          storage.delete(key)
        },
      },
    })

    configureSettings(null)
    useSettings().clearAll()
  })

  it('stores sidebar navigation section state by key', () => {
    const settings = useSettings()

    settings.setSidebarNavigationSections('docs-sidebar', {
      foundations: true,
      guides: false,
    })

    expect(settings.getSidebarNavigationSections('docs-sidebar')).toEqual({
      foundations: true,
      guides: false,
    })
  })

  it('calls configured save handlers without changing default local persistence', async () => {
    const save = vi.fn().mockResolvedValue(undefined)
    configureSettings({ save })

    const settings = useSettings()
    settings.setPerPage('projects-table', 50)
    await settings.whenSaved()

    expect(settings.getPerPage('projects-table')).toBe(50)
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        perPage: {
          'projects-table': 50,
        },
      }),
      {
        area: 'perPage',
        cause: 'set',
        value: 50,
        valueKey: 'projects-table',
      },
    )
  })

  it('stores resizable sizes by key', () => {
    const settings = useSettings()

    settings.setResizableSize('docs-layout-sidebar', 284)

    expect(settings.getResizableSize('docs-layout-sidebar')).toBe(284)
  })

  it('hydrates settings from configured load handlers', async () => {
    configureSettings({
      load: vi.fn().mockResolvedValue({
        resizableSizes: {
          'docs-layout-sidebar': 296,
        },
        sidebarNavigationSections: {
          docs: {
            guides: true,
          },
        },
        perPage: {
          people: 30,
        },
      }),
    })

    const settings = useSettings()
    await settings.hydrate()

    expect(settings.getResizableSize('docs-layout-sidebar')).toBe(296)
    expect(settings.getSidebarNavigationSections('docs')).toEqual({
      guides: true,
    })
    expect(settings.getPerPage('people')).toBe(30)
  })
})
