import type {
  UIComponentCatalogEntry,
  UIComponentCatalogInput,
  UIComponentOverride,
  UIComponentStatus,
  UIComponentStatusTone,
} from './componentCatalog.model'
import { getComponentCategoryDefinition } from './componentCategories'

const EXCLUDED_FOLDERS = new Set([
  'Molecules',
  'media',
])

const EXCLUDED_SOURCE_PATHS = new Set([
  'Feedback/Popup/components',
])

const API_NAME_OVERRIDES: Record<string, string> = {
  Display: 'UIDisplayHelpers',
  Feedback: 'UIFeedback',
  Form: 'UIForms',
  Input: 'UITextInput',
  Select: 'UINativeSelect',
  Textarea: 'UITextareaField',
}

const COMPONENT_OVERRIDES: Record<string, UIComponentOverride> = {
  Actions: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Grouped actions and contextual action item contracts.',
  },
  Alert: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Inline feedback surface built on shared card primitives.',
  },
  Avatar: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Generic avatar display for people, organizations, or placeholders.',
  },
  Badge: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Compact metadata and status chip primitive.',
  },
  Breadcrumb: {
    category: 'Data and Navigation',
    status: 'transitional',
    summary: 'Breadcrumb navigation shell that still needs API cleanup.',
  },
  Button: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Shared action primitive for buttons, links, and grouped actions.',
  },
  Card: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Reusable surface container for content blocks and panels.',
  },
  Container: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Layout wrapper for page sections and bounded content.',
  },
  ContextMenu: {
    category: 'Data and Navigation',
    status: 'transitional',
    summary: 'Context menus and side panels that still expose legacy compatibility contracts.',
  },
  CopyValueButton: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Small copy-to-clipboard action surface.',
  },
  DataList: {
    category: 'Data and Navigation',
    status: 'transitional',
    summary: 'Data list surface with routing and selection behavior from app migrations.',
  },
  DataListSelectionToolbar: {
    category: 'Data and Navigation',
    status: 'transitional',
    summary: 'Bulk action toolbar used alongside data list selection state.',
  },
  Display: {
    category: 'Foundations',
    status: 'legacy',
    summary: 'Display helpers collected in one folder and still awaiting consolidation.',
  },
  DraggableVisibilityMenu: {
    category: 'Data and Navigation',
    status: 'transitional',
    summary: 'Visibility ordering control for configurable table and list views.',
  },
  Dropdown: {
    category: 'Data and Navigation',
    name: 'DropdownMenu',
    status: 'stable',
    summary: 'Menu-style dropdown shell for contextual navigation and actions.',
  },
  EmptyState: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Empty state presentation block for lists and dashboards.',
  },
  Field: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Shared wrapper for labels, hints, errors, and form content.',
  },
  Icon: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Shared icon renderer and icon type contracts.',
  },
  Input: {
    category: 'Forms',
    status: 'transitional',
    summary: 'Standalone Emila-style input surface still separate from the broader form namespace.',
  },
  ItemList: {
    category: 'Data and Navigation',
    status: 'transitional',
    summary: 'List surface for selectable and descriptive items.',
  },
  Notification: {
    category: 'Feedback',
    status: 'stable',
    summary: 'Inline dismissible feedback component.',
  },
  Pagination: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Shared pagination presentation and helper contracts.',
  },
  PlatformHeader: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Product-neutral header shell with slots for brand, nav, and actions.',
  },
  Popover: {
    category: 'Feedback',
    status: 'stable',
    summary: 'Popover surface for anchored contextual content.',
  },
  Progress: {
    category: 'Feedback',
    status: 'stable',
    sourcePath: 'src/components/Progress',
    summary: 'Generic progress indicator for ongoing work and task state.',
  },
  ReferenceBadge: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Reference chip with copy and external-link affordances.',
  },
  Scroller: {
    category: 'Foundations',
    status: 'transitional',
    summary: 'Scrollable container helper that still needs a tighter surface.',
  },
  Section: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Generic content section wrapper used across surfaces.',
  },
  Select: {
    category: 'Forms',
    status: 'transitional',
    summary: 'Standalone Emila-style select component still outside the shared form namespace.',
  },
  Sidebar: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Shared vertical shell for sticky sidebars and contextual panels.',
  },
  SidebarNavigation: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Grouped navigation surface for sidebar-driven product and docs layouts.',
  },
  Skeleton: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Loading placeholder component for content and list states.',
  },
  Spacer: {
    category: 'Foundations',
    status: 'legacy',
    summary: 'Legacy spacing helper that should eventually become layout tokens instead of a component.',
  },
  StatusBadge: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Tone-based badge used for state and status labels.',
  },
  TabBar: {
    category: 'Data and Navigation',
    status: 'transitional',
    summary: 'Compact tab bar surface with a narrower compatibility history.',
  },
  Table: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Shared table presentation primitive.',
  },
  Tabs: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Tabbed content shell with navigation and pane primitives.',
  },
  Textarea: {
    category: 'Forms',
    status: 'stable',
    summary: 'Standalone textarea primitive.',
  },
  ThemeToggle: {
    category: 'Foundations',
    status: 'stable',
    sourcePath: 'src/components/ThemeToggle',
    summary: 'Shared theme mode toggle control.',
  },
  Toast: {
    category: 'Legacy and Compatibility',
    status: 'transitional',
    summary: 'Emila-style toast surface that coexists with the older feedback namespace.',
  },
  Toolbar: {
    category: 'Data and Navigation',
    status: 'legacy',
    summary: 'Large toolbar surface that still carries strong app-level assumptions.',
  },
  Tooltip: {
    category: 'Legacy and Compatibility',
    status: 'transitional',
    summary: 'Newer tooltip primitive that currently overlaps with the legacy ToolTip namespace.',
  },
}

