<template>
  <Example
    :component="InputRange"
    name="InputRange"
    :prop-options="{
      size: ['small', 'medium', 'large'],
      valuePosition: ['left', 'right'],
    }"
  />
</template>

<script setup lang="ts">
import InputRange from './InputRange.vue'
</script>
