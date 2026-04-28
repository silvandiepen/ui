import type { TestIdProps } from "../../types";

export interface FloatingHeaderNavItem {
  label: string
  href?: string
  to?: string
  icon?: string
  exact?: boolean
  external?: boolean
}

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
