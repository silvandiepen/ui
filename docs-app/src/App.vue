<template>
  <DocsLayout />
</template>

<script setup lang="ts">
import { provide } from 'vue'

import { popupService } from '@ui-lib/components/Feedback/Popup/Popup.service'

import { useDocsTheme } from '@ui-docs/lib/docsTheme'
import DocsLayout from './layouts/DocsLayout.vue'

useDocsTheme()
provide('popupService', popupService)
</script>
