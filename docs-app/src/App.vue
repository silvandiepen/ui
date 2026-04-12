<template>
  <div :class="bemm()">
    <Sidebar :class="bemm('sidebar')" title="@sil/ui" width="15rem">
      <template #header>
        <RouterLink :class="bemm('brand')" to="/">
          <span :class="bemm('brand-logo')" aria-hidden="true" v-html="logoSvg" />
          <span :class="bemm('brand-copy')">
            <span :class="bemm('brand-title')">@sil/ui</span>
            <span :class="bemm('brand-subtitle')">UI-prefixed component docs</span>
          </span>
        </RouterLink>
      </template>

      <SidebarNavigation :class="bemm('nav')" :sections="navigationSections" />
    </Sidebar>

    <main :class="bemm('main')">
      <PlatformHeader :class="bemm('header')">
        <template #brand>
          <RouterLink :class="bemm('header-brand')" to="/">
            <span :class="bemm('header-brand-logo')" aria-hidden="true" v-html="logoSvg" />
            <span>Shared UI library</span>
          </RouterLink>
        </template>

        <template #actions>
          <div :class="bemm('header-actions')">
            <ThemeToggle :theme="colorMode" @toggle="toggleColorMode" />
            <Button href="https://github.com/silvandiepen" target="_blank">
              GitHub
            </Button>
          </div>
        </template>
      </PlatformHeader>

      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useBemm } from 'bemm'

import logoSvg from '@ui-lib/assets/logo.svg?raw'
import { Button } from '@ui-lib/components/Button'
import { PlatformHeader } from '@ui-lib/components/PlatformHeader'
import { Sidebar } from '@ui-lib/components/Sidebar'
import { SidebarNavigation } from '@ui-lib/components/SidebarNavigation'
import { ThemeToggle } from '@ui-lib/components/ThemeToggle'

import { UI_COMPONENT_CATEGORIES } from '@ui-docs/lib/componentCategories'
import { getComponentCatalog } from '@ui-docs/lib/componentRegistry'
import { useColorMode } from '@ui-docs/lib/useColorMode'
import { useDocsTheme } from '@ui-docs/lib/docsTheme'

const bemm = useBemm('docs-app')
const { colorMode, toggleColorMode } = useColorMode()
useDocsTheme()

const navigationSections = computed(() => {
  const groups = new Map<string, ReturnType<typeof getComponentCatalog>>()

  for (const item of getComponentCatalog()) {
    const groupItems = groups.get(item.categoryId) ?? []

    groupItems.push(item)
    groups.set(item.categoryId, groupItems)
  }

  return [
    {
      id: 'guides',
      label: 'Guides',
      items: [
        {
          id: 'guides-getting-started',
          label: 'Getting Started',
          to: {
            name: 'docs-guide-getting-started',
          },
        },
        {
          id: 'guides-theme-builder',
          label: 'Theme Builder',
          to: {
            name: 'docs-guide-theme-builder',
          },
        },
      ],
    },
    ...UI_COMPONENT_CATEGORIES
    .map((category) => ({
      id: category.id,
      items: [
        {
          id: `${category.id}-overview`,
          label: 'Overview',
          to: {
            name: 'docs-category',
            params: {
              categoryId: category.id,
            },
          },
        },
        ...(groups.get(category.id) ?? []).map((item) => ({
          id: item.slug,
          label: item.apiName,
          to: {
            name: 'docs-component',
            params: {
              slug: item.slug,
            },
          },
        })),
      ],
      label: category.label,
    })),
  ]
})
</script>

<style lang="scss">
.docs-app {
  --docs-shell-background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--color-primary), transparent 96%),
      transparent 24rem
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 1%) 0%,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 2.5%) 100%
    );
  --docs-shell-surface: color-mix(in srgb, var(--color-background), var(--color-foreground) 1.5%);
  --docs-shell-overlay: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
  --docs-shell-border: color-mix(in srgb, var(--color-foreground), transparent 90%);
  --docs-shell-muted: color-mix(in srgb, var(--color-foreground), transparent 40%);

  display: grid;
  grid-template-columns: 15rem minmax(0, 1fr);
  min-height: 100vh;
  background: var(--docs-shell-background);
  color: var(--color-foreground);

  &__sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: auto;
    border-right: 1px solid var(--docs-shell-border);
    background: color-mix(in srgb, var(--color-background), transparent 2%);
    backdrop-filter: blur(8px);
    box-shadow: none;
    border-radius: 0;
    padding: 1.1rem 0.85rem;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    text-decoration: none;
    color: inherit;
  }

  &__brand-copy {
    display: grid;
    gap: 0.1rem;
    min-width: 0;
  }

  &__brand-logo {
    width: 2.1rem;
    height: 2.1rem;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &__brand-title {
    font-size: 1.05rem;
    font-weight: 700;
  }

  &__brand-subtitle {
    color: var(--docs-shell-muted);
    font-size: 0.8rem;
  }

  &__main {
    min-width: 0;
  }

  &__header {
    position: sticky;
    top: 0;
    z-index: 3;
    border-bottom: 1px solid var(--docs-shell-border);
    background: color-mix(in srgb, var(--docs-shell-overlay), transparent 6%);
    backdrop-filter: blur(8px);
  }

  &__header-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__header-brand {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    text-decoration: none;
    color: inherit;
    font-weight: 600;
  }

  &__header-brand-logo {
    width: 1.6rem;
    height: 1.6rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    :deep(svg) {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &__nav {
    .sidebar-navigation__section {
      gap: 0.25rem;
    }

    .sidebar-navigation__section-header {
      display: block;
      padding: 0.2rem 0;
    }

    .sidebar-navigation__section-header .badge,
    .sidebar-navigation__section-description {
      display: none;
    }

    .sidebar-navigation__section-label {
      color: var(--docs-shell-muted);
      font-size: 0.68rem;
      letter-spacing: 0.09em;
    }

    .sidebar-navigation__items {
      gap: 0.1rem;
    }

    .sidebar-navigation__item {
      justify-content: flex-start;
      gap: 0.5rem;
      padding: 0.45rem 0.2rem 0.45rem 0.7rem;
      border-radius: 0;
      border-left: 2px solid transparent;
      background: transparent;
      box-shadow: none;
    }

    .sidebar-navigation__item:hover {
      transform: none;
      background: color-mix(in srgb, var(--color-foreground), transparent 97%);
      box-shadow: none;
    }

    .sidebar-navigation__item--active {
      border-left-color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary), transparent 95%);
      box-shadow: none;
    }

    .sidebar-navigation__item .status-badge,
    .sidebar-navigation__item-description {
      display: none;
    }

    .sidebar-navigation__item-label {
      font-size: 0.84rem;
      font-weight: 600;
    }
  }
}

@media (max-width: 960px) {
  .docs-app {
    grid-template-columns: 1fr;

    &__sidebar {
      position: relative;
      height: auto;
      border-right: 0;
      border-bottom: 1px solid var(--docs-shell-border);
    }
  }
}
</style>
