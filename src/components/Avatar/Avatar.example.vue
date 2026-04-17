<template>
  <Example
    :component="Avatar"
    name="Avatar"
    :prop-options="{
      size: ['small', 'medium', 'large'],
    }"
  />
</template>

<script lang="ts" setup>
import { Avatar } from './index'
</script>
