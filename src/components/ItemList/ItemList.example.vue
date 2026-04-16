<template>
  <Example>
<div :class="bemm()">
    <ItemList :items="items" />
  </div>
  </Example>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import ItemList from './ItemList.vue'
import type { ItemListItem } from './ItemList.model'

const bemm = useBemm('item-list-example')

const items: ItemListItem[] = [
  {
    description: 'Used across multiple apps',
    label: 'Shared UI package',
    meta: 'stable',
  },
  {
    actions: [
      {
        label: 'Review',
      },
    ],
    description: 'Release workflow and docs app',
    label: 'Release automation',
    meta: 'new',
  },
]
</script>

<style lang="scss">
.item-list-example {
  max-width: 32rem;
}
</style>
