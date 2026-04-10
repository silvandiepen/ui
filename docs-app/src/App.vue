<template>
  <div :class="bemm()">
    <Sidebar :class="bemm('sidebar')" subtitle="Source-driven component docs" title="@sil/ui">
      <template #header>
        <RouterLink :class="bemm('brand')" to="/">
          <span :class="bemm('brand-title')">@sil/ui</span>
          <span :class="bemm('brand-subtitle')">Component docs</span>
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
          <Button href="https://github.com/silvandiepen" target="_blank">
            GitHub
          </Button>
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

import { Button, PlatformHeader, Sidebar, SidebarNavigation } from '@sil/ui'

import { getComponentCatalog } from '@ui-docs/lib/componentRegistry'

const bemm = useBemm('docs-app')

const navigationSections = computed(() => {
  const groups = new Map<string, ReturnType<typeof getComponentCatalog>>()

  for (const item of getComponentCatalog()) {
    const groupItems = groups.get(item.category) ?? []

    groupItems.push(item)
    groups.set(item.category, groupItems)
  }

  return [...groups.entries()]
    .map(([name, items]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      items: items.map((item) => ({
        badge: item.status,
        badgeTone: item.statusTone,
        description: item.summary,
        id: item.slug,
        label: item.name,
        to: {
          name: 'docs-component',
          params: {
            slug: item.slug,
          },
        },
      })),
      label: name,
    }))
    .sort((left, right) => left.label.localeCompare(right.label))
})
</script>

<style lang="scss">
.docs-app {
  display: grid;
  grid-template-columns: 18rem minmax(0, 1fr);
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(229, 84, 38, 0.08), transparent 24rem),
    linear-gradient(180deg, #fffdf8 0%, #f7f3ec 100%);
  color: #2b241d;

  &__sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: auto;
    border-right: 1px solid rgba(72, 48, 26, 0.12);
    background: rgba(255, 251, 244, 0.92);
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
    color: rgba(43, 36, 29, 0.7);
  }

  &__main {
    min-width: 0;
  }

  &__header {
    position: sticky;
    top: 0;
    z-index: 3;
    border-bottom: 1px solid rgba(72, 48, 26, 0.12);
    background: rgba(255, 248, 239, 0.86);
    backdrop-filter: blur(12px);
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
      border-bottom: 1px solid rgba(72, 48, 26, 0.12);
    }
  }
}
</style>
