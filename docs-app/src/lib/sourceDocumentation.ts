import type { UIComponentCatalogEntry } from './componentCatalog.model'
import type {
  UIComponentEventDefinition,
  UIComponentPropDefinition,
  UIComponentSlotDefinition,
  UIComponentSourceDocumentation,
} from './sourceDocumentation.model'

const componentModelModules = import.meta.glob('../../../src/components/**/*.model.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const componentVueModules = import.meta.glob('../../../src/components/**/*.vue', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

export function getSourceDocumentation(entry: UIComponentCatalogEntry): UIComponentSourceDocumentation {
  const modelPath = resolveModelPath(entry)
  const componentPath = resolveVuePath(entry)
  const componentSource = componentPath ? componentVueModules[componentPath] ?? '' : ''
  const modelSource = modelPath ? componentModelModules[modelPath] ?? '' : ''
  const props = extractProps(modelSource, componentSource)

  return {
    events: extractEvents(modelSource, componentSource),
    modelPath,
    props,
    slots: extractSlots(componentSource),
    sourcePath: componentPath ?? entry.sourcePath,
    usageExample: buildUsageExample(entry, props),
  }
}

function extractProps(modelSource: string, componentSource: string): UIComponentPropDefinition[] {
  const interfaceBody = extractPropsInterfaceBody(modelSource)
    ?? extractPropsInterfaceBody(componentSource)
    ?? extractInlineDefinePropsBody(componentSource)

  if (!interfaceBody) {
    return []
  }

  const defaultValues = extractDefaultValues(componentSource)
  const propPattern = /(?:\/\*\*([\s\S]*?)\*\/\s*|\/\/([^\n]*)\n\s*)?([A-Za-z_$][\w$]*)\??:\s*([^;\n]+?)(?:;|\n|$)/g
  const props: UIComponentPropDefinition[] = []

  for (const match of interfaceBody.matchAll(propPattern)) {
    const [, blockComment, lineComment, propName, propType] = match
    const propertySignature = match[0]
    const required = !propertySignature.includes(`${propName}?`)

    props.push({
      defaultValue: defaultValues.get(propName) ?? null,
      description: normalizeDescription(blockComment ?? lineComment ?? ''),
      name: propName,
      required,
      type: propType.trim(),
    })
  }

  return props
}

function extractEvents(modelSource: string, componentSource: string): UIComponentEventDefinition[] {
  const bodies = [
    ...extractInlineEmitBodies(componentSource),
    ...extractNamedEmitBodies(modelSource),
    ...extractNamedEmitBodies(componentSource),
  ]
  const events = new Map<string, UIComponentEventDefinition>()

  for (const body of bodies) {
    for (const event of parseEventBody(body)) {
      events.set(`${event.name}:${event.payload}`, event)
    }
  }

  return [...events.values()]
}

function extractSlots(source: string): UIComponentSlotDefinition[] {
  const slotPattern = /<slot\b([^>]*)>/g
  const slots = new Map<string, UIComponentSlotDefinition>()

  for (const match of source.matchAll(slotPattern)) {
    const slotName = match[1]?.match(/\bname="([^"]+)"/)?.[1] ?? 'default'

    slots.set(slotName, {
      description: slotName === 'default'
        ? 'Default slot content rendered inside the component body.'
        : `Named slot for ${slotName} content.`,
      name: slotName,
    })
  }

  return [...slots.values()]
}

function extractInlineEmitBodies(source: string): string[] {
  return [...source.matchAll(/defineEmits<\s*\{([\s\S]*?)\}\s*>\(\)/g)].map((match) => match[1])
}

function extractNamedEmitBodies(source: string): string[] {
  return [...source.matchAll(/(?:export\s+)?interface\s+\w+Emits\s*\{([\s\S]*?)\}/g)].map((match) => match[1])
}

function parseEventBody(body: string): UIComponentEventDefinition[] {
  const propertyPattern = /(?:\/\*\*([\s\S]*?)\*\/\s*|\/\/([^\n]*)\n\s*)?(?:['"]([^'"]+)['"]|([A-Za-z_$][\w$]*))\s*:\s*\[([^\]]*)\]/g
  const callSignaturePattern = /(?:\/\*\*([\s\S]*?)\*\/\s*|\/\/([^\n]*)\n\s*)?\(\s*e:\s*['"]([^'"]+)['"]\s*(?:,\s*([^)]+))?\)\s*:/g
  const events: UIComponentEventDefinition[] = []

  for (const match of body.matchAll(propertyPattern)) {
    const [, blockComment, lineComment, quotedEventName, namedEventKey, payload] = match

    events.push({
      description: normalizeDescription(blockComment ?? lineComment ?? ''),
      name: quotedEventName ?? namedEventKey ?? 'unknown',
      payload: normalizeEventPayload(payload),
    })
  }

  for (const match of body.matchAll(callSignaturePattern)) {
    const [, blockComment, lineComment, eventName, payload] = match

    events.push({
      description: normalizeDescription(blockComment ?? lineComment ?? ''),
      name: eventName,
      payload: normalizeEventPayload(payload),
    })
  }

  return events
}

