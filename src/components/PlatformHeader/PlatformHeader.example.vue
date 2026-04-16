<template>
  <Example>
<PlatformHeader>
    <template #brand>
      <strong>Workspace</strong>
  </Example>
</template>

    <template #nav>
      <div style="display: flex; gap: 0.75rem;">
        <Button variant="ghost">Overview</Button>
        <Button variant="ghost">Billing</Button>
      </div>
    </template>

    <template #actions>
      <Button variant="outline">Invite</Button>
      <ThemeToggle theme="dark" />
    </template>
  </PlatformHeader>
</template>

<script lang="ts" setup>
import { Button } from '../Button'
import { ThemeToggle } from '../ThemeToggle'
import { PlatformHeader } from './index'
</script>
