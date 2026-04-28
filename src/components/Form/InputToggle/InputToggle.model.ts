import type { IconNameOrString } from '../../Icon/Icon.model'
import type { TestIdProps } from "../../../types";

export type ToggleValue = boolean | string | number

export interface ToggleItem {
  label: string
  value: ToggleValue
  icon?: IconNameOrString | null
}

export interface InputToggleProps {
  testId?: TestIdProps['testId']
  modelValue?: ToggleValue
  label?: string
  description?: string
  disabled?: boolean
  error?: string[]
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  items?: [ToggleItem, ToggleItem]
  name?: string
  required?: boolean
}

export interface InputToggleEmits {
  'update:modelValue': [value: ToggleValue]
  change: [value: ToggleValue]
  touched: [value: boolean]
}

export type InputToggleValue = ToggleValue
export type InputToggleOption = ToggleItem
export type InputToggleBooleanIcons = InputToggleProps['items']
