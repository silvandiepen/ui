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
  display: inline-flex;
  align-items: center;
  gap: m.p('gap', var(--space-s));
  padding: m.p('padding-y', var(--space-xs)) m.p('padding-x', calc(var(--space) * 0.75));
  border-radius: var(--border-radius, 4px);
  background-color: var(--color-gray-light, color-mix(in srgb, var(--color-foreground), transparent 92%));
  font-size: m.p('font-size', var(--font-size-s));

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
    width: m.p('dot-size', var(--space));
    height: m.p('dot-size', var(--space));
    border-radius: 50%;
    background-color: var(--dot-color, color-mix(in srgb, var(--color-foreground), transparent 72%));
  }
}
</style>
