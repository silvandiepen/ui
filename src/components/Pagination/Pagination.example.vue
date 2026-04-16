<template>
  <Example>
<div :class="bemm()">
    <section :class="bemm('section')">
      <p :class="bemm('label')">Full pagination</p>
      <Pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 25, 50]"
        :total="126"
        @update:current-page="currentPage = $event"
        @update:page-size="pageSize = $event"
      />
    </section>

    <section :class="bemm('section')">
      <p :class="bemm('label')">Compact pager only</p>
      <Pagination
        :current-page="compactPage"
        :page-size="20"
        :total="220"
        layout="prev, pager, next"
        :sibling-count="0"
        @update:current-page="compactPage = $event"
      />
    </section>
  </div>
  </Example>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import Pagination from './Pagination.vue'

const bemm = useBemm('pagination-example')

const currentPage = ref(3)
const compactPage = ref(6)
const pageSize = ref(10)
</script>

<style lang="scss">
.pagination-example {
  display: grid;
  gap: var(--space);

  &__section {
    display: grid;
    gap: var(--space-xs);
  }

  &__label {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 35%);
    font-size: var(--font-size-s);
  }
}
</style>
