<template>
  <Tabs value="overview">
    <TabPane id="overview" title="Overview">
      Overview content for the shared UI library.
    </TabPane>
    <TabPane id="usage" title="Usage">
      Usage notes and migration guidance.
    </TabPane>
  </Tabs>
</template>

<script setup lang="ts">
import TabPane from './TabPane.vue'
import Tabs from './Tabs.vue'
</script>
