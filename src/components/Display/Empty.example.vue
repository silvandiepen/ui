<template>
  <div :class="bemm()">
      <Empty
        message="No connected repositories yet."
        :action="{ label: 'Connect repo', action: connect }"
      />

      <p :class="bemm('status')">{{ status }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import Empty from './Empty.vue'

const bemm = useBemm('display-empty-example')
const status = ref('Waiting for action')

function connect() {
  status.value = 'Repository flow triggered'
}
</script>

<style lang="scss">
.display-empty-example {
  display: grid;
  gap: var(--space);
  justify-items: start;

  &__status {
    margin: 0;
  }
}
</style>
