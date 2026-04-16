export type InputOptionsType = 'checkbox' | 'toggle' | 'radio'

export interface InputOption {
  label: string
  value: string | number
  disabled?: boolean
  description?: string
}

export interface InputOptionsProps {
  modelValue?: (string | number)[]
  options: InputOption[]
  type?: InputOptionsType
  multiple?: boolean
  name?: string
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
}

export interface InputOptionsEmits {
  'update:modelValue': [value: (string | number)[]]
  change: [value: (string | number)[]]
  touched: [value: boolean]
}
