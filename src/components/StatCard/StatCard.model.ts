import { Colors } from '../../types'
import type { IconNameOrString } from '../../types'

export interface StatCardProps {
  value: number | string
  label?: string
  description?: string
  color?: Colors
  icon?: IconNameOrString
  countUp?: boolean
  countUpDuration?: number
  countUpFrom?: number
  prefix?: string
  suffix?: string
  locale?: string | string[]
  formatOptions?: Intl.NumberFormatOptions
}
