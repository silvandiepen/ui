<template>
  <div :class="bemm()">
    <span v-if="$slots['pre-content']" :class="bemm('pre')">
      <slot name="pre-content" />
    </span>
    <span :class="bemm('content')">
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm';

const bemm = useBemm('chip');

// Simple chip component stub
// This is a minimal implementation to satisfy the import in InputSelectColor
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.chip {
  @include m.component-props((
    'gap': '0.5rem',
    'padding-y': '0.25rem',
    'padding-x': '0.75rem',
    'font-size': '0.875rem',
    'dot-size': '1rem',
  ), 'chip');

  display: inline-flex;
  align-items: center;
  gap: var(--int-chip-gap);
  padding: var(--int-chip-padding-y) var(--int-chip-padding-x);
  border-radius: var(--border-radius, 4px);
  background-color: var(--color-gray-light, color-mix(in srgb, var(--color-foreground), transparent 92%));
  font-size: var(--int-chip-font-size);

  &__pre {
    display: flex;
    align-items: center;
  }

  &__content {
    display: flex;
    align-items: center;
  }

  // Support for the dot element in InputSelectColor
  .dot {
    width: var(--int-chip-dot-size);
    height: var(--int-chip-dot-size);
    border-radius: 50%;
    background-color: var(--dot-color, color-mix(in srgb, var(--color-foreground), transparent 72%));
  }
}
</style>
