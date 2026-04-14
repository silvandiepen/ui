# useSearch

`useSearch()` performs lightweight content search on top of `useContent()`.

It uses `useI18n()` for locale-aware normalization and works well for docs, static guides, and app-provided content sources.

## Returns

- `query`: reactive search query
- `results`: ranked search results
- `totalResults`: total number of matches before the visible result limit is applied
- `hasQuery`: whether the query is long enough to search
- `clear()`: reset the current query

## Example

```ts
import { computed } from 'vue'
import { useSearch } from '@sil/ui'

const { query, results } = useSearch({
  limit: 8,
  sources: computed(() => [
    {
      id: 'app-docs',
      entries: [
        {
          id: 'docs:overview',
          title: 'Overview',
          summary: 'Platform overview and navigation.',
          content: 'Projects, settings, members, and billing.',
          route: '/docs/overview',
          kind: 'guide',
        },
      ],
    },
  ]),
})
```

## Search Behavior

- Title matches rank above keyword and body matches
- All query tokens must be present in the normalized entry text
- Results are capped with the configured `limit`

## Docs Pattern

Use `useSearch()` with `useContent()` or curated `sources` when you need a lightweight docs or command-palette search.

```ts
import { computed } from 'vue'
import { useSearch } from '@sil/ui'

const { hasQuery, query, results } = useSearch({
  query: searchQuery,
  sources: computed(() => [
    {
      id: 'guides',
      entries: [
        {
          id: 'guide:getting-started',
          title: 'Getting Started',
          summary: 'Install the library and wire the Vite plugin.',
          content: 'Theme setup, aliases, and shared styles.',
          route: { name: 'docs-guide-getting-started' },
          kind: 'guide',
        },
      ],
    },
  ]),
})
```

- Keep entries small and curated instead of indexing raw application records.
- Include `keywords` and `route` values so result lists can rank well and navigate immediately.
- Pair `hasQuery` with an expanded search UI so the shell can open before the user has typed anything.

## Notes

- `useSearch()` is intentionally lightweight and does not ship a full-text index.
- For larger datasets, feed pre-curated static content slices instead of raw application data dumps.
