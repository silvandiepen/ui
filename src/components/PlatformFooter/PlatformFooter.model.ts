import type { ColorMode, TestIdProps } from "../../types";

export const PlatformFooterVariant = {
  DEFAULT: 'default',
  FLOAT: 'float',
} as const
export type PlatformFooterVariant = (typeof PlatformFooterVariant)[keyof typeof PlatformFooterVariant]
export type PlatformFooterColorMode = ColorMode

export interface PlatformFooterProps {
  testId?: TestIdProps['testId'];
  compact?: boolean;
  maxWidth?: string;
  variant?: PlatformFooterVariant;
  colorMode?: PlatformFooterColorMode;
}
