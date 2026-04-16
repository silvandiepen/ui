<template>
  <Example>
    <Tabs value="overview">
      <TabPane id="overview" title="Overview" icon="home">
        Overview content for the shared UI library.
      </TabPane>
      <TabPane id="usage" title="Usage" icon="book-open">
        Usage notes and implementation guidance.
      </TabPane>
      <TabPane id="settings" title="Settings" icon="settings">
        Settings and configuration options.
      </TabPane>
    </Tabs>
  </Example>
</template>

<script setup lang="ts">
import TabPane from './TabPane.vue'
import Tabs from './Tabs.vue'
</script>
