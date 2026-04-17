// Field types
export type FormConfigFieldType =
  | 'text' | 'email' | 'password' | 'number' | 'textarea'
  | 'select' | 'checkbox' | 'toggle' | 'switch' | 'radio'
  | 'date' | 'color' | 'range' | 'pin'
  | 'divider' | 'section'

export type FormConfigData = Record<string, unknown>

export type FormConfigConditionOperator =
  | 'eq' | 'neq'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'contains' | 'notContains' | 'startsWith' | 'endsWith'
  | 'empty' | 'notEmpty'
  | 'in' | 'notIn'

export interface FormConfigCondition {
  field: string
  operator: FormConfigConditionOperator
  value?: unknown
}

export interface FormConfigOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
  icon?: string
}

export type FormConfigValidationType =
  | 'required' | 'min' | 'max' | 'minLength' | 'maxLength'
  | 'pattern' | 'email' | 'url' | 'custom'

export interface FormConfigValidationRule {
  type: FormConfigValidationType
  value?: string | number   // threshold for min/max/minLength/maxLength, pattern string for pattern
  message: string
  validator?: (value: unknown, data: FormConfigData) => boolean | string
}

export interface FormConfigFieldConfig {
  key: string
  type: FormConfigFieldType
  label?: string
  placeholder?: string
  hint?: string
  required?: boolean
  disabled?: boolean | ((data: FormConfigData) => boolean)
  readonly?: boolean
  defaultValue?: unknown
  options?: FormConfigOption[]     // for select, radio, switch
  validation?: FormConfigValidationRule[]
  condition?: FormConfigCondition | FormConfigCondition[]
  conditionLogic?: 'and' | 'or'   // default: 'and'
  cols?: number                    // column span in grid (1–12)
  props?: Record<string, unknown>  // extra props forwarded to the input component
}

export interface FormConfigStep {
  id: string
  title: string
  description?: string
  icon?: string
  fields: FormConfigFieldConfig[]
  condition?: FormConfigCondition | FormConfigCondition[]
}

export type FormConfigActionType = 'submit' | 'reset' | 'button' | 'prev' | 'next'

export interface FormConfigAction {
  key: string
  label: string
  type?: FormConfigActionType   // default: 'button'
  variant?: string
  icon?: string
  disabled?: boolean | ((data: FormConfigData, meta: FormConfigMeta) => boolean)
}

export interface FormConfigMeta {
  currentStep: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  isDirty: boolean
  isValid: boolean
}

export interface FormConfig {
  fields?: FormConfigFieldConfig[]    // for flat forms
  steps?: FormConfigStep[]            // for multi-step forms (mutually exclusive with fields)
  actions?: FormConfigAction[]        // default submit/next/prev actions added if omitted
  columns?: number                    // default grid columns (default: 1)
  initialValues?: FormConfigData      // merged over field defaultValues
  validateOnChange?: boolean          // default: false
  validateOnBlur?: boolean            // default: false
}
