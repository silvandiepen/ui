export { Icons } from 'open-icon'

// Common types used across UI components

export enum Size {
  XSMALL = 'xsmall',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  XLARGE = 'xlarge',
}

export enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  DEFAULT = 'default',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

export enum NotificationType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

export const NotificationStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus]

export interface BaseComponentProps {
  id?: string
  class?: string | string[] | Record<string, boolean>
  style?: string | Record<string, string>
}

export type ComponentSize = Size

export const Color = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  DARK: 'dark',
  LIGHT: 'light',
  BORDER: 'border',
  BACKGROUND: 'background',
  FOREGROUND: 'foreground',
  GRAY: 'gray',
  THEME: 'theme',
} as const

export type Color = (typeof Color)[keyof typeof Color]
export type { IconNameOrString, IconName, IconType } from '../components/Icon/Icon.model'

// Color types
export enum Colors {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
  BACKGROUND = 'background',
  BORDER = 'border',
  DARK = 'dark',
  FOREGROUND = 'foreground',
  LIGHT = 'light',
  TERTIARY = 'tertiary',
}

export const BaseColors = [
  'primary',
  'secondary', 
  'success',
  'warning',
  'error',
  'info'
] as const

export const AllColors = [
  ...BaseColors,
  'red',
  'orange', 
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
  'pink',
  'gray'
] as const

export type BaseColor = typeof BaseColors[number]
export type AllColor = typeof AllColors[number]
