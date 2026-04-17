<template>
  <Example
    :component="Collapsible"
    name="Collapsible"
    slot-content="Collapsible body content goes here."
    :prop-options="{
      icon: ['', 'settings', 'info', 'check', 'file-columns', 'tune'],
      toggleIcon: ['chevron', 'plus', 'arrow'],
    }"
  />
</template>

<script lang="ts" setup>
import { Collapsible } from './index'
</script>
