import { computed, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useDocsHeaderSearchState } from './DocsHeaderSearch.util'

describe('DocsHeaderSearch', () => {
  it('starts collapsed and only opens the panel when a query exists', () => {
    const query = ref('')
    const hasQuery = computed(() => query.value.trim().length > 0)
    const state = useDocsHeaderSearchState(query, hasQuery)

    expect(state.isExpanded.value).toBe(false)
    expect(state.searchPanelOpen.value).toBe(false)

    state.openSearch()

    expect(state.isExpanded.value).toBe(true)
    expect(state.searchPanelOpen.value).toBe(false)

    query.value = 'button'

    expect(state.searchPanelOpen.value).toBe(true)
  })

  it('clears the query without collapsing when reset is used', () => {
    const query = ref('button')
    const hasQuery = computed(() => query.value.trim().length > 0)
    const state = useDocsHeaderSearchState(query, hasQuery)

    state.openSearch()
    state.clearSearch()

    expect(state.isExpanded.value).toBe(true)
    expect(query.value).toBe('')
    expect(state.searchPanelOpen.value).toBe(false)
  })

  it('collapses and clears the query when closed', () => {
    const query = ref('button')
    const hasQuery = computed(() => query.value.trim().length > 0)
    const state = useDocsHeaderSearchState(query, hasQuery)

    state.openSearch()
    state.closeSearch()

    expect(state.isExpanded.value).toBe(false)
    expect(query.value).toBe('')
    expect(state.searchPanelOpen.value).toBe(false)
  })
})
