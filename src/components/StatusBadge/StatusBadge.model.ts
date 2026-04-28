import { Status, type TestIdProps } from '../../types'

export type StatusBadgeTone = Status

export interface StatusBadgeProps {
  testId?: TestIdProps['testId']
  label: string
  tone?: StatusBadgeTone
}
