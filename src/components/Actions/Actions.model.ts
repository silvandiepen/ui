import { Colors, type TestIdProps } from "../../types"
import { ButtonVariant } from "../Button"

export interface Action {
  type?: 'button' | 'link'
  label: string
  icon?: string
  iconOnly?: boolean
  action?: () => void
  href?: string
  to?: string  // For Vue router links
  variant?: ButtonVariant
  color?: Colors
  loading?: boolean
  disabled?: boolean
  tooltip?: string
}

export interface ContextMenuItem {
  label: string
  icon?: string
  action?: () => void
  href?: string
  to?: string
  disabled?: boolean
  divider?: boolean
  danger?: boolean
}

export interface ActionsProps {
  testId?: TestIdProps['testId']
  actions: Action[]
  variant?: 'inline' | 'stacked' | 'justified'
  size?: 'small' | 'medium' | 'large'
  iconOnly?: boolean
  align?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  gap?: 'none' | 'xs' | 's' | 'm' | 'l' | 'xl'
  contextMenuItems?: ContextMenuItem[]
  contextMenuPosition?: string
}
