<template>
  <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
    <StatusBadge label="Stable" tone="success" />
    <StatusBadge label="Transitional" tone="accent" />
    <StatusBadge label="Legacy" tone="danger" />
  </div>
</template>

<script lang="ts" setup>
import { StatusBadge } from './index'
</script>
