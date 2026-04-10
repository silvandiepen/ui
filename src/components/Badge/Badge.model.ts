import { Colors } from "../../types/color";

export const BadgeVariant = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  OUTLINE: 'outline'
} as const;
export type BadgeVariant = (typeof BadgeVariant)[keyof typeof BadgeVariant];

export const BadgeSize = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
} as const;
export type BadgeSize = (typeof BadgeSize)[keyof typeof BadgeSize];

export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  color?: Colors | null
}
