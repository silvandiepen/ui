import type { Size, Status } from '../../../../../types'

export interface TInputSearchProps {
  /**
   * The label for the input field
   */
  label?: string

  /**
   * Placeholder text for the input
   * @default 'Search...'
   */
  placeholder?: string

  /**
   * Description text shown below the input
   */
  description?: string

  /**
   * Instructions shown when hovering the info icon
   */
  instructions?: string

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean

  /**
   * Error messages to display
   * @default []
   */
  error?: string | string[]

  /**
   * Maximum number of errors to display
   * @default 1
   */
  maxErrors?: number

  /**
   * Size of the input
   * @default Size.MEDIUM
   */
  size?: Size

  /**
   * Status of the input field
   * @default Status.IDLE
   */
  status?: Status

  /**
   * Minimum length for the input
   */
  minlength?: number

  /**
   * Maximum length for the input
   */
  maxlength?: number

  /**
   * Autocomplete attribute
   * @default 'off'
   */
  autoComplete?: string

  /**
   * Whether to autofocus the input
   * @default false
   */
  autofocus?: boolean

  /**
   * Whether to show clear button
   * @default true
   */
  clearable?: boolean

  /**
   * Whether to show controls (like character count)
   * @default false
   */
  controls?: boolean

  /**
   * Whether to auto-focus next input on max length
   * @default false
   */
  autoFocusNext?: boolean

  /**
   * Whether the input should take full width
   * @default false
   */
  block?: boolean
}