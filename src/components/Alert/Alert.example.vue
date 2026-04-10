<template>
  <div :class="bemm()">
    <Alert title="Information" description="Shared tokens are now synced across applications." />
    <Alert :variant="AlertVariant.SUCCESS" title="Published" description="The package release completed successfully." />
    <Alert :variant="AlertVariant.WARNING" title="Migration pending">
      One legacy form surface still needs cleanup before the next release.
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Alert from './Alert.vue'
import { AlertVariant } from './Alert.model'

const bemm = useBemm('alert-example')
</script>

<style lang="scss">
.alert-example {
  display: grid;
  gap: var(--space);
}
</style>
