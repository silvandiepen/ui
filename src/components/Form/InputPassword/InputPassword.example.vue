<template>
  <Example
    :component="InputPassword"
    name="InputPassword"
    :prop-options="{
      required: [false, true],
      validateStrength: [false, true],
    }"
  />
</template>

<script setup lang="ts">
import InputPassword from './InputPassword.vue'
</script>
