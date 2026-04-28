import type { TestIdProps } from "../../types";

export const PlatformFooterVariant = {
  DEFAULT: 'default',
  FLOAT: 'float',
} as const
export type PlatformFooterVariant = (typeof PlatformFooterVariant)[keyof typeof PlatformFooterVariant]

export interface PlatformFooterProps {
  testId?: TestIdProps['testId'];
  compact?: boolean;
  maxWidth?: string;
  variant?: PlatformFooterVariant;
}
