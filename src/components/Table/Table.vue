<template>
  <div class="table-wrapper">
    <table class="table">
      <thead v-if="$slots.header">
        <slot name="header" />
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// Simple table stub
</script>

<style lang="scss">
.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: var(--space-s) var(--space-m);
    text-align: left;
    border-bottom: 1px solid var(--color-border);
  }
  
  th {
    font-weight: var(--font-weight-semibold);
    background: var(--color-background-secondary);
  }
  
  tr:hover {
    background: var(--color-background-hover);
  }
}
</style>