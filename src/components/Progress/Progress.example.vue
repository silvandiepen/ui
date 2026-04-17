<template>
  <Example
    :component="Progress"
    name="Progress"
    :prop-options="{
      variant: ['primary', 'success', 'warning', 'error', 'info'],
      type: ['linear', 'circular'],
      size: ['small', 'medium', 'large'],
    }"
  />
</template>

<script lang="ts" setup>
import { Progress } from './index'
</script>
