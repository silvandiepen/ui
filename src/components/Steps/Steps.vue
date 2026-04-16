<template>
  <div :class="bemm()" :data-direction="direction">
    <div
      v-for="(step, index) in steps"
      :key="index"
      :class="bemm('step', [getStepStatus(index)])"
      :style="getStepStyle(step, index)"
    >
      <div :class="bemm('indicator')">
        <div :class="bemm('circle', [getStepStatus(index)])">
          <Icon v-if="step.icon" :name="step.icon" />
          <span v-else-if="getStepStatus(index) === 'completed'" :class="bemm('check')">&#10003;</span>
          <span v-else-if="showNumber" :class="bemm('number')">{{ index + 1 }}</span>
          <span v-else :class="bemm('number')">{{ index + 1 }}</span>
        </div>
        <div v-if="index < steps.length - 1" :class="bemm('connector', [getStepStatus(index)])" />
      </div>

      <div :class="bemm('content')">
        <span :class="bemm('title')">{{ step.title }}</span>
        <span v-if="step.description" :class="bemm('description')">{{ step.description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import Icon from '../Icon/Icon.vue'
import type { StepsProps, StepsEmits, StepStatus } from './Steps.model'

const props = withDefaults(defineProps<StepsProps>(), {
  currentStep: 0,
  direction: 'horizontal',
  showNumber: true,
})

const emit = defineEmits<StepsEmits>()

const bemm = useBemm('steps', {
  includeBaseClass: true,
})

function getStepStatus(index: number): StepStatus {
  if (props.steps[index]?.status) {
    return props.steps[index].status as StepStatus
  }

  if (index < props.currentStep) return 'completed'
  if (index === props.currentStep) return 'active'
  return 'pending'
}

function getStepStyle(step: { color?: string }, _index: number) {
  const color = step.color || props.color
  if (!color) return {}
  return { '--steps-color': `var(--color-${color})` }
}
</script>

<style lang="scss">
.steps {
  --steps-color: var(--color-primary);
  --steps-circle-size: 2.25em;
  --steps-gap: var(--space-s);
  --steps-connector-thickness: 2px;

  display: flex;
  gap: 0;

  &[data-direction="horizontal"] {
    flex-direction: row;
    align-items: flex-start;

    .steps__step {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 0;
    }

    .steps__indicator {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .steps__connector {
      flex: 1;
      height: var(--steps-connector-thickness);
      margin: 0 var(--steps-gap);

      &--completed {
        background: var(--steps-color);
      }

      &--active {
        background: linear-gradient(
          to right,
          var(--steps-color) 50%,
          color-mix(in srgb, var(--color-foreground), transparent 80%) 50%
        );
      }

      &--pending {
        background: color-mix(in srgb, var(--color-foreground), transparent 80%);
      }

      &--error {
        background: var(--color-error);
      }
    }

    .steps__content {
      text-align: center;
      padding-top: var(--steps-gap);
    }
  }

  &[data-direction="vertical"] {
    flex-direction: column;

    .steps__step {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      min-height: 0;
    }

    .steps__indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .steps__connector {
      width: var(--steps-connector-thickness);
      flex: 1;
      min-height: var(--space);
      margin: var(--steps-gap) 0;

      &--completed {
        background: var(--steps-color);
      }

      &--active {
        background: linear-gradient(
          to bottom,
          var(--steps-color) 50%,
          color-mix(in srgb, var(--color-foreground), transparent 80%) 50%
        );
      }

      &--pending {
        background: color-mix(in srgb, var(--color-foreground), transparent 80%);
      }

      &--error {
        background: var(--color-error);
      }
    }

    .steps__content {
      padding-left: var(--space);
      padding-bottom: var(--space-l);
    }
  }

  &__circle {
    width: var(--steps-circle-size);
    height: var(--steps-circle-size);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8em;
    font-weight: 700;
    flex-shrink: 0;
    transition: all 0.2s ease;
    border: 2px solid transparent;

    &--pending {
      border-color: color-mix(in srgb, var(--color-foreground), transparent 70%);
      background: var(--color-background);
      color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    }

    &--active {
      border-color: var(--steps-color);
      background: var(--steps-color);
      color: var(--color-background);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--steps-color), transparent 80%);
    }

    &--completed {
      border-color: var(--steps-color);
      background: var(--steps-color);
      color: var(--color-background);
    }

    &--error {
      border-color: var(--color-error);
      background: var(--color-error);
      color: white;
    }
  }

  &__number,
  &__check {
    line-height: 1;
  }

  &__check {
    font-size: 1em;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.125em;
    min-width: 0;
  }

  &__title {
    font-weight: 600;
    font-size: 0.875em;
    color: var(--color-foreground);
    line-height: 1.3;
  }

  &__description {
    font-size: 0.8125em;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    line-height: 1.4;
  }

  &__step {
    &--active {
      .steps__title {
        color: var(--steps-color);
      }
    }

    &--pending {
      .steps__title {
        color: color-mix(in srgb, var(--color-foreground), transparent 45%);
      }
    }

    &--error {
      .steps__title {
        color: var(--color-error);
      }
    }
  }
}
</style>
