<template>
  <div :class="bemm()">
    <DL label="Owner" value="Shared UI team" />
    <DL label="Channels" :value="['Docs app', 'Dashboard', 'Marketing']" />
    <DL label="State" value="Published" />
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import DL from './DL.vue'

const { bemm } = useBemm('display-dl-example')
</script>

<style lang="scss">
.display-dl-example {
  display: grid;
  gap: var(--space);
}
</style>
