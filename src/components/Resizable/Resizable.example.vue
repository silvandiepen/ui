<template>
  <Resizable
    :class="bemm()"
    :default-size="240"
    :min-size="180"
    :min-secondary-size="220"
    handle-label="Resize example panels"
  >
    <template #start>
      <div :class="bemm('panel')">
        Navigation
      </div>
    </template>

    <template #end>
      <div :class="[bemm('panel'), bemm('panel', 'secondary')]">
        Preview surface
      </div>
    </template>
  </Resizable>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'

import { Resizable } from './index'

const bemm = useBemm('resizable-example')
</script>

<style lang="scss">
.resizable-example {
  min-height: 16rem;
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
  border-radius: calc(var(--border-radius, 1rem) * 0.9);
  overflow: clip;

  &__panel {
    height: 100%;
    padding: 1rem;
    background: color-mix(in srgb, var(--color-background), var(--color-primary) 2%);
  }

  &__panel--secondary {
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 1%);
  }
}
</style>
