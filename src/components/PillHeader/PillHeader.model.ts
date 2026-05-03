import type { TestIdProps } from '../../types'

export interface PillHeaderNavItem {
  label: string
  to?: string
  href?: string
  icon?: string
  exact?: boolean
  external?: boolean
  section?: string
}

export interface PillHeaderAction {
  label: string
  icon?: string
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
  menuIcon?: string
  closeIcon?: string
}
