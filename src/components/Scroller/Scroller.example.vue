<template>
  <Scroller horizontal :class="bemm()">
    <div
      v-for="card in cards"
      :key="card"
      :class="bemm('card')"
    >
      {{ card }}
    </div>
  </Scroller>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Scroller from './Scroller.vue'

const bemm = useBemm('scroller-example')

const cards = [
  'Foundations',
  'Forms',
  'Feedback',
  'Data',
  'Legacy',
]
</script>

<style lang="scss">
.scroller-example {
  max-width: 28rem;

  &__card {
    min-width: 10rem;
    padding: var(--space);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-primary), transparent 90%);
    color: var(--color-primary);
    font-weight: var(--font-weight-medium);
  }
}
</style>
