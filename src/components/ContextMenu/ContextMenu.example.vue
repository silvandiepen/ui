<template>
  <div :class="bemm()">
      <section :class="bemm('group')">
        <p :class="bemm('label')">Short click menu</p>
        <ContextMenu :config="menuConfig">
          <Button variant="outline">Open menu</Button>
        </ContextMenu>
      </section>

      <section :class="bemm('group')">
        <p :class="bemm('label')">Right click menu</p>
        <ContextMenu :config="rightClickMenuConfig">
          <div :class="bemm('target')">Right click this surface</div>
        </ContextMenu>
      </section>
    </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { Button } from '../Button'
import ContextMenu from './ContextMenu.vue'
import type { ContextMenuConfig } from './ContextMenu.model'

const bemm = useBemm('context-menu-example')

const menuConfig: Partial<ContextMenuConfig> = {
  menu: [
    {
      id: 'open',
      label: 'Open',
    },
    {
      id: 'rename',
      label: 'Rename',
    },
    {
      id: 'archive',
      label: 'Archive',
    },
  ],
}

const rightClickMenuConfig: Partial<ContextMenuConfig> = {
  clickMode: 'right',
  menu: [
    {
      id: 'inspect',
      label: 'Inspect',
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
    },
  ],
}
</script>

<style lang="scss">
.context-menu-example {
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

  &__target {
    min-width: 14rem;
    padding: var(--space);
    border: 1px dashed color-mix(in srgb, var(--color-foreground), transparent 72%);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 2%);
  }
}
</style>
