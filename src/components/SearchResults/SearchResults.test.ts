import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'

import type { SearchResult } from '../../composables'

import SearchResults from './SearchResults.vue'

const results: SearchResult[] = [
  {
    content: 'Header search shell',
    excerpt: 'Expandable search shell',
    id: 'header-search',
    keywordText: 'header search',
    kind: 'component',
    normalizedText: 'header search shell',
    route: {
      name: 'docs-component',
      params: {
        slug: 'header-search',
      },
    },
    score: 42,
    sourceId: 'docs-components',
    summary: 'Expandable search trigger and input.',
    title: 'HeaderSearch',
    titleText: 'headersearch',
  },
]

async function renderSearchResults(props: Record<string, unknown>) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        component: {
          template: '<div />',
        },
        name: 'docs-component',
        path: '/components/:slug',
      },
    ],
  })

  await router.push('/components/header-search')
  await router.isReady()

  return renderToString(createSSRApp({
    render: () => h(SearchResults, props),
  }).use(router))
}

describe('SearchResults', () => {
  it('renders a ready state before the user has entered a query', async () => {
    const html = await renderSearchResults({
      readyLabel: 'Type to search the docs',
    })

    expect(html).toContain('Type to search the docs')
  })

  it('renders linked search results by default', async () => {
    const html = await renderSearchResults({
      hasQuery: true,
      results,
    })

    expect(html).toContain('HeaderSearch')
    expect(html).toContain('Component')
    expect(html).toContain('/components/header-search')
  })

  it('renders the empty state when the query has no matches', async () => {
    const html = await renderSearchResults({
      emptyLabel: 'No results found',
      hasQuery: true,
    })

    expect(html).toContain('No results found')
  })
})
