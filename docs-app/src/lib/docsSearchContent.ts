import type { ContentSource } from '@sil/ui'

import { UI_COMPONENT_CATEGORIES } from './componentCategories'
import { getComposableCatalog, getComposableDocContent } from './composableCatalog'
import { getComponentCatalog, getDocContent } from './componentRegistry'

type Translate = (key: string, params?: Record<string, unknown>) => string

export function buildDocsSearchSources(t: Translate): ContentSource[] {
  return [
    {
      entries: [
        {
          content: [
            t('docs.gettingStarted.summary'),
            t('docs.gettingStarted.calloutBody'),
            t('docs.gettingStarted.colorBody'),
            t('docs.gettingStarted.fontBody'),
          ].join('\n\n'),
          id: 'guide:getting-started',
          keywords: ['guide', 'vite', 'theme', 'installation'],
          kind: 'guide',
          route: { name: 'docs-guide-getting-started' },
          summary: t('docs.gettingStarted.summary'),
          title: t('docs.navigation.gettingStarted'),
        },
        {
          content: [
            t('docs.themeBuilder.summary'),
            t('docs.themeBuilder.colorsBody'),
            t('docs.themeBuilder.fontsBody'),
            t('docs.themeBuilder.configBody'),
          ].join('\n\n'),
          id: 'guide:theme-builder',
          keywords: ['guide', 'theme', 'colors', 'fonts', 'builder'],
          kind: 'guide',
          route: { name: 'docs-guide-theme-builder' },
          summary: t('docs.themeBuilder.summary'),
          title: t('docs.navigation.themeBuilder'),
        },
        {
          content: [
            t('docs.composables.summary'),
            ...getComposableCatalog().map((entry) => `${entry.name} ${entry.summary}`),
          ].join('\n\n'),
          id: 'guide:composables',
          keywords: ['guide', 'composables', 'content', 'search'],
          kind: 'guide',
          route: { name: 'docs-guide-composables' },
          summary: t('docs.composables.summary'),
          title: t('docs.navigation.composables'),
        },
      ],
      id: 'docs-guides',
    },
    {
      entries: UI_COMPONENT_CATEGORIES.map((category) => ({
        content: t(`docs.categories.${category.id}.description`),
        id: `category:${category.id}`,
        keywords: ['category', category.id],
        kind: 'category',
        route: {
          name: 'docs-category',
          params: {
            categoryId: category.id,
          },
        },
        summary: t(`docs.categories.${category.id}.description`),
        title: t(`docs.categories.${category.id}.label`),
      })),
      id: 'docs-categories',
    },
    {
      entries: getComponentCatalog().map((entry) => ({
        content: [
          entry.summary,
          entry.sourcePath,
          entry.aliases.join(' '),
          ...entry.docs.map((path) => getDocContent(path) ?? ''),
        ].join('\n\n'),
        id: `component:${entry.slug}`,
        keywords: [
          entry.name,
          entry.apiName,
          entry.sourcePath,
          ...entry.aliases,
          entry.category,
          entry.categoryId,
        ],
        kind: 'component',
        route: {
          name: 'docs-component',
          params: {
            slug: entry.slug,
          },
        },
        summary: entry.summary,
        title: entry.apiName,
      })),
      id: 'docs-components',
    },
    {
      entries: getComposableCatalog().map((entry) => ({
        content: [
          entry.description,
          getComposableDocContent(entry.docPath) ?? '',
        ].join('\n\n'),
        id: `composable:${entry.name}`,
        keywords: ['composable', entry.name, entry.sourcePath],
        kind: 'composable',
        route: {
          name: 'docs-composable',
          params: {
            slug: entry.slug,
          },
        },
        summary: entry.summary,
        title: entry.name,
      })),
      id: 'docs-composables',
    },
  ]
}
