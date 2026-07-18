import type { TestIdProps } from "../../types";

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
  size?: `${IconSize}`

  /**
   * Color variant of the icon
   */
  color?: `${IconColor}`

  /**
   * Accessibility label for screen readers
   */
  ariaLabel?: string
}

export type IconNameOrString = string
export type IconName = string
export type IconType = string
