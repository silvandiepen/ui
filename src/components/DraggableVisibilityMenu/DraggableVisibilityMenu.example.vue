<template>
  <Example>
<div :class="bemm()">
    <DraggableVisibilityMenu :items="items" @update:items="items = $event" />
  </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import DraggableVisibilityMenu from './DraggableVisibilityMenu.vue'
import type { DraggableVisibilityMenuItem } from './DraggableVisibilityMenu.model'

const bemm = useBemm('draggable-visibility-menu-example')

const items = ref<DraggableVisibilityMenuItem[]>([
  {
    key: 'name',
    label: 'Name',
    visible: true,
  },
  {
    key: 'owner',
    label: 'Owner',
    visible: true,
  },
  {
    key: 'archived',
    label: 'Archived',
    visible: false,
  },
])
</script>

<style lang="scss">
.draggable-visibility-menu-example {
  max-width: 20rem;
}
</style>
