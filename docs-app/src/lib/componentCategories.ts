import type {
  UIComponentCategory,
  UIComponentCategoryDefinition,
  UIComponentCategorySection,
} from './componentCatalog.model'

export const UI_COMPONENT_CATEGORIES: UIComponentCategoryDefinition[] = [
  {
    id: 'search',
    label: 'Search',
    description: 'Search inputs, result lists, and other discovery-focused UI surfaces.',
    order: 1,
    section: 'Features',
    sectionId: 'features',
  },
  {
    id: 'auth',
    label: 'Auth',
    description: 'Authentication surfaces such as sign-in and sign-up flows.',
    order: 2,
    section: 'Features',
    sectionId: 'features',
  },
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'Core building blocks for actions, surfaces, badges, and shared product primitives.',
    order: 3,
    section: 'Core',
    sectionId: 'core',
  },
  {
    id: 'layout',
    label: 'Layout',
    description: 'Layout primitives for spacing, scrolling, columns, and page structure.',
    order: 4,
    section: 'Core',
    sectionId: 'core',
  },
  {
    id: 'app-shell',
    label: 'App Shell',
    description: 'Structural chrome components: headers, sidebars, navigation, and footers.',
    order: 5,
    section: 'Core',
    sectionId: 'core',
  },
  {
    id: 'forms',
    label: 'Forms',
    description: 'Input controls, validation surfaces, and form orchestration APIs used across shared product flows.',
    order: 6,
    section: 'Core',
    sectionId: 'core',
  },
  {
    id: 'data-and-navigation',
    label: 'Data and Navigation',
    description: 'Lists, tables, tabs, pagination, and higher-level browsing patterns used across products.',
    order: 7,
    section: 'Core',
    sectionId: 'core',
  },
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'Progress, notifications, tooltips, popovers, and transient status surfaces that communicate state back to the user.',
    order: 8,
    section: 'Core',
    sectionId: 'core',
  },
]

export const UI_COMPONENT_CATEGORY_SECTIONS: Array<{
  id: string
  label: UIComponentCategorySection
  order: number
}> = [
  {
    id: 'features',
    label: 'Features',
    order: 1,
  },
  {
    id: 'core',
    label: 'Core',
    order: 2,
  },
]

const categoryByLabel = new Map<UIComponentCategory, UIComponentCategoryDefinition>(
  UI_COMPONENT_CATEGORIES.map((category) => [category.label, category]),
)

const categoryById = new Map<string, UIComponentCategoryDefinition>(
  UI_COMPONENT_CATEGORIES.map((category) => [category.id, category]),
)

export function getComponentCategoryDefinition(
  label: UIComponentCategory,
): UIComponentCategoryDefinition {
  const category = categoryByLabel.get(label)

  if (!category) {
    throw new Error(`Unknown component category: ${label}`)
  }

  return category
}

export function getComponentCategoryDefinitionById(
  id: string,
): UIComponentCategoryDefinition | undefined {
  return categoryById.get(id)
}
