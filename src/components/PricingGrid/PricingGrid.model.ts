import type { Plan } from '../PricingCard/PricingCard.model'
import type { TestIdProps } from '../../types'

export interface PricingGridProps {
  testId?: TestIdProps['testId']
  plans: Plan[]
  billingPeriod?: 'monthly' | 'yearly'
  currentPlanId?: string
  showFeatures?: boolean
  maxFeatures?: number
  columns?: 2 | 3 | 4
  onSelectPlan?: (planId: string) => void
}
