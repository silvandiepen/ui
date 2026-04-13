<template>
  <Sidebar title="Navigation" subtitle="Shared component sections">
    <SidebarNavigation :sections="sections" />
  </Sidebar>
</template>

<script lang="ts" setup>
import { Sidebar } from '../Sidebar'
import { SidebarNavigation, type SidebarNavigationSection } from './index'

const sections: SidebarNavigationSection[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    items: [
      {
        id: 'button',
        label: 'Button',
        description: 'Primary action primitive',
        badge: 'stable',
        badgeTone: 'success',
        href: '#button',
      },
      {
        id: 'card',
        label: 'Card',
        description: 'Surface container',
        badge: 'stable',
        badgeTone: 'success',
        href: '#card',
      },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    description: 'Expandable section groups can be collapsed by default.',
    defaultCollapsed: true,
    items: [
      {
        id: 'toast',
        label: 'Toast',
        description: 'Transient status messages',
        badge: 'stable',
        badgeTone: 'success',
        href: '#toast',
      },
      {
        id: 'tooltip',
        label: 'Tooltip',
        description: 'Contextual help surface',
        badge: 'stable',
        badgeTone: 'success',
        href: '#tooltip',
      },
    ],
  },
]
</script>
