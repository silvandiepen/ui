<template>
  <Example>
<div :class="bemm()">
    <div :class="bemm('placements')">
      <div
        v-for="placement in placements"
        :key="placement"
        :class="bemm('anchor')"
      >
        <span>{{ placement }}</span>
        <Tooltip
          :placement="placement"
          show-on-parent-hover
          :text="`Tooltip on ${placement}`"
        />
      </div>
    </div>

    <div :class="bemm('anchor')">
      Rich tooltip
      <Tooltip
        :actions="actions"
        placement="right"
        multiline
        show-on-parent-hover
        text="Shared tooltips can include actions, multiple lines, and alternate placement."
      />
    </div>

    <div :class="bemm('anchor')">
      Manual open
      <Tooltip
        color="secondary"
        placement="bottom"
        :open="manualOpen"
        text="Controlled tooltips can stay visible while you inspect the layout."
      />
    </div>
  </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import Tooltip from './Tooltip.vue'
import type { TooltipPlacement } from './Tooltip.model'

const bemm = useBemm('tooltip-example')
const manualOpen = ref(true)
const placements: TooltipPlacement[] = ['top', 'right', 'bottom', 'left']

const actions = [
  {
    key: 'open',
    label: 'Open docs',
  },
]
</script>

<style lang="scss">
.tooltip-example {
  display: grid;
  gap: 2rem;
  padding: 2.5rem 1rem 1rem;

  &__placements {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
    gap: 1rem;
  }

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
    min-height: 3rem;
  }
}
</style>
