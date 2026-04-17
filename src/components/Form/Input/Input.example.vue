<template>
  <Example
    :component="Input"
    name="Input"
    :prop-options="{
      type: ['text', 'password', 'email', 'number', 'search', 'url', 'tel'],
      prefixIcon: ['', 'search', 'user', 'mail', 'lock', 'coins'],
      suffixIcon: ['', 'search', 'check', 'close', 'calendar'],
    }"
  />
</template>

<script setup lang="ts">
import Input from './Input.vue'
</script>
