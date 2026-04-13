<template>
  <article :class="blockClasses" :style="blockStyles">
    <div :class="bemm('top')">
      <div :class="bemm('value-wrap')">
        <p :class="bemm('value')">
          <span v-if="prefix" :class="bemm('affix', 'prefix')">{{ prefix }}</span>
          <slot name="value">{{ displayValue }}</slot>
          <span v-if="suffix" :class="bemm('affix', 'suffix')">{{ suffix }}</span>
        </p>
      </div>

      <div v-if="hasIcon" :class="bemm('icon')">
        <slot name="icon">
          <Icon v-if="icon" :name="icon" size="large" />
        </slot>
      </div>
    </div>

    <div :class="bemm('body')">
      <p v-if="label || $slots.label" :class="bemm('label')">
        <slot name="label">{{ label }}</slot>
      </p>

      <div v-if="description || $slots.default" :class="bemm('description')">
        <slot>{{ description }}</slot>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import Icon from '../Icon/Icon.vue'
import type { StatCardProps } from './StatCard.model'

defineOptions({
  name: 'StatCard'
})

const props = withDefaults(defineProps<StatCardProps>(), {
  color: undefined,
  label: '',
  description: '',
  icon: '',
  countUp: false,
  countUpDuration: 1200,
  countUpFrom: 0,
  prefix: '',
  suffix: '',
  locale: undefined,
  formatOptions: undefined
})

const slots = defineSlots<{
  default?: () => any
  icon?: () => any
  label?: () => any
  value?: () => any
}>()

const bemm = useBemm('stat-card')
const animatedValue = ref(0)
const hasAnimated = ref(false)

let frameId: number | null = null

const isNumericValue = computed(() => typeof props.value === 'number' && Number.isFinite(props.value))
const hasIcon = computed(() => Boolean(props.icon || slots.icon))

const blockClasses = computed(() => [
  bemm(),
  props.color && bemm('', 'has-color'),
  hasIcon.value && bemm('', 'has-icon'),
  props.countUp && isNumericValue.value && bemm('', 'count-up')
].filter(Boolean))

const blockStyles = computed(() => {
  if (!props.color) {
    return {}
  }

  return {
    '--stat-card-color': `var(--color-${props.color})`
  }
})

const numberFormatOptions = computed<Intl.NumberFormatOptions>(() => {
  if (!isNumericValue.value) {
    return {}
  }

  const baseOptions = props.formatOptions ?? {}

  if (baseOptions.maximumFractionDigits !== undefined || baseOptions.minimumFractionDigits !== undefined) {
    return baseOptions
  }

  const fractionDigits = getFractionDigits(Number(props.value))

  return {
    ...baseOptions,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }
})

const displayValue = computed(() => {
  if (!isNumericValue.value) {
    return String(props.value)
  }

  return new Intl.NumberFormat(props.locale, numberFormatOptions.value).format(animatedValue.value)
})

watch(
  () => [props.value, props.countUp, props.countUpDuration, props.countUpFrom],
  () => {
    syncAnimatedValue()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  stopAnimation()
})

function syncAnimatedValue() {
  stopAnimation()

  if (!isNumericValue.value) {
    animatedValue.value = 0
    return
  }

  const targetValue = Number(props.value)

  if (!props.countUp || prefersReducedMotion() || props.countUpDuration <= 0) {
    animatedValue.value = targetValue
    hasAnimated.value = true
    return
  }

  const startValue = hasAnimated.value ? animatedValue.value : props.countUpFrom
  hasAnimated.value = true
  animateValue(startValue, targetValue)
}

function animateValue(startValue: number, targetValue: number) {
  let startTime: number | null = null

  const step = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp
    }

    const progress = Math.min((timestamp - startTime) / props.countUpDuration, 1)
    const easedProgress = 1 - ((1 - progress) ** 3)

    animatedValue.value = startValue + ((targetValue - startValue) * easedProgress)

    if (progress < 1) {
      frameId = requestAnimationFrame(step)
      return
    }

    animatedValue.value = targetValue
    frameId = null
  }

  frameId = requestAnimationFrame(step)
}

function stopAnimation() {
  if (frameId !== null) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
}

function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getFractionDigits(value: number) {
  const [fraction = ''] = value.toString().split('.').slice(1)

  return Math.min(fraction.length, 3)
}
</script>

<style lang="scss">
.stat-card {
  --stat-card-color: var(--color-primary);
  --stat-card-border-color: color-mix(in srgb, var(--stat-card-color), transparent 74%);
  --stat-card-background:
    radial-gradient(
      circle at top right,
      color-mix(in srgb, var(--stat-card-color), transparent 84%) 0,
      transparent 42%
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background), transparent 0%) 0%,
      color-mix(in srgb, var(--color-background), var(--stat-card-color) 4%) 100%
    );
  --stat-card-value-color: color-mix(in srgb, var(--color-foreground), var(--stat-card-color) 14%);

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(1rem, 2vw, 1.5rem);
  min-height: 14rem;
  padding: clamp(1.25rem, 2vw, 2rem);
  border: 1px solid var(--stat-card-border-color);
  border-radius: calc(var(--spacing-5, 1.25rem) * 1.6);
  background: var(--stat-card-background);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, white, transparent 88%),
    0 1.25rem 3rem color-mix(in srgb, var(--color-background), transparent 48%);
  overflow: hidden;

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space);
  }

  &__value-wrap {
    min-width: 0;
    flex: 1 1 auto;
  }

  &__value {
    margin: 0;
    color: var(--stat-card-value-color);
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 800;
    line-height: 0.9;
    letter-spacing: -0.05em;
    text-wrap: balance;
  }

  &__affix {
    font-size: 0.48em;
    font-weight: 700;
    letter-spacing: -0.03em;

    &--prefix {
      margin-right: 0.08em;
    }

    &--suffix {
      margin-left: 0.1em;
    }
  }

  &__icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 999px;
    color: var(--stat-card-color);
    background: color-mix(in srgb, var(--stat-card-color), transparent 88%);
    border: 1px solid color-mix(in srgb, var(--stat-card-color), transparent 72%);
    box-shadow: inset 0 1px 0 color-mix(in srgb, white, transparent 82%);
  }

  &__body {
    display: grid;
    gap: 0.65rem;
    max-width: 24rem;
  }

  &__label {
    margin: 0;
    font-size: clamp(1.15rem, 2vw, 1.65rem);
    line-height: 1.2;
    font-weight: 600;
    color: color-mix(in srgb, var(--color-foreground), transparent 14%);
    text-wrap: balance;
  }

  &__description {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    font-size: var(--font-size-m, 1rem);
    line-height: 1.55;
    text-wrap: pretty;
  }

  &--has-icon &__value-wrap {
    max-width: calc(100% - 4.25rem);
  }

  @media (max-width: 700px) {
    min-height: 12rem;
    border-radius: calc(var(--spacing-5, 1.25rem) * 1.35);

    &__icon {
      width: 2.85rem;
      height: 2.85rem;
    }

    &__body {
      max-width: none;
    }
  }
}
</style>
