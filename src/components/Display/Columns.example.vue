<template>
  <Columns :class="bemm()" :columns="3">
      <div
        v-for="item in items"
        :key="item.title"
        :class="bemm('card')"
      >
        <strong>{{ item.title }}</strong>
        <span>{{ item.value }}</span>
      </div>
    </Columns>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Columns from './Columns.vue'

const bemm = useBemm('display-columns-example')

const items = [
  { title: 'Owner', value: 'Docs team' },
  { title: 'Status', value: 'Ready' },
  { title: 'Version', value: '0.1.0' },
]
</script>

<style lang="scss">
.display-columns-example {
  max-width: 36rem;

  &__card {
    display: grid;
    gap: var(--space-xs);
    padding: var(--space);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-foreground), transparent 95%);
  }
}
</style>
