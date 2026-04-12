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
    description: 'Input controls, validation surfaces, and form orchestration APIs used across shared product flows.',
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
    description: 'Progress, notifications, tooltips, popovers, and transient status surfaces that communicate state back to the user.',
    order: 4,
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
