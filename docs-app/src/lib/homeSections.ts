import type { UIComponentCatalogEntry, UIComponentCategoryDefinition } from './componentCatalog.model'
import { UI_COMPONENT_CATEGORIES } from './componentCategories'

export interface DocsHomeSection {
  description: string
  id: string
  items: UIComponentCatalogEntry[]
  label: string
  section: string
  sectionId: string
}

export function buildDocsHomeSections(
  components: UIComponentCatalogEntry[],
  categories: UIComponentCategoryDefinition[] = UI_COMPONENT_CATEGORIES,
): DocsHomeSection[] {
  const groups = new Map<string, UIComponentCatalogEntry[]>()

  for (const component of components) {
    const items = groups.get(component.categoryId) ?? []

    items.push(component)
    groups.set(component.categoryId, items)
  }

  return categories
    .map((category) => ({
      description: category.description,
      id: category.id,
      items: groups.get(category.id) ?? [],
      label: category.label,
      section: category.section,
      sectionId: category.sectionId,
    }))
    .filter((group) => group.items.length > 0)
}
