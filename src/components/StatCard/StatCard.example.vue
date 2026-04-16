<template>
<div class="stat-card-example">
    <StatCard
      :value="23"
      label="cataloged surfaces"
      description="in this category"
      color="primary"
      icon="grid"
      :count-up="true"
    />

    <StatCard
      :value="1284"
      label="active subscribers"
      description="across four workspace teams"
      color="success"
      icon="settings"
      locale="en-US"
    />

    <StatCard
      value="99.98%"
      label="delivery uptime"
      description="measured over the last 30 days"
      color="info"
      icon="check"
    />
  </div>
</template>

<script lang="ts" setup>
import { StatCard } from './index'
</script>

<style scoped lang="scss">
.stat-card-example {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
  gap: 1.25rem;
}
</style>
