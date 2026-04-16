<template>
  <Example>
<div :class="bemm()">
    <DataListSelectionToolbar
      :selected-count="selectedRows.length"
      :selected-rows="selectedRows"
      :selection-actions="selectionActions"
      :show-actions="true"
    />
  </div>
  </Example>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import DataListSelectionToolbar from './DataListSelectionToolbar.vue'
import type { DropdownItem } from '../Dropdown'

const bemm = useBemm('data-list-selection-toolbar-example')

const selectedRows = [
  {
    id: 'user-1',
    name: 'Ada Lovelace',
  },
  {
    id: 'user-2',
    name: 'Grace Hopper',
  },
]

const selectionActions: DropdownItem[] = [
  {
    label: 'Archive',
    type: 'item',
    value: 'archive',
  },
  {
    label: 'Assign owner',
    type: 'item',
    value: 'assign-owner',
  },
]
</script>

<style lang="scss">
.data-list-selection-toolbar-example {
  display: flex;
}
</style>
