import type { Color, IconNameOrString, TestIdProps } from '../../types'

export interface StatCardProps {
  testId?: TestIdProps['testId']
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
