import { beforeEach, describe, expect, it } from 'vitest'

import { configureContent } from './useContent'
import { searchContentEntries, useSearch } from './useSearch'

describe('useSearch', () => {
  beforeEach(() => {
    configureContent(null)
  })

  it('ranks title matches above body matches', () => {
    const { results, query } = useSearch({
      entries: [
        {
          content: 'Theme settings and font controls',
          id: 'guide:theme-builder',
          title: 'Theme Builder',
        },
        {
          content: 'The theme builder guide explains theme settings',
          id: 'guide:overview',
          title: 'Overview',
        },
      ],
      limit: 8,
    })

    query.value = 'theme builder'

    expect(results.value[0].id).toBe('guide:theme-builder')
  })

  it('searches configured global content sources', () => {
    configureContent({
      entries: [
        {
          content: 'Settings, members, and billing',
          id: 'docs:workspace',
          title: 'Workspace',
        },
      ],
    })

    const { results, query } = useSearch()
    query.value = 'billing'

    expect(results.value.map((entry) => entry.id)).toEqual(['docs:workspace'])
  })

  it('requires all search tokens to match the same entry', () => {
    const { results, query } = useSearch({
      entries: [
        {
          content: 'Theme and colors',
          id: 'guide:theme',
          title: 'Theme',
        },
        {
          content: 'Builder output and presets',
          id: 'guide:builder',
          title: 'Builder',
        },
      ],
    })

    query.value = 'theme builder'

    expect(results.value).toEqual([])
  })

  it('keeps totalResults uncapped when the visible list is limited', () => {
    const { query, results, totalResults } = useSearch({
      entries: [
        {
          content: 'Platform docs overview',
          id: 'docs:overview',
          title: 'Overview',
        },
        {
          content: 'Platform docs search',
          id: 'docs:search',
          title: 'Search',
        },
        {
          content: 'Platform docs settings',
          id: 'docs:settings',
          title: 'Settings',
        },
      ],
      limit: 2,
    })

    query.value = 'docs'

    expect(results.value).toHaveLength(2)
    expect(totalResults.value).toBe(3)
  })

  it('filters out entries when not all tokens are present', () => {
    const results = searchContentEntries([
      {
        excerpt: 'Theme and colors',
        id: 'guide:theme',
        keywordText: 'theme colors',
        normalizedText: 'theme and colors',
        title: 'Theme',
        titleText: 'theme',
        sourceId: 'local',
      },
      {
        excerpt: 'Builder output and presets',
        id: 'guide:builder',
        keywordText: 'builder presets',
        normalizedText: 'builder output and presets',
        title: 'Builder',
        titleText: 'builder',
        sourceId: 'local',
      },
    ], 'theme builder', 'en', 8)

    expect(results).toEqual([])
  })
})
