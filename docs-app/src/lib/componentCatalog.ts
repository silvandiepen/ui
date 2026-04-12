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
  'Display',
  'Feedback/Popup/components',
  'Feedback/Toast',
  'Feedback/ToolTip',
])

const API_NAME_OVERRIDES: Record<string, string> = {
  Feedback: 'UIFeedback',
  Form: 'UIForms',
  Input: 'UITextInput',
  Select: 'UINativeSelect',
  Textarea: 'UITextareaField',
}

const MANUAL_SOURCE_PATHS = [
  'ContextMenu/ContextPanel',
  'Display/Chip',
  'Display/ChipGroup',
  'Display/Columns',
  'Display/DL',
  'Display/Empty',
  'Display/ID',
  'Display/Note',
  'Display/Row',
  'Display/TruncatedChipList',
] as const

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
    status: 'stable',
    summary: 'Breadcrumb navigation shell for hierarchical page paths.',
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
    status: 'stable',
    summary: 'Context menus and side panels for anchored actions and supporting content.',
  },
  CopyValueButton: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Small copy-to-clipboard action surface.',
  },
  DataList: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Data list surface with routing, selection, and row-level interaction support.',
  },
  DataListSelectionToolbar: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Bulk action toolbar used alongside data list selection state.',
  },
  'Display/Chip': {
    apiName: 'UIChip',
    category: 'Foundations',
    examplePath: '../../../src/components/Display/Chip.example.vue',
    name: 'Chip',
    sourcePath: 'src/components/Display/Chip.vue',
    status: 'stable',
    summary: 'Display helper chip surface with optional icons, removal, and tooltip support.',
  },
  'Display/ChipGroup': {
    apiName: 'UIChipGroup',
    category: 'Foundations',
    examplePath: '../../../src/components/Display/ChipGroup.example.vue',
    name: 'ChipGroup',
    sourcePath: 'src/components/Display/ChipGroup.vue',
    status: 'stable',
    summary: 'Display helper for arranging multiple chips as one grouped value.',
  },
  'Display/Columns': {
    apiName: 'UIColumns',
    category: 'Foundations',
    examplePath: '../../../src/components/Display/Columns.example.vue',
    name: 'Columns',
    sourcePath: 'src/components/Display/Columns.vue',
    status: 'stable',
    summary: 'Display helper for simple multi-column metadata layouts.',
  },
  'Display/DL': {
    apiName: 'UIDL',
    category: 'Foundations',
    examplePath: '../../../src/components/Display/DL.example.vue',
    name: 'DL',
    sourcePath: 'src/components/Display/DL.vue',
    status: 'stable',
    summary: 'Display helper for label-detail rows with optional icons and tooltip content.',
  },
  'Display/Empty': {
    apiName: 'UIEmpty',
    category: 'Foundations',
    examplePath: '../../../src/components/Display/Empty.example.vue',
    name: 'Empty',
    sourcePath: 'src/components/Display/Empty.vue',
    status: 'stable',
    summary: 'Display helper for empty values and placeholder content inside dense layouts.',
  },
  'Display/ID': {
    apiName: 'UIID',
    category: 'Foundations',
    examplePath: '../../../src/components/Display/ID.example.vue',
    name: 'ID',
    sourcePath: 'src/components/Display/ID.vue',
    status: 'stable',
    summary: 'Display helper for rendering an identifier with a built-in copy affordance.',
  },
  'Display/Note': {
    apiName: 'UINote',
    category: 'Foundations',
    examplePath: '../../../src/components/Display/Note.example.vue',
    name: 'Note',
    sourcePath: 'src/components/Display/Note.vue',
    status: 'stable',
    summary: 'Display helper for secondary notes and supporting inline context.',
  },
  'Display/Row': {
    apiName: 'UIRow',
    category: 'Foundations',
    examplePath: '../../../src/components/Display/Row.example.vue',
    name: 'Row',
    sourcePath: 'src/components/Display/Row.vue',
    status: 'stable',
    summary: 'Display helper row wrapper for dense metadata and inline layout pairings.',
  },
  'Display/TruncatedChipList': {
    apiName: 'UITruncatedChipList',
    category: 'Foundations',
    examplePath: '../../../src/components/Display/TruncatedChipList.example.vue',
    name: 'TruncatedChipList',
    sourcePath: 'src/components/Display/TruncatedChipList.vue',
    status: 'stable',
    summary: 'Display helper for chip collections that collapse overflow into a compact summary.',
  },
  'ContextMenu/ContextPanel': {
    apiName: 'UIContextPanel',
    category: 'Data and Navigation',
    examplePath: '../../../src/components/ContextMenu/ContextPanel.example.vue',
    name: 'ContextPanel',
    sourcePath: 'src/components/ContextMenu/ContextPanel.vue',
    status: 'stable',
    summary: 'Anchored context panel primitive that powers menu and flyout interactions.',
  },
  DraggableVisibilityMenu: {
    category: 'Data and Navigation',
    status: 'stable',
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
    status: 'stable',
    summary: 'Standalone text input surface for shared form flows.',
  },
  ItemList: {
    category: 'Data and Navigation',
    status: 'stable',
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
    status: 'stable',
    summary: 'Scrollable container helper for bounded content regions.',
  },
  Section: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Generic content section wrapper used across surfaces.',
  },
  Select: {
    category: 'Forms',
    status: 'stable',
    summary: 'Standalone select surface for shared form flows.',
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
    status: 'stable',
    summary: 'Spacing helper for deliberate vertical and horizontal layout gaps.',
  },
  StatusBadge: {
    category: 'Foundations',
    status: 'stable',
    summary: 'Tone-based badge used for state and status labels.',
  },
  TabBar: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Compact tab bar surface for dense navigation patterns.',
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
    category: 'Feedback',
    status: 'stable',
    summary: 'Toast notification surface for transient feedback and service-driven status messages.',
  },
  Toolbar: {
    category: 'Data and Navigation',
    status: 'stable',
    summary: 'Large toolbar surface for grouped actions, filters, and contextual controls.',
  },
  Tooltip: {
    category: 'Feedback',
    status: 'stable',
    summary: 'Tooltip surface for concise contextual guidance and supporting copy.',
  },
}

