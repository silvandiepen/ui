<template>
  <div :class="bemm()">
    <Input v-model="name" label="Project name" placeholder="Shared UI docs" />
    <Toggle v-model="enabled" label="Release on merge" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import { Input, Toggle } from './index'

const bemm = useBemm('form-example')

const name = ref('Shared UI docs')
const enabled = ref(true)
</script>

<style lang="scss">
.form-example {
  display: grid;
  gap: var(--space);
  max-width: 24rem;
}
</style>
