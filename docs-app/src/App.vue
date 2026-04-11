<template>
  <div :class="bemm()">
    <Sidebar :class="bemm('sidebar')" subtitle="Source-driven component docs" title="@sil/ui">
      <template #header>
        <RouterLink :class="bemm('brand')" to="/">
          <span :class="bemm('brand-title')">@sil/ui</span>
          <span :class="bemm('brand-subtitle')">UI-prefixed component docs</span>
        </RouterLink>
      </template>

      <SidebarNavigation :sections="navigationSections" />
    </Sidebar>

    <main :class="bemm('main')">
      <PlatformHeader :class="bemm('header')">
        <template #brand>
          <RouterLink :class="bemm('header-brand')" to="/">
            Shared UI library
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

import { Button } from '@ui-lib/components/Button'
import { PlatformHeader } from '@ui-lib/components/PlatformHeader'
import { Sidebar } from '@ui-lib/components/Sidebar'
import { SidebarNavigation } from '@ui-lib/components/SidebarNavigation'
import { ThemeToggle } from '@ui-lib/components/ThemeToggle'

import { UI_COMPONENT_CATEGORIES } from '@ui-docs/lib/componentCategories'
import { getComponentCatalog } from '@ui-docs/lib/componentRegistry'
import { useColorMode } from '@ui-docs/lib/useColorMode'

const bemm = useBemm('docs-app')
const { colorMode, toggleColorMode } = useColorMode()

const navigationSections = computed(() => {
  const groups = new Map<string, ReturnType<typeof getComponentCatalog>>()

  for (const item of getComponentCatalog()) {
    const groupItems = groups.get(item.categoryId) ?? []

    groupItems.push(item)
    groups.set(item.categoryId, groupItems)
  }

  return UI_COMPONENT_CATEGORIES
    .map((category) => ({
      description: category.description,
      id: category.id,
      items: [
        {
          description: `Overview of ${category.label.toLowerCase()} surfaces and current coverage.`,
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
          badge: item.status,
          badgeTone: item.statusTone,
          description: `${item.apiName}${item.aliases.length > 0 ? ` · alias: ${item.aliases.join(', ')}` : ''}`,
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
    }))
})
</script>

<style lang="scss">
.docs-app {
  --docs-shell-background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--color-primary), transparent 92%),
      transparent 24rem
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 2%) 0%,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 6%) 100%
    );
  --docs-shell-surface: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
  --docs-shell-overlay: color-mix(in srgb, var(--color-background), var(--color-foreground) 7%);
  --docs-shell-border: color-mix(in srgb, var(--color-foreground), transparent 86%);
  --docs-shell-muted: color-mix(in srgb, var(--color-foreground), transparent 32%);

  display: grid;
  grid-template-columns: 18rem minmax(0, 1fr);
  min-height: 100vh;
  background: var(--docs-shell-background);
  color: var(--color-foreground);

  &__sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: auto;
    border-right: 1px solid var(--docs-shell-border);
    background: color-mix(in srgb, var(--docs-shell-surface), transparent 6%);
    backdrop-filter: blur(12px);
  }

  &__brand {
    display: grid;
    gap: 0.2rem;
    text-decoration: none;
    color: inherit;
  }

  &__brand-title {
    font-size: 1.25rem;
    font-weight: 700;
  }

  &__brand-subtitle {
    color: var(--docs-shell-muted);
  }

  &__main {
    min-width: 0;
  }

  &__header {
    position: sticky;
    top: 0;
    z-index: 3;
    border-bottom: 1px solid var(--docs-shell-border);
    background: color-mix(in srgb, var(--docs-shell-overlay), transparent 12%);
    backdrop-filter: blur(12px);
  }

  &__header-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__header-brand {
    text-decoration: none;
    color: inherit;
    font-weight: 600;
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
