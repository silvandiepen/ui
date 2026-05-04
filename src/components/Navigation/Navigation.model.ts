import type { RouteLocationRaw } from 'vue-router'

import type { AllColor, IconNameOrString } from '../../types'
import type { StatusBadgeTone } from '../StatusBadge'

export interface NavigationItem {
  action?: (event: MouseEvent) => void | Promise<void>
  badge?: string | number
  badgeTone?: StatusBadgeTone
  color?: AllColor
  description?: string
  disabled?: boolean
  exact?: boolean
  external?: boolean
  href?: string
  icon?: IconNameOrString
  id?: string
  items?: NavigationItem[]
  label: string
  labelPrefix?: string
  section?: string
  target?: '_blank' | '_self'
  to?: RouteLocationRaw
}

export interface NavigationSection<Item extends NavigationItem = NavigationItem> {
  description?: string
  icon?: IconNameOrString
  id: string
  items: Item[]
  label: string
}
