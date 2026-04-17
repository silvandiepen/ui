import type {
  FormConfigCondition,
  FormConfigConditionOperator,
  FormConfigData,
  FormConfigFieldConfig,
  FormConfigValidationRule,
  FormConfig,
  FormConfigStep,
} from './FormConfig.model'

// ---------------------------------------------------------------------------
// Condition evaluation
// ---------------------------------------------------------------------------

function isEmpty(value: unknown): boolean {
  if (value === '' || value === null || value === undefined) return true
  if (Array.isArray(value) && value.length === 0) return true
  return false
}

export function evaluateCondition(
  condition: FormConfigCondition,
  data: FormConfigData
): boolean {
  const fieldValue = data[condition.field]
  const condValue = condition.value
  const op: FormConfigConditionOperator = condition.operator

  switch (op) {
    case 'eq':
      return fieldValue === condValue
    case 'neq':
      return fieldValue !== condValue
    case 'gt':
      return (fieldValue as number) > (condValue as number)
    case 'gte':
      return (fieldValue as number) >= (condValue as number)
    case 'lt':
      return (fieldValue as number) < (condValue as number)
    case 'lte':
      return (fieldValue as number) <= (condValue as number)
    case 'contains':
      if (Array.isArray(fieldValue)) return fieldValue.includes(condValue)
      return String(fieldValue).includes(String(condValue))
    case 'notContains':
      if (Array.isArray(fieldValue)) return !fieldValue.includes(condValue)
      return !String(fieldValue).includes(String(condValue))
    case 'startsWith':
      return String(fieldValue).startsWith(String(condValue))
    case 'endsWith':
      return String(fieldValue).endsWith(String(condValue))
    case 'empty':
      return isEmpty(fieldValue)
    case 'notEmpty':
      return !isEmpty(fieldValue)
    case 'in':
      return Array.isArray(condValue) && condValue.includes(fieldValue)
    case 'notIn':
      return Array.isArray(condValue) && !condValue.includes(fieldValue)
    default:
      return true
  }
}

export function evaluateConditions(
  conditions: FormConfigCondition[],
  logic: 'and' | 'or',
  data: FormConfigData
): boolean {
  if (conditions.length === 0) return true
  if (logic === 'or') {
    return conditions.some((c) => evaluateCondition(c, data))
  }
  return conditions.every((c) => evaluateCondition(c, data))
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateValue(
  value: unknown,
  rules: FormConfigValidationRule[],
  data: FormConfigData
): string | null {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required': {
        if (isEmpty(value)) return rule.message
        break
      }
      case 'min': {
        if (value === '' || value === null || value === undefined) break
        if ((value as number) < (rule.value as number)) return rule.message
        break
      }
      case 'max': {
        if (value === '' || value === null || value === undefined) break
        if ((value as number) > (rule.value as number)) return rule.message
        break
      }
      case 'minLength': {
        if (value === '' || value === null || value === undefined) break
        if (String(value).length < (rule.value as number)) return rule.message
        break
      }
      case 'maxLength': {
        if (value === '' || value === null || value === undefined) break
        if (String(value).length > (rule.value as number)) return rule.message
        break
      }
      case 'pattern': {
        if (value === '' || value === null || value === undefined) break
        const regex = new RegExp(rule.value as string)
        if (!regex.test(String(value))) return rule.message
        break
      }
      case 'email': {
        if (value === '' || value === null || value === undefined) break
        if (!EMAIL_REGEX.test(String(value))) return rule.message
        break
      }
      case 'url': {
        if (value === '' || value === null || value === undefined) break
        try {
          new URL(String(value))
        } catch {
          return rule.message
        }
        break
      }
      case 'custom': {
        if (!rule.validator) break
        const result = rule.validator(value, data)
        if (result === false) return rule.message
        if (typeof result === 'string') return result
        break
      }
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Field & step utilities
// ---------------------------------------------------------------------------

export function getAllFields(config: FormConfig): FormConfigFieldConfig[] {
  if (config.steps && config.steps.length > 0) {
    return config.steps.flatMap((step) => step.fields)
  }
  return config.fields ?? []
}

export function isFieldVisible(
  field: FormConfigFieldConfig,
  data: FormConfigData
): boolean {
  if (!field.condition) return true
  const conditions = Array.isArray(field.condition)
    ? field.condition
    : [field.condition]
  const logic = field.conditionLogic ?? 'and'
  return evaluateConditions(conditions, logic, data)
}

export function isStepVisible(
  step: FormConfigStep,
  data: FormConfigData
): boolean {
  if (!step.condition) return true
  const conditions = Array.isArray(step.condition)
    ? step.condition
    : [step.condition]
  return evaluateConditions(conditions, 'and', data)
}

export function getVisibleFields(
  fields: FormConfigFieldConfig[],
  data: FormConfigData
): FormConfigFieldConfig[] {
  return fields.filter((f) => isFieldVisible(f, data))
}

export function getVisibleSteps(
  config: FormConfig,
  data: FormConfigData
): FormConfigStep[] {
  if (!config.steps) return []
  return config.steps.filter((s) => isStepVisible(s, data))
}

export function extractDefaultValues(config: FormConfig): FormConfigData {
  const fields = getAllFields(config)
  const defaults: FormConfigData = {}
  for (const field of fields) {
    if (field.defaultValue !== undefined) {
      defaults[field.key] = field.defaultValue
    }
  }
  // initialValues override field defaults
  return { ...defaults, ...(config.initialValues ?? {}) }
}
