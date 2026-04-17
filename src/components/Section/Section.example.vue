<template>
  <Example
    :component="Section"
    name="Section"
    slot-content="Section content"
    :prop-options="{
      variant: ['default', 'alternate', 'hero', 'cta'],
    }"
  />
</template>

<script setup lang="ts">
import Section from './Section.vue'
</script>
