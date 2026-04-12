<template>
  <div :class="bemm()">
    <Chip icon="folder">Workspace</Chip>
    <Chip color="success" tooltip="Release approved">Published</Chip>
    <Chip removable @remove="removed = true">
      {{ removed ? 'Removed' : 'Needs review' }}
    </Chip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import Chip from './Chip.vue'

const bemm = useBemm('display-chip-example')
const removed = ref(false)
</script>

<style lang="scss">
.display-chip-example {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}
</style>
