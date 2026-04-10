import { Colors } from "../../types"
import type { Action } from "../Actions"

export interface CardProps {
  variant?: 'default' | 'elevated' | 'ghost'
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
