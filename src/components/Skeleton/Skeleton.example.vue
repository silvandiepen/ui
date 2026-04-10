<template>
  <div :class="bemm()">
    <Skeleton :height="48" shape="circle" width="48" />
    <Skeleton :height="18" width="14rem" />
    <Skeleton :height="14" shape="pill" width="9rem" />
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Skeleton from './Skeleton.vue'

const bemm = useBemm('skeleton-example')
</script>

<style lang="scss">
.skeleton-example {
  display: grid;
  gap: var(--space-s);
  justify-items: start;
}
</style>
