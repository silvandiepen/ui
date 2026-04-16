<template>
  <PlatformFooter>
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

<script lang="ts" setup>
import { Button } from "../Button";
import { ThemeToggle } from "../ThemeToggle";
import { PlatformFooter } from "./index";
</script>
