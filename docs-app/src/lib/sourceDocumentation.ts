import type { UIComponentCatalogEntry } from './componentCatalog.model'
import type {
  UIComponentEventDefinition,
  UIComponentPropDefinition,
  UIComponentSlotDefinition,
  UIComponentSourceDocumentation,
  UIComponentTypeDefinition,
  UIComponentTypeField,
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
    types: extractTypes(modelSource),
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

function extractTypes(source: string): UIComponentTypeDefinition[] {
  const types: UIComponentTypeDefinition[] = []
  const seen = new Set<string>()

  extractConstEnums(source, types, seen)
  extractTsEnums(source, types, seen)
  extractInterfaceTypes(source, types, seen)
  extractTypeAliases(source, types, seen)

  return types
}

function extractInterfaceTypes(source: string, types: UIComponentTypeDefinition[], seen: Set<string>): void {
  const pattern = /(?:\/\*\*([\s\S]*?)\*\/\s*)?export\s+(?:interface|type)\s+(\w+)\s*(?:=\s*)?\{([\s\S]*?)\}/g

  for (const match of source.matchAll(pattern)) {
    const [, comment, name, body] = match
    if (seen.has(name)) continue
    if (name.endsWith('Props') || name.endsWith('Emits') || name.endsWith('Emit')) continue
    seen.add(name)

    types.push({
      description: normalizeDescription(comment ?? ''),
      fields: parseInterfaceFields(body),
      kind: 'interface',
      name,
      values: [],
    })
  }
}

function parseInterfaceFields(body: string): UIComponentTypeField[] {
  const fields: UIComponentTypeField[] = []
  const propPattern = /(?:\/\*\*([\s\S]*?)\*\/\s*)?([A-Za-z_$][\w$]*)\??:\s*([^;\n]+?)(?:;|\n|$)/g
  const defaults = new Map<string, string>()

  for (const match of body.matchAll(propPattern)) {
    const [, comment, fieldName, fieldType] = match
    const signature = match[0]
    const required = !signature.includes(`${fieldName}?`)

    fields.push({
      defaultValue: defaults.get(fieldName) ?? null,
      description: normalizeDescription(comment ?? ''),
      name: fieldName,
      required,
      type: fieldType.trim(),
    })
  }

  return fields
}

function extractTypeAliases(source: string, types: UIComponentTypeDefinition[], seen: Set<string>): void {
  const pattern = /(?:\/\*\*([\s\S]*?)\*\/\s*)?export\s+type\s+(\w+)\s*=\s*([^\n]+(?:\n\s*\|[^\n]+)*)/g

  for (const match of source.matchAll(pattern)) {
    const [, comment, name, definition] = match
    if (seen.has(name)) continue
    seen.add(name)

    const cleaned = definition.trim().replace(/\s+/g, ' ')

    types.push({
      description: normalizeDescription(comment ?? ''),
      fields: [],
      kind: 'type-alias',
      name,
      values: [],
    })
  }
}

function extractConstEnums(source: string, types: UIComponentTypeDefinition[], seen: Set<string>): void {
  const pattern = /(?:\/\*\*([\s\S]*?)\*\/\s*)?export\s+const\s+(\w+)\s*=\s*\{([\s\S]*?)\}\s*(?:as\s+const)?[,;]?\s*(?:export\s+type\s+\2\s*=)?/g

  for (const match of source.matchAll(pattern)) {
    const [, comment, name, body] = match
    if (seen.has(name)) continue
    seen.add(name)

    const values: string[] = []
    const valuePattern = /\w+\s*:\s*'([^']+)'/g
    for (const valueMatch of body.matchAll(valuePattern)) {
      values.push(valueMatch[1])
    }

    if (values.length === 0) continue

    types.push({
      description: normalizeDescription(comment ?? ''),
      fields: [],
      kind: 'const-enum',
      name,
      values,
    })
  }
}

function extractTsEnums(source: string, types: UIComponentTypeDefinition[], seen: Set<string>): void {
  const pattern = /(?:\/\*\*([\s\S]*?)\*\/\s*)?export\s+enum\s+(\w+)\s*\{([\s\S]*?)\}/g

  for (const match of source.matchAll(pattern)) {
    const [, comment, name, body] = match
    if (seen.has(name)) continue
    seen.add(name)

    const values: string[] = []
    const valuePattern = /\w+\s*=\s*'([^']+)'/g
    for (const valueMatch of body.matchAll(valuePattern)) {
      values.push(valueMatch[1])
    }
    const numericPattern = /\w+\s*=\s*(\d+)/g
    for (const valueMatch of body.matchAll(numericPattern)) {
      values.push(valueMatch[1])
    }

    if (values.length === 0) continue

    types.push({
      description: normalizeDescription(comment ?? ''),
      fields: [],
      kind: 'const-enum',
      name,
      values,
    })
  }
}

function resolveModelPath(entry: UIComponentCatalogEntry): string | null {
  if (entry.sourcePath.endsWith('.vue')) {
    const modelPath = `../../../${entry.sourcePath.replace(/\.vue$/, '.model.ts')}`

    return componentModelModules[modelPath] ? modelPath : null
  }

  const componentFolder = getComponentFolder(entry)
  const componentName = getComponentFileBaseName(entry)
  const folderPath = `${componentFolder}/${componentName}.model.ts`

  if (componentModelModules[folderPath]) {
    return folderPath
  }

  return null
}

function resolveVuePath(entry: UIComponentCatalogEntry): string | null {
  if (entry.sourcePath.endsWith('.vue')) {
    const directVuePath = `../../../${entry.sourcePath}`

    return componentVueModules[directVuePath] ? directVuePath : null
  }

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
  if (entry.sourcePath === 'src/components/Form/Form') {
    return [
      "import { UIForm, UIInputText, UIInputToggle } from '@sil/ui'",
      '',
      '<template>',
      '  <UIForm>',
      '    <UIInputText v-model="name" label="Name" />',
      '    <UIInputToggle v-model="enabled" label="Enabled" />',
      '  </UIForm>',
      '</template>',
    ].join('\n')
  }

  if (entry.sourcePath === 'src/components/Feedback') {
    return [
      "import { UINotification, UIToast } from '@sil/ui'",
      '',
      '<template>',
      '  <UINotification message="Saved changes" />',
      '  <UIToast />',
      '</template>',
    ].join('\n')
  }

  if (entry.sourcePath === 'src/components/Display') {
    return [
      "import { UIBadge, UIStatusBadge } from '@sil/ui'",
      '',
      '<template>',
      '  <UIBadge>Stable</UIBadge>',
      '  <UIStatusBadge label="Ready" tone="success" />',
      '</template>',
    ].join('\n')
  }

  const componentTag = entry.apiName
  const requiredProps = props.filter((prop) => prop.required)

  if (requiredProps.length === 0) {
    return [
      `import { ${entry.apiName} } from '@sil/ui'`,
      '',
      '<template>',
      `  <${componentTag} />`,
      '</template>',
    ].join('\n')
  }

  const propLines = requiredProps.map((prop) => `    ${buildPropBinding(prop)}`)

  return [
    `import { ${entry.apiName} } from '@sil/ui'`,
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
