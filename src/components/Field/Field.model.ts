export const FieldType = {
  TEXT: 'text',
  BOOLEAN: 'boolean',
  SWITCH: 'switch',
} as const

export type FieldType = (typeof FieldType)[keyof typeof FieldType]

export interface FieldProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  id?: string
  type?: FieldType | string
  value?: unknown
  format?: string | ((value: unknown) => string)
  copyable?: boolean
  trueLabel?: string
  falseLabel?: string
  prefix?: string
  maxChars?: number
}
