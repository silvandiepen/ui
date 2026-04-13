import { computed, ref } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  configureContent,
  registerContentSource,
  removeContentSource,
  useContent,
} from './useContent'

describe('useContent', () => {
  beforeEach(() => {
    configureContent(null)
  })

  it('normalizes configured global entries into searchable content items', () => {
    configureContent({
      entries: [
        {
          content: 'Use **buttons** and [cards](/cards) in shared flows.',
          id: 'docs:overview',
          keywords: ['ui', 'shared'],
          summary: 'Overview content',
          title: 'Overview',
        },
      ],
    })

    const { items } = useContent()

    expect(items.value).toHaveLength(1)
    expect(items.value[0].normalizedText).toContain('use buttons and cards in shared flows')
    expect(items.value[0].excerpt).toBe('Overview content')
  })

  it('merges local entries with registered sources', () => {
    registerContentSource({
      id: 'pages',
      entries: [
        {
          id: 'page:pricing',
          title: 'Pricing',
        },
      ],
    })

    const { items } = useContent({
      entries: [
        {
          id: 'page:home',
          title: 'Home',
        },
      ],
    })

    expect(items.value.map((entry) => entry.id)).toEqual(['page:pricing', 'page:home'])
  })

  it('recomputes local content from reactive sources', () => {
    const entries = ref([
      {
        id: 'guide:getting-started',
        title: 'Getting Started',
      },
    ])

    const { items } = useContent({
      entries: computed(() => entries.value),
    })

    expect(items.value).toHaveLength(1)

    entries.value = [
      ...entries.value,
      {
        id: 'guide:theme-builder',
        title: 'Theme Builder',
      },
    ]

    expect(items.value.map((entry) => entry.id)).toEqual([
      'guide:getting-started',
      'guide:theme-builder',
    ])
  })

  it('removes sources by id', () => {
    registerContentSource({
      id: 'pages',
      entries: [
        {
          id: 'page:pricing',
          title: 'Pricing',
        },
      ],
    })

    removeContentSource('pages')

    const { items } = useContent()

    expect(items.value).toEqual([])
  })
})
