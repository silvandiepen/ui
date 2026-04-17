<template>
  <Example
    :component="EmptyState"
    name="EmptyState"
    :prop-options="{
      icon: ['', 'box', 'folder', 'search', 'database', 'info'],
    }"
  />
</template>

<script setup lang="ts">
import EmptyState from './EmptyState.vue'
</script>
