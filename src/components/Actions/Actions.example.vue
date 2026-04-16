<template>
  <div :class="bemm()">
      <section :class="bemm('group')">
        <p :class="bemm('label')">Compact card actions</p>
        <Actions :actions="actions" :context-menu-items="contextMenuItems" />
      </section>

      <section :class="bemm('group')">
        <p :class="bemm('label')">Dense row actions</p>
        <Actions :actions="secondaryActions" />
      </section>
    </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Actions from './Actions.vue'
import type { Action, ContextMenuItem } from './Actions.model'

const bemm = useBemm('actions-example')

const actions: Action[] = [
  {
    label: 'Edit',
  },
  {
    label: 'Share',
    variant: 'secondary',
  },
]

const contextMenuItems: ContextMenuItem[] = [
  {
    label: 'Duplicate',
  },
  {
    label: 'Archive',
  },
]

const secondaryActions: Action[] = [
  {
    label: 'Open',
    variant: 'ghost',
  },
  {
    label: 'Approve',
  },
  {
    label: 'Reject',
    variant: 'secondary',
  },
]
</script>

<style lang="scss">
.actions-example {
  display: grid;
  gap: var(--space);

  &__group {
    display: grid;
    gap: var(--space-xs);
    justify-items: start;
  }

  &__label {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 35%);
    font-size: var(--font-size-s);
  }
}
</style>
