<template>
  <span :class="bemm()" :style="badgeStyle">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { computed } from 'vue'
import { Status } from '../../types'

import type { StatusBadgeProps } from './StatusBadge.model'

const props = withDefaults(defineProps<StatusBadgeProps>(), {
  tone: Status.DEFAULT,
})

const bemm = useBemm('status-badge', {
  includeBaseClass: true,
})

const badgeStyle = computed(() => {
  switch (props.tone) {
  case Status.SUCCESS:
    return {
      '--status-badge-color': 'var(--status-badge-success-color, var(--color-success))',
      '--status-badge-border-color': 'var(--status-badge-success-border-color, var(--color-success))',
      '--status-badge-text': 'var(--status-badge-success-text, var(--color-success-contrast))',
      '--status-badge-background-opacity': '50%',
    }
  case Status.WARNING:
    return {
      '--status-badge-color': 'var(--status-badge-warning-color, var(--color-warning))',
      '--status-badge-border-color': 'var(--status-badge-warning-border-color, var(--color-warning))',
      '--status-badge-text': 'var(--status-badge-warning-text, var(--color-warning-contrast))',
      '--status-badge-background-opacity': '50%',
    }
  case Status.ERROR:
    return {
      '--status-badge-color': 'var(--status-badge-error-color, var(--color-error))',
      '--status-badge-border-color': 'var(--status-badge-error-border-color, var(--color-error))',
      '--status-badge-text': 'var(--status-badge-error-text, var(--color-error-contrast))',
      '--status-badge-background-opacity': '50%',
    }
  case Status.INFO:
  case Status.LOADING:
    return {
      '--status-badge-color': 'var(--status-badge-info-color, var(--color-info))',
      '--status-badge-border-color': 'var(--status-badge-info-border-color, var(--color-info))',
      '--status-badge-text': 'var(--status-badge-info-text, var(--color-info-contrast))',
      '--status-badge-background-opacity': '50%',
    }
  case Status.IDLE:
  case Status.DEFAULT:
  default:
    return {
      '--status-badge-color': 'var(--status-badge-default-color, var(--color-foreground))',
      '--status-badge-border-color': 'var(--status-badge-default-border-color, color-mix(in srgb, var(--color-foreground), transparent 75%))',
      '--status-badge-text': 'var(--status-badge-default-text, var(--color-foreground))',
      '--status-badge-background-opacity': 'var(--status-badge-default-background-opacity, 100%)',
    }
  }
})
</script>

<style lang="scss">
.status-badge {
  display: inline-flex;
  align-items: center;
  flex-grow: 0;
  height: fit-content;
  padding: var(--space-xs) var(--space-s);
  border-radius: var(--status-badge-border-radius, var(--border-radius-l));
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
  border: var(--status-badge-border, var(--status-badge-border-color, transparent) solid 1px);
  letter-spacing: 0.04em;
  background: color-mix(in srgb, var(--status-badge-color), transparent var(--status-badge-background-opacity));
  color: var(--status-badge-text);
  width: var(--status-badge-width, fit-content);
}
</style>
