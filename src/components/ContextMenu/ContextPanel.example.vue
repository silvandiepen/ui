<template>
  <Example>
<div :class="bemm()">
    <ContextPanel :config="{ position: 'bottom-align-left' }">
      <template #default>
        <Button variant="outline">Open context panel</Button>
  </Example>
</template>

      <template #content>
        <div :class="bemm('panel')">
          <strong>Quick actions</strong>
          <p :class="bemm('copy')">
            Use `ContextPanel` when you want the anchored panel shell without the menu item list.
          </p>
          <div :class="bemm('actions')">
            <Button size="small">Assign</Button>
            <Button size="small" variant="ghost">Move</Button>
          </div>
        </div>
      </template>
    </ContextPanel>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { Button } from '../Button'
import ContextPanel from './ContextPanel.vue'

const bemm = useBemm('context-panel-example')
</script>

<style lang="scss">
.context-panel-example {
  display: inline-flex;

  &__panel {
    display: grid;
    gap: var(--space-xs);
    min-width: 14rem;
  }

  &__copy {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    font-size: var(--font-size-s);
    line-height: 1.5;
  }

  &__actions {
    display: inline-flex;
    gap: var(--space-xs);
  }
}
</style>
