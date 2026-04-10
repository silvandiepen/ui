<template>
  <Pagination
    :current-page="currentPage"
    :page-size="pageSize"
    :total="126"
    @update:current-page="currentPage = $event"
    @update:page-size="pageSize = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Pagination from './Pagination.vue'

const currentPage = ref(3)
const pageSize = ref(10)
</script>
