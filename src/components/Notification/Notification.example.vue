<template>
  <Example
    :component="Notification"
    name="Notification"
    :prop-options="{
      type: ['info', 'success', 'warning', 'error'],
    }"
  />
</template>

<script lang="ts" setup>
import { Notification } from './index'
</script>
