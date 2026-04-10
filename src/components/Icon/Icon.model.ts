export interface IconProps {
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
