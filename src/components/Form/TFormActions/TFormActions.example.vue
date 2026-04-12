<template>
  <TFormActions :class="bemm()" align="space-between">
    <Button variant="ghost">Cancel</Button>
    <Button>Save changes</Button>
  </TFormActions>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Button from '../../Button/Button.vue'
import TFormActions from './TFormActions.vue'

const bemm = useBemm('t-form-actions-example')
</script>

<style lang="scss">
.t-form-actions-example {
  width: 100%;
}
</style>
