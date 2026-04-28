import { Colors, type TestIdProps } from "../../types"
import type { Action } from "../Actions"


export const CardVariant = {
  DEFAULT: 'default',
  ELEVATED: 'elevated',
  GHOST: 'ghost',
}

export type CardVariant = typeof CardVariant[keyof typeof CardVariant];
export interface CardProps {
  testId?: TestIdProps['testId']
  variant?: CardVariant
  color?: Colors
  featured?: boolean
  hoverable?: boolean
  title?: string
  description?: string
  headerActions?: Action[]
  footerActions?: Action[]
  noPadding?: boolean
  noHeaderPadding?: boolean
  noContentPadding?: boolean
  noFooterPadding?: boolean
  badge?: string
  badgeColor?: string
}
