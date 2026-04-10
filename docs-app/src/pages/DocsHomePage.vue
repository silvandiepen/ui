<template>
  <Container :class="bemm()">
    <section :class="bemm('hero')">
      <div :class="bemm('hero-copy')">
        <StatusBadge label="Source of truth" tone="success" />
        <h1 :class="bemm('title')">Shared Vue UI docs for SIL products</h1>
        <p :class="bemm('summary')">
          This app reflects the current state of the library as it exists in the repo:
          stable primitives, transitional compatibility surfaces, and the markdown docs
          that still live next to components.
        </p>
      </div>

      <div :class="bemm('hero-stats')">
        <Card :class="bemm('stat-card')">
          <strong>{{ components.length }}</strong>
          <span>cataloged surfaces</span>
        </Card>
        <Card :class="bemm('stat-card')">
          <strong>{{ documentedCount }}</strong>
          <span>with markdown docs</span>
        </Card>
        <Card :class="bemm('stat-card')">
          <strong>{{ exampleCount }}</strong>
          <span>with live examples</span>
        </Card>
      </div>
    </section>

    <section :class="bemm('groups')">
      <Card
        v-for="group in groupedComponents"
        :key="group.name"
        :class="bemm('group-card')"
      >
        <header :class="bemm('group-header')">
          <div>
            <h2 :class="bemm('group-title')">{{ group.name }}</h2>
            <p :class="bemm('group-meta')">{{ group.items.length }} entries</p>
          </div>
          <Badge>{{ group.items.length }}</Badge>
        </header>

        <div :class="bemm('group-items')">
          <RouterLink
            v-for="item in group.items"
            :key="item.slug"
            :class="bemm('group-link')"
            :to="{
              name: 'docs-component',
              params: {
                slug: item.slug,
              },
            }"
          >
            <div :class="bemm('group-link-copy')">
              <strong>{{ item.name }}</strong>
              <span>{{ item.summary }}</span>
            </div>
            <StatusBadge :label="item.status" :tone="item.statusTone" />
          </RouterLink>
        </div>
      </Card>
    </section>
  </Container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useBemm } from 'bemm'

import { Badge, Card, Container, StatusBadge } from '@sil/ui'

import { getComponentCatalog } from '@ui-docs/lib/componentRegistry'

const bemm = useBemm('docs-home-page')

const components = getComponentCatalog()

const groupedComponents = computed(() => {
  const groups = new Map<string, typeof components>()

  for (const component of components) {
    const items = groups.get(component.category) ?? []

    items.push(component)
    groups.set(component.category, items)
  }

  return [...groups.entries()]
    .map(([name, items]) => ({
      name,
      items,
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
})

const documentedCount = computed(() => components.filter((item) => item.docs.length > 0).length)
const exampleCount = computed(() => components.filter((item) => item.examplePath).length)
</script>

<style lang="scss">
.docs-home-page {
  display: grid;
  gap: 2rem;
  padding: 2rem;

  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(16rem, 0.9fr);
    gap: 1.5rem;
  }

  &__hero-copy,
  &__hero-stats {
    display: grid;
    gap: 1rem;
  }

  &__title {
    margin: 0;
    font-size: clamp(2.4rem, 5vw, 4rem);
    line-height: 0.95;
  }

  &__summary {
    margin: 0;
    max-width: 48rem;
    font-size: 1.05rem;
    line-height: 1.6;
    color: rgba(43, 36, 29, 0.78);
  }

  &__stat-card {
    display: grid;
    gap: 0.4rem;
    padding: 1.25rem;

    strong {
      font-size: 2rem;
    }

    span {
      color: rgba(43, 36, 29, 0.7);
    }
  }

  &__groups {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));
    gap: 1rem;
  }

  &__group-card {
    display: grid;
    gap: 1rem;
    padding: 1.1rem;
  }

  &__group-header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 1rem;
  }

  &__group-title {
    margin: 0;
    font-size: 1.1rem;
  }

  &__group-meta {
    margin: 0.2rem 0 0;
    color: rgba(43, 36, 29, 0.68);
  }

  &__group-items {
    display: grid;
    gap: 0.65rem;
  }

  &__group-link {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.85rem;
    border-radius: 0.85rem;
    background: rgba(255, 255, 255, 0.76);
    text-decoration: none;
    color: inherit;
    transition:
      transform 150ms ease,
      box-shadow 150ms ease;

    &:hover {
      transform: translateY(-0.08rem);
      box-shadow: 0 1rem 2rem rgba(43, 36, 29, 0.08);
    }
  }

  &__group-link-copy {
    display: grid;
    gap: 0.3rem;

    span {
      color: rgba(43, 36, 29, 0.7);
      font-size: 0.94rem;
      line-height: 1.45;
    }
  }
}

@media (max-width: 960px) {
  .docs-home-page {
    padding: 1.2rem;

    &__hero {
      grid-template-columns: 1fr;
    }
  }
}
</style>
