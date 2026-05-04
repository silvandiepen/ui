import type { SidebarNavigationSection } from '../SidebarNavigation'
import type { PlatformHeaderColorMode, PlatformHeaderVariant } from '../PlatformHeader'
import type { TestIdProps } from '../../types'

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
  colorMode?: PlatformHeaderColorMode
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
  testId?: TestIdProps['testId']
  config?: AppLayoutConfig
  navigation?: SidebarNavigationSection[]
  navigationSettingsKey?: string
}
