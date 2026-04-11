import type { Component } from 'vue'

import type { UIComponentCatalogEntry } from './componentCatalog.model'
import { buildComponentCatalog } from './componentCatalog'

const componentIndexModules = import.meta.glob('../../../src/components/**/index.ts')
const componentExampleModules = import.meta.glob('../../../src/components/**/*.example.vue')
const componentSingleFileModules = import.meta.glob('../../../src/components/*.vue')
const componentDocModules = import.meta.glob('../../../src/components/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const catalog = buildComponentCatalog({
  docKeys: Object.keys(componentDocModules),
  exampleKeys: Object.keys(componentExampleModules),
  folderKeys: Object.keys(componentIndexModules),
  singleFileKeys: Object.keys(componentSingleFileModules),
})

const docContents = new Map<string, string>(Object.entries(componentDocModules))

const exampleLoaders = new Map<string, () => Promise<Component>>(
  Object.entries(componentExampleModules) as Array<[string, () => Promise<Component>]>,
)

const componentNameReplacements = catalog
  .filter((entry) => entry.apiName !== entry.name)
  .flatMap((entry) => [{ from: entry.name, to: entry.apiName }])

export function getComponentCatalog(): UIComponentCatalogEntry[] {
  return catalog
}

export function getComponentBySlug(slug: string): UIComponentCatalogEntry | undefined {
  return catalog.find((entry) => entry.slug === slug)
}

export function getDocContent(path: string): string | undefined {
  return docContents.get(path)
}

export function getExampleLoader(path: string): (() => Promise<Component>) | undefined {
  return exampleLoaders.get(path)
}

export function getComponentNameReplacements() {
  return componentNameReplacements
}
