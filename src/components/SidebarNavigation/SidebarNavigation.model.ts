import type { RouteLocationRaw } from 'vue-router'

import type { StatusBadgeTone } from '../StatusBadge'

export interface SidebarNavigationItem {
  badge?: string
  badgeTone?: StatusBadgeTone
  description?: string
  disabled?: boolean
  href?: string
  icon?: string
  id: string
  label: string
  labelPrefix?: string
  target?: '_blank' | '_self'
  to?: RouteLocationRaw
}

export interface SidebarNavigationSection {
  collapsible?: boolean
  defaultCollapsed?: boolean
  description?: string
  icon?: string
  id: string
  items: SidebarNavigationItem[]
  label: string
}

export interface SidebarNavigationProps {
  ariaLabel?: string
  settingsKey?: string
  sections: SidebarNavigationSection[]
}
