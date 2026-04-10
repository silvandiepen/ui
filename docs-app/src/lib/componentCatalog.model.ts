export type UIComponentCategory =
  | 'Data and Navigation'
  | 'Feedback'
  | 'Forms'
  | 'Foundations'
  | 'Legacy and Compatibility'

export type UIComponentStatus = 'legacy' | 'stable' | 'transitional'

export type UIComponentStatusTone = 'accent' | 'danger' | 'success'

export interface UIComponentCatalogInput {
  docKeys: string[]
  exampleKeys: string[]
  folderKeys: string[]
  singleFileKeys: string[]
}

export interface UIComponentCatalogEntry {
  category: UIComponentCategory
  docs: string[]
  examplePath: string | null
  name: string
  slug: string
  sourcePath: string
  status: UIComponentStatus
  statusTone: UIComponentStatusTone
  summary: string
}

export interface UIComponentOverride {
  category: UIComponentCategory
  docsBasePath?: string
  includeNestedDocs?: boolean
  name?: string
  sourcePath?: string
  status: UIComponentStatus
  summary: string
}
