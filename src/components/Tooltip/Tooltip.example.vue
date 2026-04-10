<template>
  <div :class="bemm()">
    <div :class="bemm('anchor')">
      Hover target
      <Tooltip
        :actions="actions"
        show-on-parent-hover
        text="Shared tooltips can include short actions and multiline copy."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Tooltip from './Tooltip.vue'

const bemm = useBemm('tooltip-example')

const actions = [
  {
    key: 'open',
    label: 'Open docs',
  },
]
</script>

<style lang="scss">
.tooltip-example {
  padding: 2.5rem 1rem 1rem;

  &__anchor {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 10rem;
    padding: var(--space-s) var(--space);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-secondary), transparent 88%);
    color: var(--color-secondary);
    font-weight: var(--font-weight-medium);
  }
}
</style>
