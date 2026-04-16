<template>
  <div :class="bemm()">
      <label :class="bemm('label')" for="search-results-example-query">Search docs</label>
      <input
        id="search-results-example-query"
        v-model="query"
        :class="bemm('input')"
        placeholder="Search components and composables"
        type="search"
      />

      <SearchResults
        :empty-label="'No results found'"
        :has-query="hasQuery"
        :ready-label="'Type to search the example entries'"
        :results="results"
        :status-label="hasQuery ? `${totalResults} results` : ''"
      />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useBemm } from 'bemm'

import { useSearch } from '../../composables'
import { SearchResults } from './index'

const bemm = useBemm('search-results-example')
const query = ref('')
const { hasQuery, results, totalResults } = useSearch({
  entries: [
    {
      content: 'Header search shell for app bars and docs headers.',
      id: 'header-search',
      kind: 'component',
      summary: 'Expandable search trigger and input.',
      title: 'HeaderSearch',
    },
    {
      content: 'List search output from useSearch with empty and ready states.',
      id: 'search-results',
      kind: 'component',
      summary: 'Reusable search result list surface.',
      title: 'SearchResults',
    },
    {
      content: 'Composable that ranks content entries and returns filtered results.',
      id: 'use-search',
      kind: 'composable',
      summary: 'Lightweight content search.',
      title: 'useSearch',
    },
  ],
  query,
})
</script>

<style lang="scss">
.search-results-example {
  display: grid;
  gap: 0.85rem;

  &__label {
    font-size: 0.9rem;
    font-weight: 600;
  }

  &__input {
    padding: 0.7rem 0.85rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 86%);
    border-radius: 0.85rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 2%);
    color: inherit;
    font: inherit;
  }
}
</style>
