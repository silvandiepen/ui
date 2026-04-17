<template>
  <Example
    :component="ThemeToggle"
    name="ThemeToggle"
    :prop-options="{
      theme: ['light', 'dark', 'system'],
    }"
  />
</template>

<script lang="ts" setup>
import { ThemeToggle } from './index'
</script>
