<template>
  <Example
    :component="InputEmail"
    name="InputEmail"
    :prop-options="{
      size: ['small', 'medium', 'large'],
    }"
  />
</template>

<script setup lang="ts">
import InputEmail from './InputEmail.vue'
</script>
