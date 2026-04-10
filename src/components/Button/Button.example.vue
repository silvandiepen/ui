<template>
  <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
    <Button>Primary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost" icon="sun">Ghost</Button>
  </div>
</template>

<script lang="ts" setup>
import { Button } from './index'
</script>
