<template>
  <PlatformHeader>
      <template #brand>
        <strong>Workspace</strong>

      <template #nav>
        <div style="display: flex; gap: 0.75rem;">
          <Button variant="ghost">Overview</Button>
          <Button variant="ghost">Billing</Button>
        </div>
</template>

<script lang="ts" setup>
import { Button } from '../Button'
import { ThemeToggle } from '../ThemeToggle'
import { PlatformHeader } from './index'
</script>
