<template>
  <Card
    :class="bemm('',['', plan.popular ? 'highlighted' : '', isCurrentPlan ? 'current' : ''])"
    :badge="getBadgeText()"
    :badge-color="getBadgeColor()"
    :test-id="testId"
  >
    <template #header>
      <div :class="bemm('header')" :data-test-id="getTestId(props.testId, 'header')">
        <h3 :class="bemm('name')" :data-test-id="getTestId(props.testId, 'name')">{{ t(plan.name) }}</h3>
        <p :class="bemm('description')" :data-test-id="getTestId(props.testId, 'description')">{{ t(plan.description) }}</p>
      </div>
    </template>

    <div :class="bemm('pricing')" :data-test-id="getTestId(props.testId, 'pricing')">
      <div :class="bemm('price')" :data-test-id="getTestId(props.testId, 'price')">
        <span :class="bemm('amount')" :data-test-id="getTestId(props.testId, 'amount')">
          {{ formattedPrice }}
        </span>
        <span v-if="plan.price[billingPeriod] > 0" :class="bemm('period')" :data-test-id="getTestId(props.testId, 'period')">
          /{{ billingPeriod === 'yearly' ? 'year' : 'month' }}
        </span>
      </div>
      <div v-if="billingPeriod === 'yearly' && plan.price.yearly > 0" :class="bemm('monthly-equivalent')" :data-test-id="getTestId(props.testId, 'monthly-equivalent')">
        {{ formatPriceValue(plan.price.yearly / 12) }}/month
      </div>
      <div v-if="billingPeriod === 'yearly' && plan.price.yearly > 0 && plan.price.monthly > 0" :class="bemm('savings')" :data-test-id="getTestId(props.testId, 'savings')">
        Save {{ formatPriceValue((plan.price.monthly * 12) - plan.price.yearly) }}
      </div>
    </div>

    <div v-if="showFeatures" :class="bemm('features')" :data-test-id="getTestId(props.testId, 'features')">
      <ul :class="bemm('feature-list')" :data-test-id="getTestId(props.testId, 'feature-list')">
        <li
          v-for="feature in displayedFeatures"
          :key="feature.id"
          :class="bemm('feature', ['', feature.included ? 'included' : 'excluded'])"
          :data-test-id="getTestId(props.testId, `feature-${feature.id}`)"
        >
          <Icon
            :name="feature.included ? 'check' : 'x'"
            :class="bemm('feature-icon', ['', feature.included ? 'included' : 'excluded'])"
            :data-test-id="getTestId(props.testId, `feature-${feature.id}-icon`)"
          />
          <span :class="bemm('feature-text')" :data-test-id="getTestId(props.testId, `feature-${feature.id}-text`)">
            {{ feature.name }}
          </span>
        </li>
      </ul>
    </div>

    <template #footer>
      <div :class="bemm('action')" :data-test-id="getTestId(props.testId, 'action')">
        <Button
          v-if="!isCurrentPlan && onAction"
          :variant="plan.ctaVariant === 'primary' ? 'primary' : 'secondary'"
          :disabled="plan.id === 'enterprise' && !actionText?.includes('Contact')"
          @click="handleAction"
          block
          :test-id="getTestId(props.testId, 'action-button')"
        >
          {{ getActionText() }}
        </Button>
        <Button
          v-else-if="isCurrentPlan"
          variant="outline"
          disabled
          block
          :test-id="getTestId(props.testId, 'current-button')"
        >
          {{ t('pricing.current') }}
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import { defaultFormatPrice } from './PricingCard.model'
import type { PricingCardProps } from './PricingCard.model'
import { Card } from '../Card'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { getTestId } from '../../utils/testId'

const props = withDefaults(defineProps<PricingCardProps>(), {
  billingPeriod: 'monthly',
  showFeatures: true,
  maxFeatures: 8,
  formatPrice: () => defaultFormatPrice,
  translate: (key: string) => key,
})

const { bemm } = useBemm('pricing-card')

const t = props.translate
const formatPriceValue = props.formatPrice

const isCurrentPlan = computed(() => props.currentPlanId === props.plan.id)

const formattedPrice = computed(() => {
  return formatPriceValue(props.plan.price[props.billingPeriod])
})

const displayedFeatures = computed(() => {
  if (!props.showFeatures) return []

  const includedFeatures = props.plan.features.filter(f => f.included)
  const excludedFeatures = props.plan.features.filter(f => !f.included)

  const features = [
    ...includedFeatures,
    ...excludedFeatures.slice(0, Math.max(0, props.maxFeatures - includedFeatures.length))
  ]

  return features.slice(0, props.maxFeatures)
})

function getActionText() {
  if (props.actionText) return props.actionText

  return t(props.plan.ctaText || 'pricing.select')
}

function handleAction() {
  props.onAction?.(props.plan.id)
}

function getBadgeText() {
  if (props.plan.popular) {
    return props.plan.badge ? t(props.plan.badge) : t('pricing.mostPopular')
  }
  if (isCurrentPlan.value) {
    return t('pricing.current')
  }
  return undefined
}

function getBadgeColor() {
  if (props.plan.popular) {
    return 'primary'
  }
  if (isCurrentPlan.value) {
    return 'secondary'
  }
  return undefined
}
</script>

<style lang="scss">
.pricing-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  &--highlighted {
    border: 2px solid var(--color-primary);
    box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary), transparent 85%);
  }

  &--current {
    background: color-mix(in srgb, var(--color-primary), transparent 95%);
  }

  &__name {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin: 0 0 var(--space-xs) 0;
  }

  &__description {
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    margin: 0;
  }

  &__pricing {
    text-align: center;
    padding: var(--space-l) 0;
  }

  &__price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: var(--space-xs);
  }

  &__amount {
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-bold);
    line-height: 1;
  }

  &__period {
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    font-size: var(--font-size-m);
  }

  &__monthly-equivalent {
    font-size: var(--font-size-s);
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    margin-top: var(--space-xs);
  }

  &__savings {
    font-size: var(--font-size-s);
    color: var(--color-success);
    font-weight: var(--font-weight-semibold);
    margin-top: var(--space-xs);
  }

  &__features {
    flex: 1;
    padding: 0 var(--space-l) var(--space-l);
  }

  &__feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }

  &__feature {
    display: flex;
    align-items: flex-start;
    gap: var(--space-s);

    &--excluded {
      color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    }
  }

  &__feature-icon {
    flex-shrink: 0;
    width: 1.25em;
    height: 1.25em;

    &--included {
      color: var(--color-success);
    }

    &--excluded {
      color: color-mix(in srgb, var(--color-foreground), transparent 70%);
    }
  }

  &__feature-text {
    flex: 1;
    font-size: var(--font-size-s);
  }

  &__action {
    width: 100%;
  }
}
</style>
