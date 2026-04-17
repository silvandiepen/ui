<template>
  <Example
    :component="Button"
    name="Button"
    slot-content="Click me"
    :prop-options="{
      variant: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      size: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      icon: ['', 'sun', 'moon', 'settings', 'search', 'check', 'edit', 'trash'],
    }"
    :exclude-props="['to', 'href', 'element', 'type']"
  />
</template>

<script lang="ts" setup>
import { Button } from './index'
</script>
