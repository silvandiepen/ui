<template>
  <Example
    :component="Badge"
    name="Badge"
    slot-content="Badge"
    :prop-options="{
      variant: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'outline'],
      size: ['small', 'medium', 'large'],
      color: [null, 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
    }"
  />
</template>

<script setup lang="ts">
import Badge from './Badge.vue'
</script>
