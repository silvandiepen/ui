<template>
  <Table>
    <template #header>
      <tr>
        <th>Component</th>
        <th>Status</th>
      </tr>
    </template>

    <tr>
      <td>Sidebar</td>
      <td>Stable</td>
    </tr>
    <tr>
      <td>ThemeToggle</td>
      <td>Stable</td>
    </tr>
    <tr>
      <td>TInput</td>
      <td>Transitional</td>
    </tr>
  </Table>
</template>

<script setup lang="ts">
import Table from './Table.vue'
</script>
