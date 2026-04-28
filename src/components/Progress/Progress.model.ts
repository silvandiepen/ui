import type { TestIdProps } from "../../types";

export interface ProgressProps {
  testId?: TestIdProps['testId']
  details?: string[]
  indeterminate?: boolean
  label?: string
  max?: number
  showBar?: boolean
  showPercentage?: boolean
  showPercentageInBar?: boolean
  size?: 'small' | 'medium' | 'large'
  type?: 'linear' | 'circular'
  value?: number
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
}
