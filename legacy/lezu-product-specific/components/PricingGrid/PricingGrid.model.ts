import type { Plan } from '@lezu/core'

export interface PricingGridProps {
  plans?: Plan[]
  billingPeriod?: 'monthly' | 'yearly'
  currentPlanId?: string
  showFeatures?: boolean
  maxFeatures?: number
  columns?: 2 | 3 | 4
  onSelectPlan?: (planId: string) => void
}