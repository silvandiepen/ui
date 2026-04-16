<template>
  <div :class="bemm()">
    <section :class="bemm('hero')">
      <div :class="bemm('hero-copy')">
        <StatusBadge :label="t('docs.common.status.sourceOfTruth')" />
        <h1 :class="bemm('title')">{{ t('docs.home.title') }}</h1>
        <p :class="bemm('summary')">
          {{ t('docs.home.summary') }}
        </p>
      </div>

      <div :class="bemm('hero-stats')">
        <Card :class="bemm('stat-card')">
          <strong>{{ components.length }}</strong>
          <span>{{ t('docs.home.totalCount') }}</span>
        </Card>
        <Card :class="bemm('stat-card')">
          <strong>{{ documentedCount }}</strong>
          <span>{{ t('docs.home.withDocsCount') }}</span>
        </Card>
        <Card :class="bemm('stat-card')">
          <strong>{{ exampleCount }}</strong>
          <span>{{ t('docs.home.exampleCount') }}</span>
        </Card>
      </div>
    </section>

    <section :class="bemm('groups')">
      <Card
        v-for="group in groupedComponents"
        :key="group.id"
        :class="bemm('group-card')"
      >
        <header :class="bemm('group-header')">
          <div>
            <p :class="bemm('group-eyebrow')">{{ t(`docs.categorySections.${group.sectionId}`) }}</p>
            <RouterLink
              :class="bemm('group-title-link')"
            :to="{ name: 'docs-category', params: { categoryId: group.id } }"
          >
            <h2 :class="bemm('group-title')">{{ group.label }}</h2>
          </RouterLink>
          <p :class="bemm('group-description')">{{ group.description }}</p>
          <p :class="bemm('group-meta')">{{ t('docs.home.groupEntries', { count: group.items.length }) }}</p>
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
              <strong>{{ item.apiName }}</strong>
              <span v-if="item.aliases.length > 0" :class="bemm('group-link-aliases')">
                {{ t('docs.home.aliases', { aliases: item.aliases.join(', ') }) }}
              </span>
              <span>{{ item.summary }}</span>
            </div>
            <StatusBadge :label="t(`docs.common.status.${item.status}`)" :tone="item.statusTone" />
          </RouterLink>
        </div>
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'

import { Badge } from '@ui-lib/components/Badge'
import { Card } from '@ui-lib/components/Card'
import StatusBadge from '@ui-lib/components/StatusBadge/StatusBadge.vue'

import { getComponentCatalog } from '@ui-docs/lib/componentRegistry'
import { buildDocsHomeSections } from '@ui-docs/lib/homeSections'

const bemm = useBemm('docs-home-page', { includeBaseClass: true })
const { t } = useI18n()

const components = getComponentCatalog()
const groupedComponents = computed(() =>
  buildDocsHomeSections(components).map((group) => ({
    ...group,
    description: t(`docs.categories.${group.id}.description`),
    label: t(`docs.categories.${group.id}.label`),
  })),
)

const documentedCount = computed(() => components.filter((item) => item.docs.length > 0).length)
const exampleCount = computed(() => components.filter((item) => item.examplePath).length)
</script>

<style lang="scss">
.docs-home-page {
  --docs-home-card-background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
  --docs-home-card-border: color-mix(in srgb, var(--color-foreground), transparent 88%);
  --docs-home-card-hover-background: color-mix(in srgb, var(--color-primary), transparent 94%);
  --docs-home-copy-muted: color-mix(in srgb, var(--color-foreground), transparent 24%);
  --docs-home-copy-soft: color-mix(in srgb, var(--color-foreground), transparent 32%);
  --docs-home-copy-faint: color-mix(in srgb, var(--color-foreground), transparent 40%);
  --docs-home-shadow: 0 1rem 2rem color-mix(in srgb, var(--color-foreground), transparent 94%);

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
    color: var(--docs-home-copy-muted);
  }

  &__stat-card {
    display: grid;
    gap: 0.4rem;
    padding: 1.25rem;

    strong {
      font-size: 2rem;
    }

    span {
      color: var(--docs-home-copy-soft);
    }
  }

  &__groups {
    display: grid;
    gap: 1.25rem;
  }

  &__group-card {
    display: grid;
    gap: 1rem;
    padding: 1.25rem;
  }

  &__group-header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--docs-home-card-border);
  }

  &__group-title {
    margin: 0;
    font-size: 1.1rem;
  }

  &__group-eyebrow {
    margin: 0 0 0.35rem;
    color: var(--docs-home-copy-faint);
    font-size: var(--font-size-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__group-title-link {
    color: inherit;
    text-decoration: none;
  }

  &__group-description {
    margin: 0.35rem 0 0;
    color: var(--docs-home-copy-soft);
    font-size: 0.94rem;
    line-height: 1.5;
  }

  &__group-meta {
    margin: 0.2rem 0 0;
    color: var(--docs-home-copy-faint);
  }

  &__group-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
    gap: 0.75rem;
  }

  &__group-link {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.85rem;
    border-radius: 0.85rem;
    border: 1px solid var(--docs-home-card-border);
    background: var(--docs-home-card-background);
    text-decoration: none;
    color: inherit;
    transition:
      transform 150ms ease,
      box-shadow 150ms ease,
      background-color 150ms ease;

    &:hover {
      transform: translateY(-0.08rem);
      background: var(--docs-home-card-hover-background);
      box-shadow: var(--docs-home-shadow);
    }
  }

  &__group-link-copy {
    display: grid;
    gap: 0.3rem;

    span {
      color: var(--docs-home-copy-soft);
      font-size: 0.94rem;
      line-height: 1.45;
    }
  }

  &__group-link-aliases {
    color: var(--docs-home-copy-faint);
    font-size: var(--font-size-xs);
    letter-spacing: 0.02em;
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
