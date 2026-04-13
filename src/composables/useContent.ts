import { computed, shallowRef, toValue } from 'vue'

import type {
  ContentConfiguration,
  ContentEntry,
  ContentEntryInput,
  ContentSource,
  UseContentOptions,
} from './useContent.model'

const CONFIGURED_INLINE_SOURCE_ID = '__configured-content__'
const configuredSources = shallowRef<ContentSource[]>([])

export function configureContent(configuration?: ContentConfiguration | null) {
  configuredSources.value = buildConfiguredSources(configuration)
}

export function registerContentSource(source: ContentSource) {
  configuredSources.value = [
    ...configuredSources.value.filter((entry) => entry.id !== source.id),
    source,
  ]
}

export function removeContentSource(id: string) {
  configuredSources.value = configuredSources.value.filter((entry) => entry.id !== id)
}

export function useContent(options: UseContentOptions = {}) {
  const locale = computed(() => toValue(options.locale) || 'en')

  const sources = computed(() => {
    const localSources = toValue(options.sources) ?? []
    const localEntries = toValue(options.entries) ?? []

    return [
      ...configuredSources.value,
      ...buildInlineSources(localEntries, 'local'),
      ...localSources,
    ]
  })

  const items = computed<ContentEntry[]>(() => {
    const resolvedLocale = locale.value
    const entries = sources.value.flatMap((source) =>
      normalizeSourceEntries(source, resolvedLocale),
    )

    return dedupeEntries(entries)
  })

  return {
    items,
  }
}

function buildConfiguredSources(configuration?: ContentConfiguration | null): ContentSource[] {
  if (!configuration) {
    return []
  }

  return [
    ...buildInlineSources(configuration.entries ?? [], CONFIGURED_INLINE_SOURCE_ID),
    ...(configuration.sources ?? []),
  ]
}

function buildInlineSources(entries: ContentEntryInput[], id: string): ContentSource[] {
  if (!entries.length) {
    return []
  }

  return [{
    entries,
    id,
  }]
}

function normalizeSourceEntries(source: ContentSource, locale: string): ContentEntry[] {
  const rawEntries = typeof source.entries === 'function'
    ? source.entries({ locale })
    : source.entries

  return rawEntries.map((entry) => normalizeEntry(entry, source.id, locale))
}

function normalizeEntry(
  entry: ContentEntryInput,
  sourceId: string,
  locale: string,
): ContentEntry {
  const titleText = normalizeSearchText(entry.title, locale)
  const keywordText = normalizeSearchText((entry.keywords ?? []).join(' '), locale)
  const summaryText = stripSearchMarkup(entry.summary ?? '')
  const contentText = stripSearchMarkup(entry.content ?? '')
  const excerpt = buildExcerpt(summaryText || contentText)

  return {
    ...entry,
    excerpt,
    keywordText,
    normalizedText: normalizeSearchText(
      [
        entry.title,
        entry.summary,
        entry.content,
        ...(entry.keywords ?? []),
        entry.kind,
      ].filter(Boolean).join(' '),
      locale,
    ),
    sourceId,
    titleText,
  }
}

function dedupeEntries(entries: ContentEntry[]): ContentEntry[] {
  const map = new Map<string, ContentEntry>()

  for (const entry of entries) {
    map.set(entry.id, entry)
  }

  return [...map.values()]
}

function buildExcerpt(value: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ')

  if (!normalized) {
    return ''
  }

  return normalized.length > 180
    ? `${normalized.slice(0, 177).trimEnd()}...`
    : normalized
}

export function stripSearchMarkup(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/^[>#*\-+]+\s*/gm, ' ')
    .replace(/[_*~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeSearchText(value: string, locale: string): string {
  return stripSearchMarkup(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase(locale)
}
