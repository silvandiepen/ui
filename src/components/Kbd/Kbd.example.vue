<template>
  <Example
    :component="Kbd"
    name="Kbd"
    slot-content="K"
    :prop-options="{
      size: ['small', 'medium'],
      variant: ['default', 'subtle'],
    }"
  />
</template>

<script lang="ts" setup>
import { Kbd } from './index'
</script>
