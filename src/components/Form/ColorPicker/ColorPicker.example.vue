<template>
  <Example
    :component="ColorPicker"
    name="ColorPicker"
    :prop-options="{
      allowCustom: [false, true],
      columns: ['auto', 4, 6],
    }"
  />
</template>

<script setup lang="ts">
import ColorPicker from './ColorPicker.vue'
</script>
