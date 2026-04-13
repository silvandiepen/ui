import type { Size } from '../../../../../types'
import type { IconNameOrString } from '../../../../Icon/Icon.model'

export type InputToggleValue = boolean | string | number

export interface InputToggleOption {
  label: string
  value: InputToggleValue
  icon?: IconNameOrString | null
  disabled?: boolean
}

export interface InputToggleBooleanIcons {
  on?: IconNameOrString
  off?: IconNameOrString
}

export interface InputToggleProps {
  modelValue?: InputToggleValue
  label?: string
  description?: string
  disabled?: boolean
  error?: string[]
  showIcon?: boolean
  size?: Size | 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  labels?: {
    on?: string
    off?: string
  }
  icons?: InputToggleBooleanIcons
  options?: (string | InputToggleOption)[]
  required?: boolean
  name?: string
}

export interface InputToggleEmits {
  'update:modelValue': [value: InputToggleValue]
  change: [value: InputToggleValue]
  touched: [value: boolean]
}
