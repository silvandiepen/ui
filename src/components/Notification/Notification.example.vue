<template>
  <Example>
<div style="display: grid; gap: 0.75rem;">
    <Notification message="Changes saved successfully." type="success" />
    <Notification dismissible message="API token needs rotation." type="warning" />
  </div>
  </Example>
</template>

<script lang="ts" setup>
import { Notification } from './index'
</script>
