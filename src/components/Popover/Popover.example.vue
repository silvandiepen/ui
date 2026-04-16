<template>
  <Example>
    <Popover title="Quick actions">
      <template #trigger>
        <Button variant="outline">Open popover</Button>
      </template>

      <Button variant="ghost">Rename</Button>
      <Button variant="ghost">Duplicate</Button>
    </Popover>
  </Example>
</template>

<script lang="ts" setup>
import { Button } from '../Button'
import { Popover } from './index'
</script>
