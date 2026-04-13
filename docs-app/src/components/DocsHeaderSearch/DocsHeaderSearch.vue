<template>
  <div
    ref="searchElement"
    :class="[
      bemm(),
      isExpanded ? bemm('', 'expanded') : '',
      searchPanelOpen ? bemm('', 'open') : '',
    ]"
  >
    <button
      v-if="!isExpanded"
      :class="bemm('trigger')"
      :aria-label="searchLabel"
      :title="searchLabel"
      type="button"
      @click="openSearch"
    >
      <Icon name="search" />
    </button>

    <div v-else :class="bemm('shell')">
      <Icon name="search" :class="bemm('icon')" />
      <input
        ref="inputElement"
        v-model="query"
        :class="bemm('input')"
        :aria-label="searchLabel"
        :placeholder="searchLabel"
        type="search"
        @keydown="handleSearchKeydown"
      />
      <button
        v-if="query"
        :class="bemm('clear')"
        :aria-label="clearLabel"
        type="button"
        @click="resetSearch"
      >
        <Icon name="close" />
      </button>
    </div>

    <div v-if="searchPanelOpen" :class="bemm('panel')">
      <div :class="bemm('status')">{{ searchStatus }}</div>

      <RouterLink
        v-for="result in searchResults"
        :key="result.id"
        :class="bemm('result')"
        :to="getSearchResultTarget(result.route)"
        @click="closeSearch"
      >
        <span :class="bemm('result-kind')">
          {{ getSearchKindLabel(result.kind) }}
        </span>
        <strong :class="bemm('result-title')">{{ result.title }}</strong>
        <span :class="bemm('result-summary')">
          {{ result.summary || result.excerpt }}
        </span>
      </RouterLink>

      <div v-if="searchResults.length === 0" :class="bemm('empty')">
        {{ t('docs.search.noResults') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'

import { Icon } from '@ui-lib/components/Icon'
import { useSearch } from '@sil/ui'
import type { ContentRouteTarget } from '@sil/ui'
import { buildDocsSearchSources } from '@ui-docs/lib/docsSearchContent'

import type { DocsHeaderSearchProps } from './DocsHeaderSearch.model'
import { useDocsHeaderSearchState } from './DocsHeaderSearch.util'

defineOptions({
  name: 'DocsHeaderSearch',
})

defineProps<DocsHeaderSearchProps>()

const bemm = useBemm('docs-header-search')
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const searchElement = ref<HTMLElement | null>(null)
const inputElement = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const { hasQuery, query, results: searchResults, totalResults } = useSearch({
  limit: 8,
  query: searchQuery,
  sources: computed(() => buildDocsSearchSources(t)),
})
const {
  clearSearch,
  closeSearch,
  isExpanded,
  openSearch: expandSearch,
  searchPanelOpen,
} = useDocsHeaderSearchState(query, hasQuery)

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

function focusInput() {
  nextTick(() => {
    inputElement.value?.focus()
  })
}

function openSearch() {
  expandSearch()
  focusInput()
}

function navigateToSearchResult(target?: ContentRouteTarget) {
  if (!target) {
    return
  }

  router.push(getSearchResultTarget(target))
  closeSearch()
}

function handleSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeSearch()
    return
  }

  if (event.key === 'Enter' && searchResults.value[0]?.route) {
    event.preventDefault()
    navigateToSearchResult(searchResults.value[0].route)
  }
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null

  if (!target || !searchElement.value?.contains(target)) {
    closeSearch()
  }
}

function resetSearch() {
  clearSearch()
  focusInput()
}

watch(() => route.fullPath, () => {
  closeSearch()
})

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style lang="scss">
.docs-header-search {
  position: relative;
  flex: 0 0 auto;

  &--expanded {
    flex: 1 1 24rem;
    width: 100%;
    min-width: 0;
    max-width: 36rem;
  }

  &__trigger {
    --icon-fill: color-mix(in srgb, currentColor, transparent 25%);
    --icon-fill-opacity: 1;
    --icon-stroke-color: currentColor;
    --icon-stroke-color-secondary: currentColor;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid var(--border-color, var(--color-accent));
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-foreground), transparent 97%);
    color: var(--color-foreground);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: color-mix(in srgb, var(--color-primary), transparent 88%);
      border-color: color-mix(in srgb, var(--color-primary), transparent 35%);
      color: var(--color-foreground);
    }

    &:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  &__shell {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    min-width: 0;
    padding: 0.35rem 0.5rem 0.35rem 0.8rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
    transition:
      border-color 140ms ease,
      background-color 140ms ease,
      box-shadow 140ms ease;

    &:focus-within,
    .docs-header-search--open & {
      border-color: color-mix(in srgb, var(--color-primary), transparent 55%);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary), transparent 90%);
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 1%);
    }
  }

  &__icon {
    color: color-mix(in srgb, var(--color-foreground), transparent 44%);
    font-size: 0.95rem;
  }

  &__input {
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;

    &::placeholder {
      color: color-mix(in srgb, var(--color-foreground), transparent 52%);
    }

    &:focus {
      outline: none;
    }
  }

  &__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.8rem;
    height: 1.8rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 42%);
    cursor: pointer;

    &:hover {
      background: color-mix(in srgb, var(--color-foreground), transparent 94%);
      color: inherit;
    }
  }

  &__panel {
    position: absolute;
    top: calc(100% + 0.6rem);
    right: 0;
    width: 100%;
    max-height: min(70vh, 34rem);
    overflow: auto;
    padding: 0.55rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 1rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 2%);
    box-shadow: 0 1.2rem 3rem color-mix(in srgb, var(--color-foreground), transparent 90%);
  }

  &__status {
    padding: 0.35rem 0.55rem 0.55rem;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__result {
    display: grid;
    gap: 0.25rem;
    padding: 0.7rem 0.8rem;
    border-radius: 0.8rem;
    color: inherit;
    text-decoration: none;

    &:hover {
      background: color-mix(in srgb, var(--color-primary), transparent 94%);
    }
  }

  &__result-kind {
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    font-size: 0.74rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__result-title {
    font-size: 0.98rem;
  }

  &__result-summary,
  &__empty {
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    font-size: 0.9rem;
    line-height: 1.45;
  }

  &__empty {
    padding: 0.85rem;
  }

  @media (max-width: 700px) {
    &--expanded {
      max-width: none;
    }
  }
}
</style>
