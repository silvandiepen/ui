import type { MaybeRefOrGetter } from 'vue'

export type ContentRouteTarget = string | {
  hash?: string
  name?: string
  params?: Record<string, unknown>
  path?: string
  query?: Record<string, unknown>
}

export interface ContentEntryInput {
  content?: string
  id: string
  keywords?: string[]
  kind?: string
  route?: ContentRouteTarget
  summary?: string
  title: string
}

export interface ContentEntry extends ContentEntryInput {
  excerpt: string
  keywordText: string
  normalizedText: string
  sourceId: string
  titleText: string
}

export interface ContentSourceContext {
  locale: string
}

export interface ContentSource {
  entries: ContentEntryInput[] | ((context: ContentSourceContext) => ContentEntryInput[])
  id: string
}

export interface ContentConfiguration {
  entries?: ContentEntryInput[]
  sources?: ContentSource[]
}

export interface UseContentOptions {
  entries?: MaybeRefOrGetter<ContentEntryInput[] | undefined>
  locale?: MaybeRefOrGetter<string | undefined>
  sources?: MaybeRefOrGetter<ContentSource[] | undefined>
}
