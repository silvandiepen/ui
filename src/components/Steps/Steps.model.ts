import type { Colors } from '../../types/color'
import type { IconNameOrString } from '../Icon/Icon.model'

export type StepStatus = 'pending' | 'active' | 'completed' | 'error'

export interface StepItem {
  title: string
  description?: string
  icon?: IconNameOrString
  status?: StepStatus
  color?: Colors
}

export type StepsDirection = 'horizontal' | 'vertical'

export interface StepsProps {
  steps: StepItem[]
  currentStep?: number
  direction?: StepsDirection
  showNumber?: boolean
  color?: Colors
}

export interface StepsEmits {
  'update:currentStep': [index: number]
  'step-click': [index: number]
}
