import type { RouteLocationRaw, Router } from 'vue-router'
import type { TestIdProps } from '../../types'

import type { StatusBadgeTone } from '../StatusBadge'

export type SidebarNavigationLinkMode = 'auto' | 'router' | 'href'

export interface SidebarNavigationItem {
  action?: (event: MouseEvent) => void | Promise<void>
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
  testId?: TestIdProps['testId']
  ariaLabel?: string
  linkMode?: SidebarNavigationLinkMode
  router?: Router | null
  settingsKey?: string
  showSectionItemCount?: boolean
  sections: SidebarNavigationSection[]
}
