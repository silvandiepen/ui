import type { Plan } from '@lezu/core'

export interface PricingCardProps {
  plan: Plan
  billingPeriod?: 'monthly' | 'yearly'
  currentPlanId?: string
  showFeatures?: boolean
  maxFeatures?: number
  actionText?: string
  onAction?: (planId: string) => void
}