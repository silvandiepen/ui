<template>
  <Example>
<Row :class="bemm()">
    <Chip color="primary">Design</Chip>
    <Chip color="secondary">Docs</Chip>
    <Chip color="success">Shipped</Chip>
  </Row>
  </Example>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Chip from './Chip.vue'
import Row from './Row.vue'

const bemm = useBemm('display-row-example')
</script>

<style lang="scss">
.display-row-example {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}
</style>