function extractPropsInterfaceBody(source: string): string | null {
  const interfaceMatch = source.match(/export\s+interface\s+\w+Props\s*\{([\s\S]*?)\}/)

  return interfaceMatch?.[1] ?? null
}

function extractInlineDefinePropsBody(source: string): string | null {
  const inlinePropsMatch = source.match(/defineProps<\s*\{([\s\S]*?)\}\s*>\(\)/)

  return inlinePropsMatch?.[1] ?? null
}

function extractDefaultValues(source: string): Map<string, string> {
  const defaultsMatch = source.match(/withDefaults\(\s*defineProps<[^>]+>\(\)\s*,\s*\{([\s\S]*?)\}\s*\)/)
  const defaults = new Map<string, string>()

  if (!defaultsMatch) {
    return defaults
  }

  const propertyPattern = /([A-Za-z_$][\w$]*)\s*:\s*([^,\n]+)(?:,|\n|$)/g

  for (const match of defaultsMatch[1].matchAll(propertyPattern)) {
    defaults.set(match[1], match[2].trim())
  }

  return defaults
}

function normalizeDescription(description: string): string {
  return description
    .replace(/^\s*\*/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeEventPayload(payload?: string): string {
  const normalizedPayload = payload?.trim()

  return normalizedPayload ? normalizedPayload : 'none'
}

function resolveModelPath(entry: UIComponentCatalogEntry): string | null {
  const componentFolder = getComponentFolder(entry)
  const componentName = getComponentFileBaseName(entry)
  const folderPath = `${componentFolder}/${componentName}.model.ts`

  if (componentModelModules[folderPath]) {
    return folderPath
  }

  return null
}

function resolveVuePath(entry: UIComponentCatalogEntry): string | null {
  const componentFolder = getComponentFolder(entry)
  const componentName = getComponentFileBaseName(entry)
  const folderPath = `${componentFolder}/${componentName}.vue`

  if (componentVueModules[folderPath]) {
    return folderPath
  }

  const singleFilePath = `${componentFolder}.vue`

  if (componentVueModules[singleFilePath]) {
    return singleFilePath
  }

  const directVueFiles = Object.keys(componentVueModules)
    .filter((path) => path.startsWith(`${componentFolder}/`))
    .filter((path) => !path.endsWith('.example.vue'))
    .filter((path) => !path.slice(`${componentFolder}/`.length).includes('/'))

  return directVueFiles.length === 1 ? directVueFiles[0] : null
}

function buildUsageExample(entry: UIComponentCatalogEntry, props: UIComponentPropDefinition[]): string {
  const componentTag = entry.name
  const requiredProps = props.filter((prop) => prop.required)

  if (requiredProps.length === 0) {
    return [
      `import { ${entry.name} } from '@sil/ui'`,
      '',
      '<template>',
      `  <${componentTag} />`,
      '</template>',
    ].join('\n')
  }

  const propLines = requiredProps.map((prop) => `    ${buildPropBinding(prop)}`)

  return [
    `import { ${entry.name} } from '@sil/ui'`,
    '',
    '<template>',
    `  <${componentTag}`,
    ...propLines,
    '  />',
    '</template>',
  ].join('\n')
}

function buildPropBinding(prop: UIComponentPropDefinition): string {
  if (prop.name === 'modelValue') {
    return 'v-model="value"'
  }

  if (looksBoolean(prop.type)) {
    return `:${prop.name}="false"`
  }

  if (looksNumber(prop.type)) {
    return `:${prop.name}="0"`
  }

  if (looksArray(prop.type)) {
    return `:${prop.name}="[]"`
  }

  if (looksObject(prop.type)) {
    return `:${prop.name}="{}"`
  }

  return `${prop.name}="${toKebabSentence(prop.name)}"`
}

function looksArray(type: string): boolean {
  return type.includes('[]') || /Array<.+>/.test(type)
}

function looksBoolean(type: string): boolean {
  return /\bboolean\b/.test(type)
}

function looksNumber(type: string): boolean {
  return /\bnumber\b/.test(type)
}

function looksObject(type: string): boolean {
  return /\bRecord<|\bobject\b|\{\s*.+\s*\}/.test(type)
}

function toKebabSentence(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
}

function getComponentFolder(entry: UIComponentCatalogEntry): string {
  return `../../../${entry.sourcePath}`
}

function getComponentFileBaseName(entry: UIComponentCatalogEntry): string {
  const pathSegments = entry.sourcePath.split('/')

  return pathSegments[pathSegments.length - 1] ?? entry.name
}
