<template>
  <div :class="bemm()">
      <div :class="bemm('row')">
        <button :class="bemm('trigger')" type="button">
          Hover for tooltip
          <ToolTip position="top">Design tokens are shared across products.</ToolTip>
        </button>

        <button :class="bemm('trigger')" type="button">
          Slow reveal
          <ToolTip :delay="1.2" position="right">This tooltip waits before opening.</ToolTip>
        </button>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import ToolTip from './ToolTip.vue'

const bemm = useBemm('tooltip-example')
</script>

<style lang="scss">
.tooltip-example {
  display: grid;
  gap: var(--space);
  padding: var(--space-s) 0;

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space);
  }

  &__trigger {
    position: relative;
    padding: 0.75rem 1rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    border-radius: var(--border-radius);
    background: var(--color-background);
    color: var(--color-foreground);
  }
}
</style>
