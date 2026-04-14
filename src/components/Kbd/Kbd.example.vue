<template>
  <div :class="bemm()">
    <span :class="bemm('group')">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </span>
    <span :class="bemm('label')">Open docs search</span>
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'

import { Kbd } from './index'

const bemm = useBemm('kbd-example')
</script>

<style lang="scss">
.kbd-example {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;

  &__group {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  &__label {
    color: color-mix(in srgb, var(--color-foreground), transparent 24%);
    font-size: var(--font-size-s);
  }
}
</style>
