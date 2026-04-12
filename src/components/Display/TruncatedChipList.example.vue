<template>
  <div :class="bemm()">
    <TruncatedChipList :items="items" :max-visible="3" />
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import TruncatedChipList from './TruncatedChipList.vue'

const bemm = useBemm('display-truncated-chip-list-example')

const items = [
  'Foundations',
  'Forms',
  'Feedback',
  'Data and Navigation',
  'Examples',
]
</script>

<style lang="scss">
.display-truncated-chip-list-example {
  display: grid;
  justify-items: start;
}
</style>
