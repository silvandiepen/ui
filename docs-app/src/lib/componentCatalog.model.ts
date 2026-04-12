export type UIComponentCategory =
  | 'Data and Navigation'
  | 'Feedback'
  | 'Forms'
  | 'Foundations'

export type UIComponentStatus = 'stable' | 'transitional'

export type UIComponentStatusTone = 'accent' | 'danger' | 'success'

export interface UIComponentCatalogInput {
  docKeys: string[]
  exampleKeys: string[]
  folderKeys: string[]
  singleFileKeys: string[]
}

export interface UIComponentCatalogEntry {
  aliases: string[]
  apiName: string
  category: UIComponentCategory
  categoryId: string
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
  apiName?: string
  category: UIComponentCategory
  docsBasePath?: string
  examplePath?: string
  includeNestedDocs?: boolean
  name?: string
  sourcePath?: string
  status: UIComponentStatus
  summary: string
}

export interface UIComponentCategoryDefinition {
  description: string
  id: string
  label: UIComponentCategory
  order: number
}
