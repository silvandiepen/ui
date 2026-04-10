export interface LezuHeaderNavItem {
  label: string
  href?: string
  to?: string
  icon?: string
  exact?: boolean
  external?: boolean
}

export interface LezuHeaderProps {
  navItems?: LezuHeaderNavItem[]
  currentPath?: string
  brandHref?: string
  brandTo?: string
  brandSuffix?: string
  brandAriaLabel?: string
  fixed?: boolean
}
