<template>
  <Collapsible
    v-model="isOpen"
    label="Advanced filters"
    :icon="Icons.FILE_COLUMNS"
    toggle-icon="plus"
  >
    <p :class="bemm('content')">
      Refine results by owner, status, date range, or any app-specific field.
    </p>
  </Collapsible>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useBemm } from 'bemm'

import { Icons } from '@/types'

import { Collapsible } from './index'

const bemm = useBemm('collapsible-example')
const isOpen = ref(false)
</script>

<style lang="scss">
.collapsible-example {
  &__content {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 18%);
    line-height: 1.6;
  }
}
</style>
