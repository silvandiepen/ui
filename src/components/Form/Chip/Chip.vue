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
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius, 4px);
  background-color: var(--color-gray-light, #f5f5f5);
  font-size: 0.875rem;
  
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
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: var(--dot-color, #ccc);
  }
}
</style>