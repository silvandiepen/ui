import { describe, expect, it } from 'vitest'

import {
  getComposableBySlug,
  getComposableCatalog,
  slugifyComposableName,
} from './composableCatalog'

describe('composable catalog', () => {
  it('assigns stable slugs to cataloged composables', () => {
    const entries = getComposableCatalog()

    expect(entries.map((entry) => entry.slug)).toEqual([
      'use-confirm',
      'use-content',
      'use-i18n',
      'use-id',
      'use-input',
      'use-settings',
      'use-search',
    ])
  })

  it('finds a composable entry by slug', () => {
    expect(getComposableBySlug('use-search')).toEqual(expect.objectContaining({
      name: 'useSearch',
      sourcePath: 'src/composables/useSearch.ts',
    }))
  })

  it('slugifies composable names consistently', () => {
    expect(slugifyComposableName('useSearch')).toBe('use-search')
    expect(slugifyComposableName('useI18n')).toBe('use-i18n')
  })
})
