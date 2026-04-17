export const PlatformFooterVariant = {
  DEFAULT: 'default',
  FLOAT: 'float',
} as const
export type PlatformFooterVariant = (typeof PlatformFooterVariant)[keyof typeof PlatformFooterVariant]

export interface PlatformFooterProps {
  compact?: boolean;
  maxWidth?: string;
  variant?: PlatformFooterVariant;
}
