import type { IconNameOrString, TestIdProps } from '../../types'
import type { NavigationItem } from '../Navigation'

export interface PillHeaderNavItem extends NavigationItem {
  items?: PillHeaderNavItem[]
}

export interface PillHeaderAction {
  label: string
  icon?: IconNameOrString
  handler?: () => void
}

export interface PillHeaderProps {
  testId?: TestIdProps['testId']
  navItems?: PillHeaderNavItem[]
  actions?: PillHeaderAction[]
  currentPath?: string
  currentSection?: string
  brandTo?: string
  brandSuffix?: string
  brandAriaLabel?: string
  theme?: 'light' | 'dark' | 'system'
  menuIcon?: IconNameOrString
  closeIcon?: IconNameOrString
}
