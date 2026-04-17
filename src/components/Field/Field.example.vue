<template>
  <Example
    :component="Field"
    name="Field"
    :prop-options="{
      type: ['text', 'number', 'date', 'boolean', 'select'],
    }"
  />
</template>

<script lang="ts" setup>
import { Field } from './index'
</script>
