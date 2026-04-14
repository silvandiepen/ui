# SearchResults

`SearchResults` is a reusable list surface for `useSearch()` output.

It renders a ready state, an empty state, and a default result layout for `SearchResult[]`. By default, entries with a `route` render as router links, so the same component can power inline panels and dedicated search pages.

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISearchResults, useSearch } from '@sil/ui'

const query = ref('')

const { hasQuery, results, totalResults } = useSearch({
  entries: [
    {
      id: 'header-search',
      title: 'HeaderSearch',
      summary: 'Expandable header search',
      content: 'Expandable header search shell with inline panel support.',
    },
  ],
  query,
})
</script>

<template>
  <UISearchResults
    :has-query="hasQuery"
    :results="results"
    :status-label="hasQuery ? `${totalResults} results` : ''"
    empty-label="No results found"
    ready-label="Type to search"
  />
</template>
```

## Notes

- Pass `results` directly from `useSearch()`.
- Use `resolveKindLabel` when result kinds need translated or app-specific copy.
- Use the `result` slot when you need a custom row layout while keeping the ready and empty states.
