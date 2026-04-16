<template>
  <Example>
<ChipGroup :class="bemm()">
    <Chip color="primary">Docs</Chip>
    <Chip color="secondary">Review</Chip>
    <Chip color="success">Ready</Chip>
  </ChipGroup>
  </Example>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Chip from './Chip.vue'
import ChipGroup from './ChipGroup.vue'

const bemm = useBemm('display-chip-group-example')
</script>

<style lang="scss">
.display-chip-group-example {
  max-width: 22rem;
}
</style>
