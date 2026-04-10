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
]
</script>
