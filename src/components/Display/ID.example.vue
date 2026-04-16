<template>
  <div :class="bemm()">
      <ID id="job_4e8b1b9b" pre="Job" @copied="copiedValue = $event" />
      <p :class="bemm('status')">
        {{ copiedValue ? `Copied: ${copiedValue}` : 'Click the copy icon to copy the ID.' }}
      </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'

import ID from './ID.vue'

const bemm = useBemm('display-id-example')
const copiedValue = ref('')
</script>

<style lang="scss">
.display-id-example {
  display: grid;
  gap: var(--space-xs);
  justify-items: start;

  &__status {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 35%);
    font-size: var(--font-size-s);
  }
}
</style>
