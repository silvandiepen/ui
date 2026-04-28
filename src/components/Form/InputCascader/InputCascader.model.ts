import type { Size, TestIdProps } from '../../../types'

export interface InputCascaderOption {
  label: string
  value: string
  disabled?: boolean
  icon?: string | null
  children?: InputCascaderOption[]
}

export interface InputCascaderProps {
  testId?: TestIdProps['testId']
  modelValue?: string[]
  label?: string
  description?: string
  options: InputCascaderOption[]
  disabled?: boolean
  error?: string[]
  placeholder?: string
  allowBranchSelection?: boolean
  changeOnSelect?: boolean
  size?: Size
}

export interface InputCascaderEmits {
  'update:modelValue': [value: string[]]
  change: [value: string[]]
  touched: [value: boolean]
  open: []
  close: []
}
