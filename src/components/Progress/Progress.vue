<template>
  <div
    :class="bemm('', [`type-${type}`, `size-${size}`])"
    :data-test-id="testId"
  >
    <div
      v-if="type === 'linear' && showBar"
      :class="bemm('bar')"
      :data-test-id="getTestId(props.testId, 'bar')"
    >
      <div
        :class="bemm('fill', ['', indeterminate ? 'indeterminate' : '', `variant-${variant}`])"
        :style="!indeterminate ? { width: `${percentage}%` } : undefined"
        :data-test-id="getTestId(props.testId, 'fill')"
      >
        <span
          v-if="showPercentageInBar && !indeterminate"
          :class="bemm('bar-label')"
          :data-test-id="getTestId(props.testId, 'bar-label')"
        >
          {{ Math.round(percentage) }}%
        </span>
      </div>
    </div>

    <div
      v-if="type === 'circular'"
      :class="bemm('circular')"
      :data-test-id="getTestId(props.testId, 'circular')"
    >
      <svg
        :class="bemm('circular-svg')"
        viewBox="0 0 100 100"
        :data-test-id="getTestId(props.testId, 'circular-svg')"
      >
        <circle
          :class="bemm('circular-track')"
          :data-test-id="getTestId(props.testId, 'circular-track')"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke-width="6"
        />
        <circle
          :class="bemm('circular-fill', ['', indeterminate ? 'indeterminate' : '', `variant-${variant}`])"
          :data-test-id="getTestId(props.testId, 'circular-fill')"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke-width="6"
          :stroke-dasharray="!indeterminate ? `${percentage * 2.83} 283` : '212.25 70.75'"
          :style="indeterminate ? { animation: 'circular-indeterminate 1.4s ease-in-out infinite' } : undefined"
        />
      </svg>
      <div
        v-if="showPercentage && !indeterminate"
        :class="bemm('circular-label')"
        :data-test-id="getTestId(props.testId, 'circular-label')"
      >
        {{ Math.round(percentage) }}%
      </div>
    </div>

    <div
      v-if="label || showPercentage"
      :class="bemm('label')"
      :data-test-id="getTestId(props.testId, 'label')"
    >
      <span
        v-if="label"
        :class="bemm('label-text')"
        :data-test-id="getTestId(props.testId, 'label-text')"
      >{{ label }}</span>
      <span
        v-if="showPercentage && !showPercentageInBar"
        :class="bemm('label-percentage')"
        :data-test-id="getTestId(props.testId, 'label-percentage')"
      >
        {{ Math.round(percentage) }}%
      </span>
    </div>

    <div
      v-if="details && details.length > 0"
      :class="bemm('details')"
      :data-test-id="getTestId(props.testId, 'details')"
    >
      <span
        v-for="(detail, index) in details"
        :key="index"
        :class="bemm('detail')"
        :data-test-id="getTestId(props.testId, `detail-${index}`)"
      >
        {{ detail }}
      </span>
    </div>

    <div
      v-if="$slots.default"
      :class="bemm('content')"
      :data-test-id="getTestId(props.testId, 'content')"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useBemm } from 'bemm'

import type { ProgressProps } from './Progress.model'
import { getTestId } from '../../utils/testId'

defineOptions({
  name: 'Progress',
})

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  max: 100,
  showBar: true,
  showPercentage: true,
  showPercentageInBar: false,
  indeterminate: false,
  variant: 'primary',
  size: 'medium',
  type: 'linear',
})

const { bemm } = useBemm('progress')

const percentage = computed(() => {
  if (props.max === 0) {
    return 0
  }

  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})
</script>

<style lang="scss">
.progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: 100%;

  &--size-small {
    .progress__bar {
      height: 4px;
    }

    .progress__label,
    .progress__details {
      font-size: var(--font-size-s);
    }
  }

  &--size-medium {
    .progress__bar {
      height: 8px;
    }
  }

  &--size-large {
    .progress__bar {
      height: 12px;
    }

    .progress__label {
      font-size: var(--font-size-l);
    }
  }

  &__bar {
    position: relative;
    width: 100%;
    background: color-mix(in srgb, var(--color-foreground), transparent 90%);
    border-radius: var(--border-radius-s);
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    transition: width 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &--variant-primary {
      background: var(--color-primary);
    }

    &--variant-success {
      background: var(--color-success);
    }

    &--variant-warning {
      background: var(--color-warning);
    }

    &--variant-error {
      background: var(--color-error);
    }

    &--variant-info {
      background: var(--color-info);
    }

    &--indeterminate {
      width: 30% !important;
      position: absolute;
      animation: progress-indeterminate 1.5s infinite ease-in-out;
    }
  }

  &__bar-label {
    font-size: var(--font-size-xs);
    color: var(--color-white);
    font-weight: var(--font-weight-semibold);
    text-shadow: 0 1px 2px color-mix(in srgb, var(--color-foreground), transparent 80%);
  }

  &__label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-s);
  }

  &__label-text {
    color: var(--color-foreground);
    font-weight: var(--font-weight-semibold);
  }

  &__label-percentage {
    color: var(--color-foreground-secondary);
    font-variant-numeric: tabular-nums;
  }

  &__details {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-m);
    font-size: var(--font-size-s);
  }

  &__detail {
    color: var(--color-foreground-secondary);
    white-space: nowrap;

    &::after {
      content: '•';
      margin-left: var(--space-m);
    }

    &:last-child::after {
      display: none;
    }
  }

  &__content {
    margin-top: var(--space-s);
  }

  &__circular {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: flex-start;
  }

  &__circular-svg {
    width: 4rem;
    height: 4rem;
    transform: rotate(-90deg);
  }

  &__circular-track {
    stroke: color-mix(in srgb, var(--color-foreground), transparent 90%);
  }

  &__circular-fill {
    stroke: var(--color-primary);
    transition: stroke-dasharray 0.3s ease;

    &--variant-success {
      stroke: var(--color-success);
    }

    &--variant-warning {
      stroke: var(--color-warning);
    }

    &--variant-error {
      stroke: var(--color-error);
    }

    &--variant-info {
      stroke: var(--color-info);
    }
  }

  &__circular-label {
    position: absolute;
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-semibold);
  }
}

@keyframes progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(220%);
  }

  100% {
    transform: translateX(360%);
  }
}

@keyframes circular-indeterminate {
  0% {
    stroke-dasharray: 1 283;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 212.25 70.75;
    stroke-dashoffset: -35;
  }

  100% {
    stroke-dasharray: 212.25 70.75;
    stroke-dashoffset: -248;
  }
}
</style>
