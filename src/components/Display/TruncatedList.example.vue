<template>
<div :class="bemm()">
    <TruncatedList :items="items" :max-visible="3" />

    <TruncatedList :items="items" :max-visible="2">
      <template #item="{ item }">
        <span :class="bemm('tag')">{{ item }}</span>
      </template>
    </TruncatedList>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import TruncatedList from './TruncatedList.vue'

const { bemm } = useBemm('display-truncated-list-example')

const items = [
  'Foundations',
  'Forms',
  'Feedback',
  'Data and Navigation',
  'Examples',
]
</script>

<style lang="scss">
.display-truncated-list-example {
  display: grid;
  gap: var(--space);
  justify-items: start;

  &__tag {
    display: inline-flex;
    padding: var(--space-xs) var(--space-s);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-secondary), transparent 85%);
    color: var(--color-secondary);
    font-size: var(--font-size-s);
  }
}
</style>
