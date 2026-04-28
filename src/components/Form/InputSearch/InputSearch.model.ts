import type { Size, Status, TestIdProps } from '../../../types'

export interface InputSearchProps {
  testId?: TestIdProps['testId']
  label?: string
  placeholder?: string
  description?: string
  instructions?: string
  disabled?: boolean
  error?: string | string[]
  maxErrors?: number
  size?: Size
  status?: Status
  minlength?: number
  maxlength?: number
  autoComplete?: string
  autofocus?: boolean
  clearable?: boolean
  controls?: boolean
  autoFocusNext?: boolean
  block?: boolean
  leftIcon?: boolean | string
  rightIcon?: boolean | string
  searchAction?: (value: string) => void
  searchOnEnter?: boolean
  iconOnly?: boolean
  expandWidth?: string
  collapseOnBlur?: boolean
}
