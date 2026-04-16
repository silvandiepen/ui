<template>
  <Example>
<div :class="bemm()">
    <section :class="bemm('section')">
      <p :class="bemm('label')">Horizontal card rail</p>
      <Scroller horizontal :class="bemm('horizontal')">
        <div
          v-for="card in cards"
          :key="card"
          :class="bemm('card')"
        >
          {{ card }}
        </div>
      </Scroller>
    </section>

    <section :class="bemm('section')">
      <p :class="bemm('label')">Vertical log with fixed height</p>
      <Scroller vertical height="12rem" :class="bemm('vertical')">
        <div
          v-for="item in events"
          :key="item"
          :class="bemm('event')"
        >
          {{ item }}
        </div>
      </Scroller>
    </section>
  </div>
  </Example>
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

const events = [
  'Docs build completed',
  'Theme tokens updated',
  'Examples regenerated',
  'Typecheck passed',
  'Release notes drafted',
]
</script>

<style lang="scss">
.scroller-example {
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

  &__horizontal {
    max-width: 28rem;
  }

  &__vertical {
    max-width: 28rem;
  }

  &__card {
    min-width: 10rem;
    padding: var(--space);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-primary), transparent 90%);
    color: var(--color-primary);
    font-weight: var(--font-weight-medium);
  }

  &__event {
    padding: var(--space-s) var(--space);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-foreground), transparent 94%);
  }
}
</style>
