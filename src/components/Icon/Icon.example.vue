<template>
  <div :class="bemm()">
    <Icon name="search" />
    <Icon name="settings" size="large" />
    <Icon name="check" size="xl" />
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Icon from './Icon.vue'

const bemm = useBemm('icon-example')
</script>

<style lang="scss">
.icon-example {
  display: flex;
  align-items: center;
  gap: var(--space);
}
</style>
