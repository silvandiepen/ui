import { createSSRApp, h, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import HeaderSearch from './HeaderSearch.vue'
import {
  isOutsideHeaderSearch,
  shouldShowHeaderSearchPanel,
  useHeaderSearchState,
} from './HeaderSearch.util'

describe('HeaderSearch helpers', () => {
  it('tracks expanded state and clears the query on close by default', () => {
    const query = ref('docs')
    const state = useHeaderSearchState(query)

    state.openSearch()

    expect(state.isExpanded.value).toBe(true)
    expect(state.hasValue.value).toBe(true)

    state.closeSearch()

    expect(state.isExpanded.value).toBe(false)
    expect(query.value).toBe('')
  })

  it('supports keeping the query when the shell closes', () => {
    const query = ref('docs')
    const state = useHeaderSearchState(query, {
      clearOnClose: false,
    })

    state.openSearch()
    state.closeSearch()

    expect(query.value).toBe('docs')
  })

  it('detects clicks outside the search shell', () => {
    const inside = {} as Node
    const outside = {} as Node
    const element = {
      contains(target: Node | null) {
        return target === inside
      },
    }

    expect(isOutsideHeaderSearch(element, inside)).toBe(false)
    expect(isOutsideHeaderSearch(element, outside)).toBe(true)
    expect(isOutsideHeaderSearch(null, outside)).toBe(true)
  })

  it('keeps the panel closed until there is a query by default', () => {
    expect(shouldShowHeaderSearchPanel(true, false)).toBe(false)
    expect(shouldShowHeaderSearchPanel(true, true)).toBe(true)
    expect(shouldShowHeaderSearchPanel(true, false, true)).toBe(true)
  })
})

describe('HeaderSearch', () => {
  it('renders a collapsed trigger on the server', async () => {
    const html = await renderToString(createSSRApp({
      render: () => h(HeaderSearch, {
        openLabel: 'Search docs',
        placeholder: 'Search docs',
      }, {
        panel: () => h('div', 'Results'),
      }),
    }))

    expect(html).toContain('header-search')
    expect(html).toContain('header-search__trigger')
    expect(html).toContain('aria-label="Search docs"')
  })
})
