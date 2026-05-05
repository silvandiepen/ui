import type { AllColor, ColorMode, IconNameOrString, TestIdProps } from '../../types'
import type { NavigationItem } from '../Navigation'

export type PillHeaderColorMode = ColorMode

export interface PillHeaderNavItem extends NavigationItem {
  items?: PillHeaderNavItem[]
}

export interface PillHeaderActionItem {
  label: string
  icon?: IconNameOrString
  handler?: () => void
  danger?: boolean
}

export interface PillHeaderAction {
    color?: AllColor;
    variant?: 'default' | 'primary';
    label: string;
    icon?: IconNameOrString;
    iconOnly?: boolean;
    handler?: () => void;
    /** When set, renders as a dropdown menu instead of a button */
    items?: PillHeaderActionItem[];
}

export interface PillHeaderProps {
  testId?: TestIdProps['testId']
  navItems?: PillHeaderNavItem[]
  actions?: PillHeaderAction[]
  currentPath?: string
  currentSection?: string
  brandTo?: string
  brandSuffix?: string
  brandAriaLabel?: string
  color?: AllColor
  colorMode?: PillHeaderColorMode
  theme?: 'light' | 'dark' | 'system'
  menuIcon?: IconNameOrString
  closeIcon?: IconNameOrString
}
