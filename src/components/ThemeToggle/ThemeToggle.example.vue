<template>
  <div style="display: flex; gap: 0.75rem;">
    <ThemeToggle theme="light" />
    <ThemeToggle theme="dark" />
    <ThemeToggle theme="system" />
  </div>
</template>

<script lang="ts" setup>
import { ThemeToggle } from './index'
</script>
