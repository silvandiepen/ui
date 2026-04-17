<template>
  <Example
    :component="Icon"
    name="Icon"
    :prop-options="{
      name: ['search', 'settings', 'check', 'close', 'home', 'edit', 'trash', 'info', 'sun', 'moon', 'bell', 'star', 'arrow-right', 'arrow-left'],
      size: ['small', 'medium', 'large', 'xl'],
    }"
  />
</template>

<script setup lang="ts">
import Icon from './Icon.vue'
</script>
