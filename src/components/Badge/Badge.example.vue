<template>
  <div :class="bemm()">
    <Badge>Default</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="outline" color="warning">Warning</Badge>
    <Badge size="small" color="secondary">Small</Badge>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Badge from './Badge.vue'

const bemm = useBemm('badge-example')
</script>

<style lang="scss">
.badge-example {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-s);
}
</style>
