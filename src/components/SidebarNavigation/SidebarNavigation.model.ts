import type { RouteLocationRaw, Router } from 'vue-router'
import type { TestIdProps } from '../../types'

import type { NavigationItem, NavigationSection } from '../Navigation'

export type SidebarNavigationLinkMode = 'auto' | 'router' | 'href'

export interface SidebarNavigationItem extends NavigationItem {
  id: string
  to?: RouteLocationRaw
}

export interface SidebarNavigationSection extends NavigationSection<SidebarNavigationItem> {
  collapsible?: boolean
  defaultCollapsed?: boolean
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
