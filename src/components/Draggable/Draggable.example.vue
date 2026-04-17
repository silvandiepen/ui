<template>
  <div :class="bemm()">
    <Draggable v-model="items" item-key="id">
      <template #item="{ item }">
        <span :class="bemm('label')">{{ (item as Item).label }}</span>
      </template>
    </Draggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'
import { Draggable } from './index'

interface Item { id: string; label: string }

const bemm = useBemm('draggable-example')

const items = ref<Item[]>([
  { id: 'a', label: 'First item' },
  { id: 'b', label: 'Second item' },
  { id: 'c', label: 'Third item' },
  { id: 'd', label: 'Fourth item' },
])
</script>

<style lang="scss">
.draggable-example {
  max-width: 20rem;

  .draggable__item {
    padding: var(--space-xs) var(--space-s);
    border-radius: var(--border-radius-s);
    background: color-mix(in srgb, var(--color-foreground), transparent 96%);

    &:not(:last-child) { margin-bottom: var(--space-xs); }
  }

  &__label {
    font-size: var(--font-size-s);
  }
}
</style>
