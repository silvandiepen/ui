<template>
  <Example
    :component="Input"
    name="Input"
    :prop-options="{
      type: ['text', 'password', 'email', 'number', 'search', 'url', 'tel'],
    }"
  />
</template>

<script lang="ts" setup>
import { Input } from './index'
</script>
