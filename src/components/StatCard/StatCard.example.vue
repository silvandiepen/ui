<template>
  <Example
    :component="StatCard"
    name="StatCard"
    :prop-options="{
      color: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      icon: ['', 'grid', 'settings', 'check', 'chart', 'users', 'bell', 'star'],
    }"
  />
</template>

<script lang="ts" setup>
import { StatCard } from './index'
</script>
