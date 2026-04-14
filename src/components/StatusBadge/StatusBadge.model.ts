import { Status } from '../../types'

export type StatusBadgeTone = Status

export interface StatusBadgeProps {
  label: string
  tone?: StatusBadgeTone
}
