<template>
  <FormActions :class="bemm()" align="space-between">
    <Button variant="ghost">Cancel</Button>
    <Button>Save changes</Button>
  </FormActions>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Button from '../../Button/Button.vue'
import FormActions from './FormActions.vue'

const bemm = useBemm('t-form-actions-example')
</script>

<style lang="scss">
.t-form-actions-example {
  width: 100%;
}
</style>
