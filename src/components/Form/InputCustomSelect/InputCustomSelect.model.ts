import type { Size } from '../../../types'

export interface CustomOption {
  label: string
  value: string
  disabled?: boolean
  icon?: string
  color?: string
  indent?: number
  customContent?: string
  isNull?: boolean
}

export interface InputCustomSelectProps {
  /**
   * The current selected value
   */
  modelValue?: string | null
  
  /**
   * Fallback value for v-model
   */
  value?: string
  
  /**
   * Label text displayed above the select
   */
  label?: string
  
  /**
   * Help text displayed below the select
   */
  description?: string
  
  /**
   * Available options for selection
   */
  options: (string | CustomOption)[]
  
  /**
   * Error messages to display
   * @default []
   */
  error?: string[]
  
  /**
   * Size variant of the select
   * @default Size.MEDIUM
   */
  size?: Size
  
  /**
   * Whether to allow null/empty selection
   * @default false
   */
  allowNull?: boolean
  
  /**
   * Label for the null/empty option
   * @default 'Please select...'
   */
  nullLabel?: string
  
  /**
   * Whether the select is disabled
   * @default false
   */
  disabled?: boolean
  
  /**
   * Placeholder text (when no value selected)
   * @default 'Select an option'
   */
  placeholder?: string
  
  /**
   * Whether the select is searchable
   * @default false
   */
  searchable?: boolean
  
  /**
   * Whether to allow custom values (with allow-custom)
   * @default false
   */
  allowCustom?: boolean
}

export interface InputCustomSelectEmits {
  /**
   * Emitted when value changes
   */
  'update:modelValue': [value: string | null]
  
  /**
   * Emitted when the select value changes
   */
  change: [value: string | null]
  
  /**
   * Emitted when the select is touched/untouched
   */
  touched: [value: boolean]
  
  /**
   * Emitted when select gains focus
   */
  focus: [event: FocusEvent]
  
  /**
   * Emitted when select loses focus
   */
  blur: [event: FocusEvent]
}