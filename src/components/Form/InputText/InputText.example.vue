<template>
  <Example
    :component="InputText"
    name="InputText"
    :prop-options="{
      size: ['small', 'medium', 'large'],
      status: ['default', 'success', 'warning', 'error'],
      type: ['text', 'password', 'email', 'url', 'tel', 'search', 'number'],
    }"
  />
</template>

<script setup lang="ts">
import InputText from './InputText.vue'
</script>
