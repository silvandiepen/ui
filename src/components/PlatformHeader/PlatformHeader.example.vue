<template>
  <Example
    :component="PlatformHeader"
    name="PlatformHeader"
    :prop-options="{
      variant: ['default', 'float'],
      colorMode: ['auto', 'inverse', 'dark', 'light'],
    }"
  >
    <template #default="{ bindings }">
      <PlatformHeader v-bind="bindings">
        <template #brand>
          <strong>Workspace</strong>
        </template>

        <template #nav>
          <div style="display: flex; gap: 0.75rem;">
            <Button variant="ghost">Overview</Button>
            <Button variant="ghost">Billing</Button>
          </div>
        </template>

        <template #actions>
          <Button size="small">Sign in</Button>
        </template>
      </PlatformHeader>
    </template>
  </Example>
</template>

<script lang="ts" setup>
import { Button } from '../Button'
import { PlatformHeader } from './index'
</script>
