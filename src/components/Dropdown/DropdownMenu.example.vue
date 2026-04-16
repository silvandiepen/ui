<template>
  <div :class="bemm()">
    <DropdownMenu :options="options">
      <template #trigger="{ toggle }">
        <Button variant="outline" @click="toggle">Open action menu</Button>
      </template>
    </DropdownMenu>

    <DropdownMenu :options="sortingOptions">
      <template #trigger="{ toggle }">
        <Button variant="ghost" @click="toggle">Sort by updated</Button>
      </template>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { Button } from '../Button'

import DropdownMenu from './DropdownMenu.vue'
import type { DropdownOption } from './Dropdown.model'

const bemm = useBemm('dropdown-menu-example')

const options: DropdownOption[] = [
  {
    label: 'Rename',
    type: 'item' as const,
    value: 'rename',
  },
  {
    label: 'Archive',
    type: 'item' as const,
    value: 'archive',
  },
  {
    type: 'divider' as const,
  },
  {
    label: 'Delete',
    type: 'item' as const,
    value: 'delete',
  },
]

const sortingOptions: DropdownOption[] = [
  {
    label: 'Updated',
    selected: true,
    type: 'item' as const,
    value: 'updated',
  },
  {
    label: 'Created',
    type: 'item' as const,
    value: 'created',
  },
  {
    label: 'Name',
    type: 'item' as const,
    value: 'name',
  },
]
</script>

<style lang="scss">
.dropdown-menu-example {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space);
}
</style>
