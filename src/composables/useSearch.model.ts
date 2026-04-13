import type { MaybeRefOrGetter, Ref } from 'vue'

import type {
  ContentEntry,
  ContentEntryInput,
  ContentSource,
} from './useContent.model'

export interface SearchResult extends ContentEntry {
  score: number
}

export interface UseSearchOptions {
  entries?: MaybeRefOrGetter<ContentEntryInput[] | undefined>
  initialQuery?: string
  limit?: number
  locale?: MaybeRefOrGetter<string | undefined>
  minQueryLength?: number
  query?: Ref<string>
  sources?: MaybeRefOrGetter<ContentSource[] | undefined>
}
