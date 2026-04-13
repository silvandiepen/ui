import { computed, ref, toValue } from 'vue'

import { useContent } from './useContent'
import { useI18n } from './useI18n'

import type { ContentEntry } from './useContent.model'
import type { SearchResult, UseSearchOptions } from './useSearch.model'
import { normalizeSearchText } from './useContent'

export function useSearch(options: UseSearchOptions = {}) {
  const { locale } = useI18n()
  const query = options.query ?? ref(options.initialQuery ?? '')
  const resolvedLocale = computed(() => toValue(options.locale) || locale.value || 'en')
  const limit = options.limit ?? 8
  const minQueryLength = options.minQueryLength ?? 1

  const content = useContent({
    entries: options.entries,
    locale: resolvedLocale,
    sources: options.sources,
  })

  const rankedResults = computed(() =>
    collectSearchResults(
      content.items.value,
      query.value,
      resolvedLocale.value,
      minQueryLength,
    ),
  )

  const hasQuery = computed(() => query.value.trim().length >= minQueryLength)

  const results = computed(() => rankedResults.value.slice(0, limit))

  const totalResults = computed(() => rankedResults.value.length)

  function clear() {
    query.value = ''
  }

  return {
    clear,
    hasQuery,
    query,
    results,
    totalResults,
  }
}

export function searchContentEntries(
  entries: ContentEntry[],
  query: string,
  locale: string,
  limit: number,
  minQueryLength = 1,
): SearchResult[] {
  return collectSearchResults(entries, query, locale, minQueryLength).slice(0, limit)
}

function collectSearchResults(
  entries: ContentEntry[],
  query: string,
  locale: string,
  minQueryLength = 1,
): SearchResult[] {
  const normalizedQuery = normalizeSearchText(query, locale)

  if (normalizedQuery.length < minQueryLength) {
    return []
  }

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean)
  const results = entries
    .map((entry) => ({
      ...entry,
      score: scoreEntry(entry, normalizedQuery, tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return left.title.localeCompare(right.title)
    })

  return results
}

function scoreEntry(entry: ContentEntry, query: string, tokens: string[]): number {
  if (!tokens.every((token) => entry.normalizedText.includes(token))) {
    return 0
  }

  let score = 0

  if (entry.titleText === query) {
    score += 300
  } else if (entry.titleText.startsWith(query)) {
    score += 220
  } else if (entry.titleText.includes(query)) {
    score += 160
  }

  if (entry.keywordText.includes(query)) {
    score += 120
  }

  if (entry.normalizedText.includes(query)) {
    score += 60
  }

  for (const token of tokens) {
    if (entry.titleText.startsWith(token)) {
      score += 30
    } else if (entry.titleText.includes(token)) {
      score += 20
    }

    if (entry.keywordText.includes(token)) {
      score += 14
    }

    if (entry.normalizedText.includes(token)) {
      score += 6
    }
  }

  if (entry.kind) {
    score += 4
  }

  return score
}
