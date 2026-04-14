import type { IconNameOrString } from '../Icon'

export type CollapsibleToggleIcon = 'chevron' | 'plus'

export interface CollapsibleEventContext {
  event?: Event
  isOpen: boolean
}

export interface CollapsibleProps {
  ariaLabel?: string
  contentId?: string
  defaultOpen?: boolean
  disabled?: boolean
  icon?: IconNameOrString
  label?: string
  modelValue?: boolean
  toggleIcon?: CollapsibleToggleIcon
}
