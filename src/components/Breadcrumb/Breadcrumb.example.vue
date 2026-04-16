<template>
  <div :class="bemm()">
      <Breadcrumb :items="items" />
    </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import Breadcrumb from './Breadcrumb.vue'
import type { BreadcrumbItem } from './Breadcrumb.model'

const bemm = useBemm('breadcrumb-example')

const items: BreadcrumbItem[] = [
  {
    label: 'Projects',
    name: 'projects',
    link: '#projects',
  },
  {
    label: 'UI Package',
    name: 'ui-package',
    action: () => undefined,
  },
  {
    label: 'Docs',
    name: 'docs',
  },
]
</script>

<style lang="scss">
.breadcrumb-example {
  display: flex;
}
</style>
