<template>
  <div :class="bemm()">
    <Toggle v-model="notificationsEnabled" label="Enable notifications" />

    <Toggle
      v-model="viewMode"
      label="View mode"
      :options="viewOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { ref } from 'vue'

import Toggle from './Toggle.vue'

const bemm = useBemm('toggle-example')

const notificationsEnabled = ref(true)
const viewMode = ref<'list' | 'grid'>('list')
const viewOptions = [
  { label: 'List', value: 'list', icon: 'menu' },
  { label: 'Grid', value: 'grid', icon: 'grid' },
]
</script>

<style lang="scss">
.toggle-example {
  display: grid;
  gap: var(--space);
}
</style>
