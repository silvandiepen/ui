import type { Color, IconNameOrString } from '../../types'

export interface StatCardProps {
  value: number | string
  label?: string
  description?: string
  color?: Color
  icon?: IconNameOrString
  countUp?: boolean
  countUpDuration?: number
  countUpFrom?: number
  prefix?: string
  suffix?: string
  locale?: string | string[]
  formatOptions?: Intl.NumberFormatOptions
}
