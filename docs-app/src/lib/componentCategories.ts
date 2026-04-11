import type {
  UIComponentCategory,
  UIComponentCategoryDefinition,
} from './componentCatalog.model'

export const UI_COMPONENT_CATEGORIES: UIComponentCategoryDefinition[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'Core building blocks for actions, surfaces, badges, layout wrappers, and shared product primitives.',
    order: 1,
  },
  {
    id: 'forms',
    label: 'Forms',
    description: 'Input controls, validation surfaces, and form orchestration APIs, including compatibility-era field contracts.',
    order: 2,
  },
  {
    id: 'data-and-navigation',
    label: 'Data and Navigation',
    description: 'Navigation shells, lists, tables, tabs, and higher-level browsing patterns used across products.',
    order: 3,
  },
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'Progress, notifications, popovers, and transient status surfaces that communicate state back to the user.',
    order: 4,
  },
  {
    id: 'legacy-and-compatibility',
    label: 'Legacy and Compatibility',
    description: 'Migration-era or older APIs that still ship for compatibility but are not the preferred long-term surface.',
    order: 5,
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
