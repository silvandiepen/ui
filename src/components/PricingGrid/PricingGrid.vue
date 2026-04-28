<template>
  <div :class="bemm(['', `columns-${columns}`])" :data-test-id="testId">
    <div :class="bemm('header')" v-if="$slots.header" :data-test-id="getTestId(props.testId, 'header')">
      <slot name="header" />
    </div>

    <div :class="bemm('toggle')" v-if="$slots.toggle" :data-test-id="getTestId(props.testId, 'toggle')">
      <slot name="toggle" :billing-period="billingPeriod" />
    </div>

    <div :class="bemm('grid')" :data-test-id="getTestId(props.testId, 'grid')">
      <PricingCard
        v-for="plan in displayedPlans"
        :key="plan.id"
        :plan="plan"
        :billing-period="billingPeriod"
        :current-plan-id="currentPlanId"
        :show-features="showFeatures"
        :max-features="maxFeatures"
        :action-text="getActionText(plan)"
        :on-action="handleSelectPlan"
        :class="bemm('card')"
        :test-id="getTestId(props.testId, `plan-${plan.id}`)"
      />
    </div>

    <div :class="bemm('footer')" v-if="$slots.footer" :data-test-id="getTestId(props.testId, 'footer')">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import type { PricingGridProps } from './PricingGrid.model'
import type { Plan } from '../PricingCard/PricingCard.model'
import { PricingCard } from '../PricingCard'
import { getTestId } from '../../utils/testId'

const props = withDefaults(defineProps<PricingGridProps>(), {
  billingPeriod: 'monthly',
  showFeatures: true,
  maxFeatures: 8,
  columns: 4
})

const emit = defineEmits<{
  selectPlan: [planId: string]
}>()

const { bemm } = useBemm('pricing-grid')

const displayedPlans = computed(() => props.plans)

function getActionText(_plan: Plan) {
  return undefined
}

function handleSelectPlan(planId: string) {
  props.onSelectPlan?.(planId)
  emit('selectPlan', planId)
}
</script>

<style lang="scss">
.pricing-grid {
  &__header {
    text-align: center;
    margin-bottom: var(--space-l);
  }

  &__toggle {
    display: flex;
    justify-content: center;
    margin-bottom: var(--space-xl);
  }

  &__grid {
    display: grid;
    gap: var(--space-l);
    align-items: stretch;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &--columns-3 &__grid {
    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &--columns-4 &__grid {
    @media (min-width: 1024px) {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  &__card {
    height: 100%;
  }

  &__footer {
    margin-top: var(--space-xl);
    text-align: center;
  }
}
</style>
