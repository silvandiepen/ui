import type { TestIdProps } from '../../../types'

export interface FormProps {
  /**
   * Test id for the form root.
   */
  testId?: TestIdProps['testId']

  /**
   * Form ID
   */
  id?: string
  
  /**
   * Form name attribute
   */
  name?: string
  
  /**
   * Whether the form is disabled
   * @default false
   */
  disabled?: boolean
  
  /**
   * Whether the form is in a loading state
   * @default false
   */
  loading?: boolean
  
  /**
   * Form method attribute
   * @default 'post'
   */
  method?: 'get' | 'post'
  
  /**
   * Form action URL
   */
  action?: string
  
  /**
   * Whether to prevent default form submission
   * @default true
   */
  preventDefault?: boolean
  
  /**
   * Validation mode
   * @default 'onSubmit'
   */
  validationMode?: 'onSubmit' | 'onChange' | 'onBlur'
  
  /**
   * Whether to show validation errors
   * @default true
   */
  showErrors?: boolean
}

export interface FormEmits {
  /**
   * Emitted when form is submitted
   */
  submit: [event: Event, formData: FormData]
  
  /**
   * Emitted when form validation fails
   */
  'validation-error': [errors: Record<string, string>]
  
  /**
   * Emitted when form is reset
   */
  reset: []
}

export interface FormSlots {
  /**
   * Form content
   */
  default: {
    /**
     * Whether form is valid
     */
    isValid: boolean
    
    /**
     * Current validation errors
     */
    errors: Record<string, string>
    
    /**
     * Submit form programmatically
     */
    submit: () => void
    
    /**
     * Reset form programmatically
     */
    reset: () => void
  }
}

export interface FormFieldProps {
  /**
   * Field name
   */
  name: string
  
  /**
   * Field label
   */
  label?: string
  
  /**
   * Field description/help text
   */
  description?: string
  
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean
  
  /**
   * Error message
   */
  error?: string
  
  /**
   * Whether to show error state
   * @default true
   */
  showError?: boolean

  /**
   * Layout direction for label/input.
   * @default 'column'
   */
  direction?: 'row' | 'column'

  /**
   * Gap between label and input.
   * @default 'var(--space-xs)'
   */
  gap?: string

  /**
   * Label width when direction is row.
   * @default 'auto'
   */
  labelWidth?: string

  /**
   * Cross-axis alignment for label/input row.
   * @default 'center'
   */
  align?: 'stretch' | 'flex-start' | 'center' | 'flex-end'
}

export interface FormGroupProps {
  /**
   * Layout direction for children.
   * @default 'column'
   */
  direction?: 'row' | 'column'

  /**
   * Gap between child items (CSS length).
   * @default 'var(--space)'
   */
  gap?: string

  /**
   * Whether children can wrap when direction is row.
   * @default false
   */
  wrap?: boolean

  /**
   * Align items on cross axis.
   * @default 'stretch'
   */
  align?: 'stretch' | 'flex-start' | 'center' | 'flex-end'

  /**
   * Justify items on main axis.
   * @default 'flex-start'
   */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'

  /**
   * Optional group padding.
   * @default '0'
   */
  padding?: string

  /**
   * Optional visual border.
   * @default false
   */
  bordered?: boolean

  /**
   * Group label/title
   */
  label?: string
  
  /**
   * Group description
   */
  description?: string
  
  /**
   * Whether the group is collapsible
   * @default false
   */
  collapsible?: boolean
  
  /**
   * Whether the group is initially collapsed
   * @default false
   */
  collapsed?: boolean
}
