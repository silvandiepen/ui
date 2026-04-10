<template>
  <EmptyState
    description="Create your first shared component example to populate this area."
    icon="box"
    title="No components yet"
  >
    <template #actions>
      <Button>New component</Button>
      <Button variant="outline">Import existing</Button>
    </template>
  </EmptyState>
</template>

<script setup lang="ts">
import { Button } from '../Button'

import EmptyState from './EmptyState.vue'
</script>
