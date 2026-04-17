<template>
  <nav :class="bemm()">
    <template v-for="(step, index) in steps" :key="step.id">
      <!-- Connector before step (not before first) -->
      <div
        v-if="index > 0"
        :class="[
          bemm('connector'),
          index <= currentIndex ? bemm('connector', 'completed') : bemm('connector', 'upcoming'),
        ]"
      />

      <div
        :class="[
          bemm('step'),
          index === currentIndex
            ? bemm('step', 'active')
            : index < currentIndex
              ? bemm('step', 'completed')
              : bemm('step', 'upcoming'),
        ]"
      >
        <div :class="bemm('step-number')">
          <span v-if="step.icon" :class="bemm('step-icon')">{{ step.icon }}</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div :class="bemm('step-title')">{{ step.title }}</div>
      </div>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import type { FormConfigStep } from './FormConfig.model'

defineProps<{
  steps: FormConfigStep[]
  currentIndex: number
}>()

const bemm = useBemm('form-config-step-nav')
</script>

<style lang="scss">
.form-config-step-nav {
  display: flex;
  align-items: center;
  gap: 0;
  width: 100%;
  overflow-x: auto;

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--space-xs, 0.5rem) * 0.5);
    flex-shrink: 0;
    cursor: default;
    user-select: none;

    &--active {
      .form-config-step-nav__step-number {
        background-color: var(--color-primary, #3b82f6);
        color: var(--color-primary-foreground, #fff);
        border-color: var(--color-primary, #3b82f6);
      }

      .form-config-step-nav__step-title {
        color: var(--color-primary, #3b82f6);
        font-weight: 600;
      }
    }

    &--completed {
      .form-config-step-nav__step-number {
        background-color: var(--color-primary, #3b82f6);
        color: var(--color-primary-foreground, #fff);
        border-color: var(--color-primary, #3b82f6);
        opacity: 0.7;
      }
    }

    &--upcoming {
      .form-config-step-nav__step-number {
        background-color: transparent;
        color: color-mix(in srgb, var(--color-foreground), transparent 50%);
        border-color: color-mix(in srgb, var(--color-foreground), transparent 70%);
      }

      .form-config-step-nav__step-title {
        color: color-mix(in srgb, var(--color-foreground), transparent 50%);
      }
    }
  }

  &__step-number {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 2px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-s, 0.875rem);
    font-weight: 600;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  }

  &__step-title {
    font-size: var(--font-size-xs, 0.75rem);
    white-space: nowrap;
    transition: color 0.2s;
  }

  &__connector {
    flex: 1;
    height: 2px;
    min-width: var(--space, 1rem);
    margin-bottom: calc(1rem + 0.25rem); // align with step number center
    transition: background-color 0.2s;

    &--completed {
      background-color: var(--color-primary, #3b82f6);
      opacity: 0.7;
    }

    &--upcoming {
      background-color: color-mix(in srgb, var(--color-foreground), transparent 80%);
    }
  }
}
</style>
