<template>
  <HeaderSearch
    ref="headerSearch"
    v-model="searchQuery"
    :class="bemm()"
    :clear-label="clearLabel"
    :open-label="searchLabel"
    :placeholder="searchLabel"
    @keydown="handleSearchKeydown"
  >
    <template #panel>
      <SearchResults
        :empty-label="t('docs.search.noResults')"
        :has-query="hasQuery"
        :ready-label="t('docs.search.ready')"
        :resolve-kind-label="getSearchKindLabel"
        :resolve-to="resolveSearchResultTarget"
        :results="searchResults"
        :status-label="searchStatus"
        @select="closeSearch"
      />
    </template>
  </HeaderSearch>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'

import { HeaderSearch } from '@ui-lib/components/HeaderSearch'
import type { HeaderSearchExposed } from '@ui-lib/components/HeaderSearch'
import { SearchResults } from '@ui-lib/components/SearchResults'
import { useSearch } from '@sil/ui'
import type { ContentRouteTarget } from '@sil/ui'
import { buildDocsSearchSources } from '@ui-docs/lib/docsSearchContent'

import type { DocsHeaderSearchProps } from './DocsHeaderSearch.model'

defineOptions({
  name: 'DocsHeaderSearch',
})

defineProps<DocsHeaderSearchProps>()

const bemm = useBemm('docs-header-search', { includeBaseClass: true })
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const headerSearch = ref<HeaderSearchExposed | null>(null)
const searchQuery = ref('')
const { hasQuery, results: searchResults, totalResults } = useSearch({
  limit: 8,
  query: searchQuery,
  sources: computed(() => buildDocsSearchSources(t)),
})

const searchLabel = computed(() => t('docs.search.placeholder'))
const clearLabel = computed(() => t('docs.common.actions.reset'))
const searchStatus = computed(() => (
  hasQuery.value
    ? (
      totalResults.value > 0
        ? t('docs.search.results', { count: totalResults.value })
        : t('docs.search.noResults')
    )
    : ''
))

function getSearchKindLabel(kind?: string) {
  return t(`docs.search.kinds.${kind || 'page'}`)
}

function getSearchResultTarget(target?: ContentRouteTarget): RouteLocationRaw {
  return (target || '/') as RouteLocationRaw
}

function resolveSearchResultTarget(result: typeof searchResults.value[number]) {
  return getSearchResultTarget(result.route)
}

function closeSearch() {
  headerSearch.value?.closeSearch()
}

function navigateToSearchResult(target?: ContentRouteTarget) {
  if (!target) {
    return
  }

  router.push(getSearchResultTarget(target))
  closeSearch()
}

function handleSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && searchResults.value[0]?.route) {
    event.preventDefault()
    navigateToSearchResult(searchResults.value[0].route)
  }
}

watch(() => route.fullPath, () => {
  closeSearch()
})
</script>

<style lang="scss">
.docs-header-search {}
</style>
