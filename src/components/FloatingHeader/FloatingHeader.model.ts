export interface FloatingHeaderNavItem {
  label: string
  href?: string
  to?: string
  icon?: string
  exact?: boolean
  external?: boolean
}

export interface FloatingHeaderProps {
  navItems?: FloatingHeaderNavItem[]
  currentPath?: string
  brandHref?: string
  brandTo?: string
  brandSuffix?: string
  brandAriaLabel?: string
  fixed?: boolean
}
