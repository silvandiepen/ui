<template>
  <div :class="bemm()">
    <Actions :actions="actions" :context-menu-items="contextMenuItems" />
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
</script>

<style lang="scss">
.actions-example {
  display: flex;
  justify-content: flex-start;
}
</style>
