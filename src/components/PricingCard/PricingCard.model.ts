export interface PlanFeature {
  id: string
  name: string
  included: boolean
}

export interface Plan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: PlanFeature[]
  popular?: boolean
  badge?: string
  ctaText?: string
  ctaVariant?: 'primary' | 'secondary'
}

export interface PricingCardProps {
  plan: Plan
  billingPeriod?: 'monthly' | 'yearly'
  currentPlanId?: string
  showFeatures?: boolean
  maxFeatures?: number
  actionText?: string
  formatPrice?: (price: number) => string
  translate?: (key: string) => string
  onAction?: (planId: string) => void
}

export function defaultFormatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)
}
