import type { ColorMode, TestIdProps } from "../../types";

export const PlatformHeaderVariant = {
  DEFAULT: 'default',
  FLOAT: 'float',
} as const
export type PlatformHeaderVariant = (typeof PlatformHeaderVariant)[keyof typeof PlatformHeaderVariant]
export type PlatformHeaderColorMode = ColorMode

export interface PlatformHeaderProps {
  testId?: TestIdProps['testId'];
  compact?: boolean;
  mobileOpen?: boolean;
  maxWidth?: string;
  variant?: PlatformHeaderVariant;
  colorMode?: PlatformHeaderColorMode;
}
