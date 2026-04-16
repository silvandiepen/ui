<template>
  <Example>
<Spacer direction="row" align="center" :class="bemm()">
    <Button size="small">Back</Button>
    <Button size="small" variant="secondary">Share</Button>
    <Button size="small" variant="outline">Archive</Button>
  </Spacer>
  </Example>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { Button } from '../Button'
import { Spacer } from './index'

const bemm = useBemm('spacer-example')
</script>

<style lang="scss">
.spacer-example {
  --spacer-gap: var(--space-s);
}
</style>
