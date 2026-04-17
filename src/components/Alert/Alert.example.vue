<template>
  <Example
    :component="Alert"
    name="Alert"
    :prop-options="{
      variant: ['info', 'success', 'warning', 'error', 'default'],
      icon: ['', 'info', 'check-circle', 'alert', 'error', 'bell'],
    }"
  />
</template>

<script setup lang="ts">
import Alert from './Alert.vue'
</script>
