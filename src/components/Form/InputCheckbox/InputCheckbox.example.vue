<template>
  <Example
    :component="InputCheckbox"
    name="InputCheckbox"
    :prop-options="{
      color: ['primary', 'secondary', 'success', 'warning', 'error'],
      indicator: ['dot', 'check', 'x'],
      size: ['small', 'medium', 'large'],
    }"
  />
</template>

<script setup lang="ts">
import InputCheckbox from './InputCheckbox.vue'
</script>