export function buildComponentCatalog(input: UIComponentCatalogInput): UIComponentCatalogEntry[] {
  const docKeysByFolder = groupDocsByFolder(input.docKeys)
  const exampleKeysByFolder = groupExamplesByFolder(input.exampleKeys)
  const folderEntries = [...new Set(input.folderKeys
    .map(extractFolderSourcePath)
    .filter((key): key is string => Boolean(key))
    .filter((key) => isSourcePathIncluded(key)))]
  const singleFileEntries = [...new Set(input.singleFileKeys
    .map(extractSingleFileSourcePath)
    .filter((key): key is string => Boolean(key))
    .filter((key) => COMPONENT_OVERRIDES[key]))]

  return [...folderEntries, ...singleFileEntries]
    .map((sourcePath) => {
      const override = resolveComponentOverride(sourcePath)

      if (!override) {
        return null
      }

      const docs = (docKeysByFolder.get(sourcePath) ?? []).filter((path) => {
        if (override.includeNestedDocs) {
          return true
        }

        const nestedPath = path.replace(`../../../src/components/${sourcePath}/`, '')

        return !nestedPath.includes('/')
      })
      const componentName = override.name ?? getSourcePathLeaf(sourcePath)
      const categoryDefinition = getComponentCategoryDefinition(override.category)
      const apiName = override.apiName ?? getPreferredApiName(sourcePath, componentName)

      return {
        aliases: apiName === componentName ? [] : [componentName],
        apiName,
        category: override.category,
        categoryId: categoryDefinition.id,
        docs,
        examplePath: exampleKeysByFolder.get(sourcePath) ?? null,
        name: componentName,
        slug: slugifyComponentPath(sourcePath),
        sourcePath: override.sourcePath ?? `src/components/${sourcePath}`,
        status: override.status,
        statusTone: getStatusTone(override.status),
        summary: override.summary,
      } satisfies UIComponentCatalogEntry
    })
    .filter((entry): entry is UIComponentCatalogEntry => Boolean(entry))
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function slugifyComponentName(name: string): string {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

export function slugifyComponentPath(path: string): string {
  return path
    .split('/')
    .map((segment) => slugifyComponentName(segment))
    .join('-')
}

function getStatusTone(status: UIComponentStatus): UIComponentStatusTone {
  if (status === 'stable') {
    return 'success'
  }

  if (status === 'legacy') {
    return 'danger'
  }

  return 'accent'
}

function groupDocsByFolder(paths: string[]): Map<string, string[]> {
  const docsByFolder = new Map<string, string[]>()

  for (const path of paths) {
    const folderName = extractFolderPath(path)

    if (!folderName || !isSourcePathIncluded(folderName)) {
      continue
    }

    const docs = docsByFolder.get(folderName) ?? []

    docs.push(path)
    docsByFolder.set(folderName, docs.sort((left, right) => left.localeCompare(right)))
  }

  return docsByFolder
}

function groupExamplesByFolder(paths: string[]): Map<string, string> {
  const examplesByFolder = new Map<string, string>()

  for (const path of paths) {
    const folderName = extractFolderPath(path)

    if (!folderName || !isSourcePathIncluded(folderName) || examplesByFolder.has(folderName)) {
      continue
    }

    examplesByFolder.set(folderName, path)
  }

  return examplesByFolder
}

function extractFolderPath(path: string): string | null {
  return path.match(/src\/components\/(.+)\/[^/]+$/)?.[1] ?? null
}

function extractFolderSourcePath(path: string): string | null {
  return path.match(/src\/components\/(.+)\/index\.ts$/)?.[1] ?? null
}

function extractSingleFileSourcePath(path: string): string | null {
  return path.match(/src\/components\/([^/]+)\.vue$/)?.[1] ?? null
}

function isSourcePathIncluded(sourcePath: string): boolean {
  if (EXCLUDED_SOURCE_PATHS.has(sourcePath)) {
    return false
  }

  return !EXCLUDED_FOLDERS.has(sourcePath.split('/')[0] ?? '')
}

function resolveComponentOverride(sourcePath: string): UIComponentOverride | null {
  const override = COMPONENT_OVERRIDES[sourcePath]

  if (override) {
    return override
  }

  if (sourcePath === 'Feedback') {
    return {
      category: 'Feedback',
      status: 'legacy',
      summary: 'Legacy feedback namespace that still owns popup, tooltip, and toast compatibility exports.',
    }
  }

  if (sourcePath === 'Form') {
    return {
      category: 'Forms',
      status: 'transitional',
      summary: 'Large form surface that contains both stable controls and migration-era compatibility inputs.',
    }
  }

  if (sourcePath.startsWith('Form/TForm/inputs/')) {
    return {
      category: 'Forms',
      status: 'transitional',
      summary: `Nested form input control for ${getSourcePathLeaf(sourcePath)}.`,
    }
  }

  if (sourcePath.startsWith('Form/TForm/')) {
    return {
      category: 'Forms',
      status: 'transitional',
      summary: `Nested form surface for ${getSourcePathLeaf(sourcePath)}.`,
    }
  }

  if (sourcePath.startsWith('Form/')) {
    return {
      category: 'Forms',
      status: 'transitional',
      summary: `Legacy form namespace surface for ${getSourcePathLeaf(sourcePath)}.`,
    }
  }

  if (sourcePath === 'Feedback/Toast') {
    return {
      category: 'Feedback',
      status: 'transitional',
      summary: 'Toast notification surface and helpers from the legacy feedback namespace.',
    }
  }

  if (sourcePath === 'Feedback/ToolTip') {
    return {
      category: 'Legacy and Compatibility',
      status: 'transitional',
      summary: 'Legacy tooltip namespace that overlaps with the newer shared tooltip surface.',
    }
  }

  if (sourcePath === 'Feedback/Popup') {
    return {
      category: 'Legacy and Compatibility',
      status: 'legacy',
      summary: 'Legacy popup orchestration surface with service-driven modal behavior.',
    }
  }

  return null
}

function getSourcePathLeaf(sourcePath: string): string {
  return sourcePath.split('/').pop() ?? sourcePath
}

function getPreferredApiName(sourcePath: string, componentName: string): string {
  const overriddenName = API_NAME_OVERRIDES[sourcePath]

  if (overriddenName) {
    return overriddenName
  }

  if (componentName.startsWith('UI')) {
    return componentName
  }

  const normalizedName = componentName.startsWith('T')
    ? componentName.slice(1)
    : componentName

  return `UI${normalizedName}`
}
