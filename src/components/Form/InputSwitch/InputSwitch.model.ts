export type SwitchValue = string | number | boolean

export interface SwitchItem {
  label: string
  value: SwitchValue
  icon?: string | null
  disabled?: boolean
}

export interface InputSwitchProps {
  modelValue?: SwitchValue
  label?: string
  items: (string | SwitchItem)[]
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  disabled?: boolean
  error?: string[]
  required?: boolean
}

export interface InputSwitchEmits {
  'update:modelValue': [value: SwitchValue]
  change: [value: SwitchValue]
  touched: [value: boolean]
}

// Backwards compat aliases
export type SwitchOption = SwitchItem
