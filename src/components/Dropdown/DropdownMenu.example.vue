<template>
  <DropdownMenu :options="options">
    <template #trigger="{ toggle }">
      <Button variant="outline" @click="toggle">Open menu</Button>
    </template>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Button } from '../Button'

import DropdownMenu from './DropdownMenu.vue'
import type { DropdownOption } from './Dropdown.model'

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
</script>
