<template>
  <div :class="bemm()">
    <TToggle v-model="notificationsEnabled" label="Enable notifications" />
    <TToggle v-model="autoPublishEnabled" label="Auto publish" size="large" />
  </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { ref } from 'vue'

import TToggle from './TToggle.vue'

const bemm = useBemm('t-toggle-example')

const notificationsEnabled = ref(true)
const autoPublishEnabled = ref(false)
</script>

<style lang="scss">
.t-toggle-example {
  display: grid;
  gap: var(--space);
}
</style>
