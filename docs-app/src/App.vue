<template>
  <div :class="bemm()">
    <aside :class="bemm('sidebar')">
      <div :class="bemm('sidebar-header')">
        <RouterLink :class="bemm('brand')" to="/">
          <span :class="bemm('brand-title')">@sil/ui</span>
          <span :class="bemm('brand-subtitle')">Component docs</span>
        </RouterLink>
      </div>

      <div :class="bemm('sidebar-content')">
        <section
          v-for="group in catalogGroups"
          :key="group.name"
          :class="bemm('sidebar-group')"
        >
          <header :class="bemm('sidebar-group-header')">
            <h2 :class="bemm('sidebar-group-title')">{{ group.name }}</h2>
            <Badge>{{ group.items.length }}</Badge>
          </header>

          <nav :class="bemm('sidebar-nav')">
            <RouterLink
              v-for="item in group.items"
              :key="item.slug"
              :class="bemm('sidebar-link')"
              :to="{
                name: 'docs-component',
                params: {
                  slug: item.slug,
                },
              }"
            >
              <span>{{ item.name }}</span>
              <StatusBadge
                :class="bemm('sidebar-status')"
                :label="item.status"
                :tone="item.statusTone"
              />
            </RouterLink>
          </nav>
        </section>
      </div>
    </aside>

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

import { Badge, Button, PlatformHeader, StatusBadge } from '@sil/ui'

import { getComponentCatalog } from '@ui-docs/lib/componentRegistry'

const bemm = useBemm('docs-app')

const catalogGroups = computed(() => {
  const groups = new Map<string, ReturnType<typeof getComponentCatalog>>()

  for (const item of getComponentCatalog()) {
    const groupItems = groups.get(item.category) ?? []

    groupItems.push(item)
    groups.set(item.category, groupItems)
  }

  return [...groups.entries()]
    .map(([name, items]) => ({
      name,
      items,
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
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

  &__sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(72, 48, 26, 0.12);
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

  &__sidebar-content {
    display: grid;
    gap: 1.25rem;
    padding: 1.5rem;
  }

  &__sidebar-group {
    display: grid;
    gap: 0.75rem;
  }

  &__sidebar-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__sidebar-group-title {
    margin: 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(43, 36, 29, 0.6);
  }

  &__sidebar-nav {
    display: grid;
    gap: 0.45rem;
  }

  &__sidebar-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.7rem 0.85rem;
    border-radius: 0.9rem;
    text-decoration: none;
    color: inherit;
    transition:
      background-color 150ms ease,
      transform 150ms ease;

    &:hover,
    &.router-link-active {
      background: rgba(229, 84, 38, 0.08);
      transform: translateX(0.12rem);
    }
  }

  &__sidebar-status {
    flex: 0 0 auto;
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
