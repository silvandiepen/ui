<template>
  <Example
    :component="InputSearch"
    name="InputSearch"
    :prop-options="{
      leftIcon: [true, false],
      iconOnly: [false, true],
      searchOnEnter: [true, false],
      collapseOnBlur: [true, false],
    }"
  />
</template>

<script setup lang="ts">
import InputSearch from './InputSearch.vue'
</script>
