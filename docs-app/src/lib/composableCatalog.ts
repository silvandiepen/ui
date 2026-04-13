export interface UIComposableCatalogEntry {
  description: string
  docPath: string
  name: string
  sourcePath: string
  summary: string
}

const composableDocModules = import.meta.glob('../../../src/composables/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const composableCatalog: UIComposableCatalogEntry[] = [
  {
    description: 'Shared confirmation dialog helpers built on the popup feedback service.',
    docPath: '../../../src/composables/useConfirm.md',
    name: 'useConfirm',
    sourcePath: 'src/composables/useConfirm.ts',
    summary: 'Open confirm dialogs and common destructive-action confirmations.',
  },
  {
    description: 'Lightweight searchable content registry for docs, guides, and app-owned static content.',
    docPath: '../../../src/composables/useContent.md',
    name: 'useContent',
    sourcePath: 'src/composables/useContent.ts',
    summary: 'Normalize app-fed content into lightweight searchable entries.',
  },
  {
    description: 'Lightweight translation wrapper with a safe fallback when app i18n is absent.',
    docPath: '../../../src/composables/useI18n.md',
    name: 'useI18n',
    sourcePath: 'src/composables/useI18n.ts',
    summary: 'Read translated copy through the host app when available.',
  },
  {
    description: 'Simple unique id generator for labels, ARIA bindings, and ephemeral UI wiring.',
    docPath: '../../../src/composables/useId.md',
    name: 'useId',
    sourcePath: 'src/composables/useId.ts',
    summary: 'Generate stable local ids without extra dependencies.',
  },
  {
    description: 'Prompt dialog helpers backed by the shared popup service.',
    docPath: '../../../src/composables/useInput.md',
    name: 'useInput',
    sourcePath: 'src/composables/useInput.ts',
    summary: 'Collect a text value through a shared modal flow.',
  },
  {
    description: 'Shared UI settings store with optional API-backed persistence hooks.',
    docPath: '../../../src/composables/useSettings.md',
    name: 'useSettings',
    sourcePath: 'src/composables/useSettings.ts',
    summary: 'Persist table, navigation, and preference state locally or through custom handlers.',
  },
  {
    description: 'Locale-aware lightweight content search built on top of useContent.',
    docPath: '../../../src/composables/useSearch.md',
    name: 'useSearch',
    sourcePath: 'src/composables/useSearch.ts',
    summary: 'Rank and filter searchable content entries without a heavy full-text engine.',
  },
]

const docContents = new Map<string, string>(Object.entries(composableDocModules))

export function getComposableCatalog() {
  return composableCatalog
}

export function getComposableDocContent(path: string) {
  return docContents.get(path)
}
