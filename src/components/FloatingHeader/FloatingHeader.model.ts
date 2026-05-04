import type { ColorMode, TestIdProps } from "../../types";
import type { NavigationItem } from '../Navigation'

export interface FloatingHeaderNavItem extends NavigationItem {}

export type FloatingHeaderColorMode = ColorMode

export interface FloatingHeaderProps {
  testId?: TestIdProps['testId']
  navItems?: FloatingHeaderNavItem[]
  currentPath?: string
  brandHref?: string
  brandTo?: string
  brandSuffix?: string
  brandAriaLabel?: string
  fixed?: boolean
  colorMode?: FloatingHeaderColorMode
}
