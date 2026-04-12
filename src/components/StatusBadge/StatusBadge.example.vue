<template>
  <div :class="bemm()">
    <StatusBadge label="Stable" tone="success" />
    <StatusBadge label="Queued" tone="accent" />
    <StatusBadge label="Needs Review" tone="warning" />
    <StatusBadge label="Failed" tone="danger" />
    <StatusBadge label="Draft" tone="neutral" />
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'

import { StatusBadge } from './index'

const bemm = useBemm('status-badge-example')
</script>

<style lang="scss">
.status-badge-example {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>
