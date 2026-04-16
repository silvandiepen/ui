<template>
  <div :class="bemm()">
      <DataList
        :auto-width="false"
        :columns="columns"
        :data="rows"
        :row-clickable="false"
      />
    </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import DataList from './DataList.vue'
import type { DataListColumn } from './DataList.model'

const bemm = useBemm('data-list-example')

const columns: DataListColumn[] = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'team',
    label: 'Team',
  },
  {
    key: 'status',
    label: 'Status',
  },
]

const rows = [
  {
    id: 'row-1',
    name: 'Design system',
    team: 'Platform',
    status: 'Synced',
  },
  {
    id: 'row-2',
    name: 'Docs app',
    team: 'Frontend',
    status: 'Review',
  },
]
</script>

<style lang="scss">
.data-list-example {
  max-width: 42rem;
}
</style>