export function buildComponentCatalog(input: UIComponentCatalogInput): UIComponentCatalogEntry[] {
  const discoveredFolderEntries = [...new Set(input.folderKeys
    .map(extractFolderSourcePath)
    .filter((key): key is string => Boolean(key)))]
  const docKeysByFolder = groupDocsByFolder(input.docKeys)
  const exampleKeysByFolder = groupExamplesByFolder(input.exampleKeys)
  const folderEntries = discoveredFolderEntries.filter((key) => isSourcePathIncluded(key))
  const manualEntries = [...new Set(MANUAL_SOURCE_PATHS
    .filter((sourcePath) => discoveredFolderEntries.includes(sourcePath.split('/').slice(0, -1).join('/')))
    .filter((key) => isSourcePathIncluded(key)))]
  const singleFileEntries = [...new Set(input.singleFileKeys
    .map(extractSingleFileSourcePath)
    .filter((key): key is string => Boolean(key))
    .filter((key) => COMPONENT_OVERRIDES[key]))]

  return [...folderEntries, ...manualEntries, ...singleFileEntries]
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
        examplePath: override.examplePath ?? exampleKeysByFolder.get(sourcePath) ?? null,
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
      status: 'stable',
      summary: 'Feedback namespace for popup, tooltip, toast, and supporting status surfaces.',
    }
  }

  if (sourcePath === 'Form') {
    return {
      category: 'Forms',
      status: 'stable',
      summary: 'Large form surface that composes shared controls, validation, and orchestration helpers.',
    }
  }

  if (sourcePath.startsWith('Form/TForm/inputs/')) {
    return {
      category: 'Forms',
      status: 'stable',
      summary: `Nested form input control for ${getSourcePathLeaf(sourcePath)}.`,
    }
  }

  if (sourcePath.startsWith('Form/TForm/')) {
    return {
      category: 'Forms',
      status: 'stable',
      summary: `Nested form surface for ${getSourcePathLeaf(sourcePath)}.`,
    }
  }

  if (sourcePath.startsWith('Form/')) {
    return {
      category: 'Forms',
      status: 'stable',
      summary: `Form namespace surface for ${getSourcePathLeaf(sourcePath)}.`,
    }
  }

  if (sourcePath === 'Feedback/Toast') {
    return {
      category: 'Feedback',
      status: 'stable',
      summary: 'Feedback-namespace toast surface for service-driven transient messages.',
    }
  }

  if (sourcePath === 'Feedback/ToolTip') {
    return {
      category: 'Feedback',
      status: 'stable',
      summary: 'Feedback-namespace tooltip surface for concise contextual guidance.',
    }
  }

  if (sourcePath === 'Feedback/Popup') {
    return {
      category: 'Feedback',
      status: 'stable',
      summary: 'Popup orchestration surface with service-driven modal behavior.',
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

  const normalizedName = /^T[A-Z]/.test(componentName)
    ? componentName.slice(1)
    : componentName

  return `UI${normalizedName}`
}
