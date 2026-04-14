<template>
  <div :class="bemm()">
    <StatusBadge label="Stable" :tone="Status.SUCCESS" />
    <StatusBadge label="Queued" :tone="Status.INFO" />
    <StatusBadge label="Needs Review" :tone="Status.WARNING" />
    <StatusBadge label="Failed" :tone="Status.ERROR" />
    <StatusBadge label="Draft" :tone="Status.DEFAULT" />
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
import { Status } from '../../types'

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
