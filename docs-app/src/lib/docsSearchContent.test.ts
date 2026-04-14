import { describe, expect, it } from 'vitest'

import type { ContentEntryInput, ContentSource } from '@sil/ui'

import { buildDocsSearchSources } from './docsSearchContent'

describe('docs search content', () => {
  it('builds searchable sources for guides, categories, components, and composables', () => {
    const sources = buildDocsSearchSources((key) => key)

    expect(sources.map((source) => source.id)).toEqual([
      'docs-guides',
      'docs-categories',
      'docs-components',
      'docs-composables',
    ])
  })

  it('includes component and composable documentation content in the searchable entries', () => {
    const sources = buildDocsSearchSources((key) => key)
    const componentEntries = getStaticEntries(sources, 'docs-components')
    const composableEntries = getStaticEntries(sources, 'docs-composables')
    const signinEntry = componentEntries.find((entry) => entry.id === 'component:signin-form')
    const inputSelectEntry = componentEntries.find((entry) => entry.title === 'UIInputSelect')
    const useSearchEntry = composableEntries.find((entry) => entry.title === 'useSearch')

    expect(signinEntry?.keywords).toEqual(expect.arrayContaining([
      'LoginForm',
      'UILoginForm',
      'SigninForm',
    ]))
    expect(inputSelectEntry).toEqual(expect.objectContaining({
      id: expect.stringMatching(/^component:/),
      kind: 'component',
      route: expect.objectContaining({
        name: 'docs-component',
      }),
      summary: expect.any(String),
      title: 'UIInputSelect',
    }))
    expect(inputSelectEntry?.content).toContain('InputSelect')

    expect(useSearchEntry).toEqual(expect.objectContaining({
      id: 'composable:useSearch',
      kind: 'composable',
      route: {
        name: 'docs-composable',
        params: {
          slug: 'use-search',
        },
      },
      title: 'useSearch',
    }))
    expect(useSearchEntry?.content).toContain('useContent')
  })
})

function getStaticEntries(sources: ContentSource[], id: string): ContentEntryInput[] {
  const source = sources.find((entry) => entry.id === id)

  if (!source || typeof source.entries === 'function') {
    return []
  }

  return source.entries
}
