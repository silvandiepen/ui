<template>
  <Example>
<PlatformFooter>
    <template #brand>
      <strong>Workspace</strong>
  </Example>
</template>

    <template #nav>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <Button variant="ghost">Docs</Button>
        <Button variant="ghost">Status</Button>
        <Button variant="ghost">Contact</Button>
      </div>
    </template>

    <template #meta>
      <span>v1.0</span>
      <ThemeToggle theme="dark" />
    </template>

    <template #secondary>
      <span>Built for shared app-shell layouts, legal copy, and compact footer navigation.</span>
    </template>
  </PlatformFooter>
</template>

<script lang="ts" setup>
import { Button } from "../Button";
import { ThemeToggle } from "../ThemeToggle";
import { PlatformFooter } from "./index";
</script>
