<template>
  <div :class="bemm()">
      <div :class="bemm('profile')">
        <Skeleton :height="48" shape="circle" width="48" />
        <div :class="bemm('copy')">
          <Skeleton :height="18" width="14rem" />
          <Skeleton :height="14" shape="pill" width="9rem" />
        </div>
      </div>

      <div :class="bemm('card')">
        <Skeleton height="9rem" width="100%" />
        <Skeleton :height="18" width="60%" />
        <Skeleton :height="14" width="100%" />
        <Skeleton :height="14" width="82%" />
      </div>
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
  gap: var(--space);
  justify-items: start;

  &__profile {
    display: flex;
    align-items: center;
    gap: var(--space);
  }

  &__copy,
  &__card {
    display: grid;
    gap: var(--space-s);
  }

  &__card {
    width: min(100%, 22rem);
  }
}
</style>
