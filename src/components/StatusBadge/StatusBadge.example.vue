<template>
  <Example
    :component="StatusBadge"
    name="StatusBadge"
    :prop-options="{
      tone: ['default', 'success', 'warning', 'error', 'info', 'loading', 'idle'],
    }"
  />
</template>

<script lang="ts" setup>
import { StatusBadge } from './index'
</script>
