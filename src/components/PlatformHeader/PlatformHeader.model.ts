export const PlatformHeaderVariant = {
  DEFAULT: 'default',
  FLOAT: 'float',
} as const
export type PlatformHeaderVariant = (typeof PlatformHeaderVariant)[keyof typeof PlatformHeaderVariant]

export interface PlatformHeaderProps {
  compact?: boolean;
  mobileOpen?: boolean;
  maxWidth?: string;
  variant?: PlatformHeaderVariant;
}
