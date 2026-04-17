import type { SidebarNavigationSection } from '../SidebarNavigation'
import type { PlatformHeaderVariant } from '../PlatformHeader'

export interface AppLayoutSidebarConfig {
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  minMainWidth?: number
  settingsKey?: string
  mobileWidth?: string
  mobileBreakpoint?: number
}

export interface AppLayoutHeaderConfig {
  maxWidth?: string
  variant?: PlatformHeaderVariant
}

export interface AppLayoutSplitConfig {
  enabled?: boolean
  defaultWidth?: number
  minWidth?: number
  minSecondaryWidth?: number
  settingsKey?: string
  breakpoint?: number
}

export interface AppLayoutConfig {
  header?: AppLayoutHeaderConfig
  sidebar?: AppLayoutSidebarConfig
  split?: AppLayoutSplitConfig
}

export interface AppLayoutProps {
  config?: AppLayoutConfig
  navigation?: SidebarNavigationSection[]
  navigationSettingsKey?: string
}
