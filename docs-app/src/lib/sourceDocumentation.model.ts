export interface UIComponentPropDefinition {
  defaultValue: string | null
  description: string
  name: string
  required: boolean
  type: string
}

export interface UIComponentEventDefinition {
  description: string
  name: string
  payload: string
}

export interface UIComponentSlotDefinition {
  description: string
  name: string
}

export interface UIComponentTypeField {
  defaultValue: string | null
  description: string
  name: string
  required: boolean
  type: string
}

export interface UIComponentTypeDefinition {
  description: string
  fields: UIComponentTypeField[]
  kind: 'interface' | 'type-alias' | 'const-enum'
  name: string
  values: string[]
}

export interface UIComponentSourceDocumentation {
  events: UIComponentEventDefinition[]
  modelPath: string | null
  props: UIComponentPropDefinition[]
  slots: UIComponentSlotDefinition[]
  sourcePath: string
  types: UIComponentTypeDefinition[]
  usageExample: string
}
