<template>
  <Example
    :component="PlatformFooter"
    name="PlatformFooter"
    :prop-options="{
      variant: ['default', 'float'],
      colorMode: ['auto', 'inverse', 'dark', 'light'],
    }"
  >
    <template #default="{ bindings }">
      <PlatformFooter v-bind="bindings">
        <template #brand>
          <strong>Workspace</strong>
        </template>

        <template #nav>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <Button variant="ghost">Docs</Button>
            <Button variant="ghost">Status</Button>
            <Button variant="ghost">Contact</Button>
          </div>
        </template>
      </PlatformFooter>
    </template>
  </Example>
</template>

<script lang="ts" setup>
import { Button } from "../Button";
import { PlatformFooter } from "./index";
</script>
