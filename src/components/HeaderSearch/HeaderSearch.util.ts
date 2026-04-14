import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export interface HeaderSearchState {
  clearSearch: () => void
  closeSearch: () => void
  hasValue: ComputedRef<boolean>
  isExpanded: Ref<boolean>
  openSearch: () => void
}

export function isOutsideHeaderSearch(
  searchElement: Pick<HTMLElement, 'contains'> | null,
  target: Node | null,
) {
  return !target || !searchElement?.contains(target)
}

export function shouldShowHeaderSearchPanel(
  isExpanded: boolean,
  hasValue: boolean,
  showPanelOnEmptyQuery = false,
) {
  return isExpanded && (hasValue || showPanelOnEmptyQuery)
}

export function useHeaderSearchState(
  query: Ref<string>,
  options: {
    clearOnClose?: boolean
  } = {},
): HeaderSearchState {
  const isExpanded = ref(false)
  const hasValue = computed(() => query.value.trim().length > 0)
  const clearOnClose = options.clearOnClose ?? true

  function openSearch() {
    isExpanded.value = true
  }

  function closeSearch() {
    isExpanded.value = false

    if (clearOnClose) {
      query.value = ''
    }
  }

  function clearSearch() {
    query.value = ''
  }

  return {
    clearSearch,
    closeSearch,
    hasValue,
    isExpanded,
    openSearch,
  }
}
