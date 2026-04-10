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

export interface UIComponentSourceDocumentation {
  events: UIComponentEventDefinition[]
  modelPath: string | null
  props: UIComponentPropDefinition[]
  slots: UIComponentSlotDefinition[]
  sourcePath: string
  usageExample: string
}
