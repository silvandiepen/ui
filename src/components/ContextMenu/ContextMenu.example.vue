<template>
  <div :class="bemm()">
    <ContextMenu :config="menuConfig">
      <Button variant="outline">Open menu</Button>
    </ContextMenu>
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
</script>

<style lang="scss">
.context-menu-example {
  display: inline-flex;
}
</style>
