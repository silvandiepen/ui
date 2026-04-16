<template>
  <Example>
<Field hint="Shown below the control" label="Project Name" required>
    <Input model-value="Apollo" />
  </Field>
  </Example>
</template>

<script lang="ts" setup>
import { Input } from '../Input'
import { Field } from './index'
</script>
