<template>
  <SidebarNavigation :sections="sections" />
</template>

<script lang="ts" setup>
import { Status } from '../../types'
import { SidebarNavigation, type SidebarNavigationSection } from './index'

const sections: SidebarNavigationSection[] = [
  {
    id: 'foundations',
    icon: 'layers',
    label: 'Foundations',
    items: [
      {
        id: 'button',
        icon: 'mouse-pointer',
        label: 'Button',
        description: 'Primary action primitive',
        badge: 'stable',
        badgeTone: Status.SUCCESS,
        href: '#button',
      },
      {
        id: 'card',
        icon: 'square',
        label: 'Card',
        description: 'Surface container',
        badge: 'stable',
        badgeTone: Status.SUCCESS,
        href: '#card',
      },
      {
        id: 'badge',
        icon: 'tag',
        label: 'Badge',
        description: 'Status indicator',
        href: '#badge',
      },
    ],
  },
  {
    id: 'feedback',
    icon: 'message-circle',
    label: 'Feedback',
    description: 'Expandable section groups can be collapsed by default.',
    defaultCollapsed: true,
    items: [
      {
        id: 'toast',
        icon: 'bell',
        label: 'Toast',
        description: 'Transient status messages',
        badge: 'stable',
        badgeTone: Status.SUCCESS,
        href: '#toast',
      },
      {
        id: 'tooltip',
        icon: 'help-circle',
        label: 'Tooltip',
        description: 'Contextual help surface',
        badge: 'stable',
        badgeTone: Status.SUCCESS,
        href: '#tooltip',
      },
    ],
  },
  {
    id: 'navigation',
    icon: 'compass',
    label: 'Navigation',
    collapsible: false,
    items: [
      {
        id: 'tabs',
        label: 'Tabs',
        href: '#tabs',
      },
      {
        id: 'breadcrumb',
        label: 'Breadcrumb',
        disabled: true,
        href: '#breadcrumb',
      },
    ],
  },
]
</script>
