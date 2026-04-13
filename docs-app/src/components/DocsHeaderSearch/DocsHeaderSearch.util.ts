import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export interface DocsHeaderSearchState {
  clearSearch: () => void
  closeSearch: () => void
  isExpanded: Ref<boolean>
  openSearch: () => void
  searchPanelOpen: ComputedRef<boolean>
}

export function useDocsHeaderSearchState(
  query: Ref<string>,
  hasQuery: Ref<boolean> | ComputedRef<boolean>,
): DocsHeaderSearchState {
  const isExpanded = ref(false)
  const searchPanelOpen = computed(() => isExpanded.value && hasQuery.value)

  function openSearch() {
    isExpanded.value = true
  }

  function closeSearch() {
    isExpanded.value = false
    query.value = ''
  }

  function clearSearch() {
    query.value = ''
  }

  return {
    clearSearch,
    closeSearch,
    isExpanded,
    openSearch,
    searchPanelOpen,
  }
}
