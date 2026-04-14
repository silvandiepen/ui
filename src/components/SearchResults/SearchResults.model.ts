import type { RouteLocationRaw } from 'vue-router'

import type { SearchResult } from '../../composables'

export interface SearchResultsProps {
  /**
   * Text shown when a query has been entered but there are no matches.
   * @default ''
   */
  emptyLabel?: string

  /**
   * Whether the current query is active.
   * @default false
   */
  hasQuery?: boolean

  /**
   * Optional helper that maps the result kind to display copy.
   */
  resolveKindLabel?: (kind?: string) => string

  /**
   * Optional helper that maps a result to a router target.
   */
  resolveTo?: (result: SearchResult) => RouteLocationRaw | undefined

  /**
   * Search results returned by useSearch().
   * @default []
   */
  results?: SearchResult[]

  /**
   * Text shown before the user has entered a query.
   * @default ''
   */
  readyLabel?: string

  /**
   * Optional status copy rendered above the results.
   * @default ''
   */
  statusLabel?: string
}

export interface SearchResultsEmits {
  select: [result: SearchResult]
}
