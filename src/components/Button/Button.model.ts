/**
 * Button component type definitions and interfaces
 */

import type { Colors, TestIdProps } from "../../types";

export const ButtonSize = {
  XSMALL: 'xsmall',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge'
} as const;
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

export const ButtonVariant = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  DANGER: 'danger'
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const ButtonType = {
  BUTTON: 'button',
  SUBMIT: 'submit',
  RESET: 'reset'
} as const;
export type ButtonType = (typeof ButtonType)[keyof typeof ButtonType];

/**
 * Props interface for Button component
 */
export interface ButtonProps {
  /** Stable test id rendered on the root and interesting child elements */
  testId?: TestIdProps['testId'];

  /** Button size variant */
  size?: ButtonSize;
  /** Button style variant */
  variant?: ButtonVariant;
  /** HTML button type attribute */
  type?: ButtonType;
  /** Icon name to display */
  icon?: string;
  /** Whether to show icon only (hide text) */
  iconOnly?: boolean;
  /** Position icon after text */
  iconAfter?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is in loading state */
  loading?: boolean;
  /** Make button full width */
  block?: boolean;
  /** Link URL for router-link */
  to?: string;
  /** External link URL */
  href?: string;
  /** HTML element type to render */
  element?: string;
  /** Custom color override */
  color?: Colors;
  /** Tooltip text to display on hover */
  tooltip?: string;
}
