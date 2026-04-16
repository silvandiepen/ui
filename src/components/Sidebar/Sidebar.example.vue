<template>
  <Example>
<Sidebar subtitle="Shared component docs" title="Navigation" width="20rem">
    <SidebarNavigation :sections="sections" />
  </Sidebar>
  </Example>
</template>

<script setup lang="ts">
import { Status } from '../../types'
import { SidebarNavigation } from '../SidebarNavigation'

import Sidebar from './Sidebar.vue'

import type { SidebarNavigationSection } from '../SidebarNavigation'

const sections: SidebarNavigationSection[] = [
  {
    id: 'foundations',
    items: [
      {
        badge: 'stable',
        badgeTone: Status.SUCCESS,
        description: 'Shared action primitive.',
        id: 'button',
        label: 'Button',
        to: '/',
      },
      {
        badge: 'stable',
        badgeTone: Status.SUCCESS,
        description: 'Surface container for content.',
        id: 'card',
        label: 'Card',
        to: '/',
      },
    ],
    label: 'Foundations',
  },
  {
    id: 'feedback',
    items: [
      {
        badge: 'stable',
        badgeTone: Status.SUCCESS,
        description: 'Inline feedback surface.',
        id: 'notification',
        label: 'Notification',
        to: '/',
      },
    ],
    label: 'Feedback',
  },
]
</script>
