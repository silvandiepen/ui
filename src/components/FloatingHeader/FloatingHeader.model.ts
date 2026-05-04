import type { TestIdProps } from "../../types";
import type { NavigationItem } from '../Navigation'

export interface FloatingHeaderNavItem extends NavigationItem {}

export interface FloatingHeaderProps {
  testId?: TestIdProps['testId']
  navItems?: FloatingHeaderNavItem[]
  currentPath?: string
  brandHref?: string
  brandTo?: string
  brandSuffix?: string
  brandAriaLabel?: string
  fixed?: boolean
}
