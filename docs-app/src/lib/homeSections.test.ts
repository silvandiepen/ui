import { describe, expect, it } from 'vitest'
import { Status } from '../../../src/types'

import type { UIComponentCatalogEntry } from './componentCatalog.model'
import { buildDocsHomeSections } from './homeSections'

function createEntry(overrides: Partial<UIComponentCatalogEntry>): UIComponentCatalogEntry {
  return {
    aliases: [],
    apiName: 'UICard',
    category: 'Foundations',
    categoryId: 'foundations',
    docs: [],
    examplePath: null,
    name: 'Card',
    slug: 'card',
    sourcePath: 'src/components/Card',
    status: 'stable',
    statusTone: Status.SUCCESS,
    summary: 'Example summary.',
    ...overrides,
  }
}

describe('buildDocsHomeSections', () => {
  it('keeps the configured section order and omits empty categories', () => {
    const sections = buildDocsHomeSections([
      createEntry({
        apiName: 'UIActions',
        category: 'Data and Navigation',
        categoryId: 'data-and-navigation',
        name: 'Actions',
        slug: 'actions',
        sourcePath: 'src/components/Actions',
        summary: 'Actions summary.',
      }),
      createEntry({
        apiName: 'UIForm',
        category: 'Forms',
        categoryId: 'forms',
        name: 'Form',
        slug: 'form-form',
        sourcePath: 'src/components/Form/Form',
        summary: 'Form summary.',
      }),
      createEntry({
        apiName: 'UICard',
        category: 'Foundations',
        categoryId: 'foundations',
        name: 'Card',
        slug: 'card',
        sourcePath: 'src/components/Card',
        summary: 'Card summary.',
      }),
    ])

    expect(sections.map((section) => section.id)).toEqual([
      'foundations',
      'forms',
      'data-and-navigation',
    ])
    expect(sections[0]?.sectionId).toBe('core')
    expect(sections[0]?.items.map((item) => item.apiName)).toEqual(['UICard'])
    expect(sections[1]?.items.map((item) => item.apiName)).toEqual(['UIForm'])
    expect(sections[2]?.items.map((item) => item.apiName)).toEqual(['UIActions'])
  })
})
