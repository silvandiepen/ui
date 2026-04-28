import type { TestIdProps } from "../../types";

export interface IconProps {
  /**
   * Stable test id rendered on the icon root
   */
  testId?: TestIdProps['testId']

  /**
   * Icon name
   */
  name: string
  
  /**
   * Size variant of the icon
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large' | 'xl'
  
  /**
   * Color variant of the icon
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  
  /**
   * Accessibility label for screen readers
   */
  ariaLabel?: string
}

export type IconNameOrString = string
export type IconName = string
export type IconType = string

export enum IconSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  XL = 'xl'
}

export enum IconColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}
