<template>
  <Example
    :component="PillHeader"
    name="PillHeader"
    :prop-options="{
      brandSuffix: ['Console', 'Studio', 'Admin'],
      colorMode: ['auto', 'inverse', 'dark', 'light'],
      currentPath: ['/overview', '/projects/releases', '/team/permissions'],
      navItems: [navigationWithSubmenus, navigationWithExternalLink],
      actions: [actions],
    }"
  >
    <template #default="{ bindings }">
      <div :class="bemm('preview')">
        <PillHeader v-bind="bindings">
          <template #brand-mark>
            <span :class="bemm('brand-mark')" aria-hidden="true">S</span>
          </template>
        </PillHeader>
      </div>
    </template>
  </Example>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import { Icons } from 'open-icon'
import PillHeader from './PillHeader.vue'
import type { PillHeaderAction, PillHeaderNavItem } from './PillHeader.model'
import { Color } from '../../types'

const bemm = useBemm('pill-header-example', { includeBaseClass: true })

const navigationWithSubmenus: PillHeaderNavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Icons.UI_DASHBOARD,
    to: '/overview',
    exact: true,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: Icons.UI_FOLDER,
    to: '/projects',
    items: [
      {
        id: 'project-overview',
        label: 'Overview',
        description: 'Project dashboard',
        icon: Icons.UI_BOARD,
        to: '/projects',
        exact: true,
      },
      {
        id: 'project-releases',
        label: 'Releases',
        description: 'Deployments and changelog',
        icon: Icons.MISC_ROCKET,
        to: '/projects/releases',
      },
      {
        id: 'project-settings',
        label: 'Settings',
        description: 'Configuration and access',
        icon: Icons.UI_SETTINGS,
        to: '/projects/settings',
      },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    icon: Icons.UI_USER,
    items: [
      {
        id: 'members',
        label: 'Members',
        icon: Icons.UI_USERS,
        to: '/team/members',
      },
      {
        id: 'permissions',
        label: 'Permissions',
        icon: Icons.UI_LOCK,
        to: '/team/permissions',
        color: Color.PRIMARY,
      },
    ],
  },
]

const navigationWithExternalLink: PillHeaderNavItem[] = [
  ...navigationWithSubmenus,
  {
    id: 'docs',
    label: 'Docs',
    icon: Icons.UI_FILE_TEXT,
    href: 'https://sil.tools',
    target: '_blank',
  },
]

const actions: PillHeaderAction[] = [
  {
    label: 'Search',
    icon: Icons.UI_SEARCH_M,
  },
  {
    label: 'Create',
    icon: Icons.UI_ADD_M,
    color: Color.PRIMARY,
  },
]
</script>

<style lang="scss">
.pill-header-example {
  &__preview {
    min-height: 18rem;
    padding: 0 1rem 10rem;
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--color-primary), transparent 78%), transparent 42%),
      color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);
  }

  &__brand-mark {
    display: inline-grid;
    place-items: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 999px;
    background: var(--color-primary);
    color: var(--color-primary-text, var(--color-background));
    font-size: 0.75rem;
    font-weight: 700;
  }
}
</style>
