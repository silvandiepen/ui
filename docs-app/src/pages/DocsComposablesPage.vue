<template>
  <Container :class="bemm()">
    <section :class="bemm('hero')">
      <div :class="bemm('hero-copy')">
        <StatusBadge :label="t('docs.common.status.guide')" :tone="Status.INFO" />
        <h1 :class="bemm('title')">{{ t('docs.composables.title') }}</h1>
        <p :class="bemm('summary')">{{ t('docs.composables.summary') }}</p>
      </div>

      <Card :class="bemm('callout')">
        <strong>{{ t('docs.composables.calloutTitle') }}</strong>
        <p>{{ t('docs.composables.calloutBody') }}</p>
        <div v-html="renderedImportSnippet" />
      </Card>
    </section>

    <section :class="bemm('overview')">
      <Card
        v-for="entry in composables"
        :key="entry.name"
        :class="bemm('overview-card')"
      >
        <header :class="bemm('overview-header')">
          <RouterLink :class="bemm('overview-link')" :to="getComposableRoute(entry.slug)">
            <h2 :class="bemm('section-title')">{{ entry.name }}</h2>
          </RouterLink>
          <Badge>{{ t('docs.common.status.stable') }}</Badge>
        </header>

        <p :class="bemm('overview-summary')">{{ entry.summary }}</p>
        <p :class="bemm('overview-description')">{{ entry.description }}</p>
        <div :class="bemm('overview-meta')">
          <ReferenceBadge
            :label="entry.sourcePath"
            :copy-value="entry.sourcePath"
            :tooltip-text="t('docs.composables.sourceLocation')"
          />
          <RouterLink :class="bemm('overview-link-secondary')" :to="getComposableRoute(entry.slug)">
            {{ t('docs.composable.readDocumentation') }}
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
import { useI18n } from 'vue-i18n'

import { Badge } from '@ui-lib/components/Badge'
import { Card } from '@ui-lib/components/Card'
import { Container } from '@ui-lib/components/Container'
import { ReferenceBadge } from '@ui-lib/components/ReferenceBadge'
import StatusBadge from '@ui-lib/components/StatusBadge/StatusBadge.vue'
import { Status } from '@ui-lib/types'

import { renderCodeBlock } from '@ui-docs/lib/codeBlock'
import { getComposableCatalog } from '@ui-docs/lib/composableCatalog'

const bemm = useBemm('docs-composables-page')
const { t } = useI18n()

const composables = computed(() => getComposableCatalog())

const renderedImportSnippet = renderCodeBlock(
  [
    "import {",
    "  configureContent,",
    "  configureSettings,",
    "  useContent,",
    "  useConfirm,",
    "  useI18n,",
    "  useId,",
    "  useInput,",
    "  useSearch,",
    "  useSettings,",
    "} from '@sil/ui'",
  ].join('\n'),
  'typescript',
)

function getComposableRoute(slug: string) {
  return {
    name: 'docs-composable',
    params: {
      slug,
    },
  }
}
</script>

<style lang="scss">
.docs-composables-page {
  display: grid;
  gap: 1.5rem;
  padding: 2rem;

  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(18rem, 0.95fr);
    gap: 1rem;
  }

  &__hero-copy,
  &__callout,
  &__overview-card {
    display: grid;
    gap: 0.75rem;
  }

  &__title {
    margin: 0;
    font-size: clamp(2.1rem, 4.8vw, 3.5rem);
    line-height: 0.95;
  }

  &__summary,
  &__callout p,
  &__overview-summary,
  &__overview-description {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 28%);
    line-height: 1.6;
  }

  &__overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    gap: 1rem;
  }

  &__overview-header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__section-title {
    margin: 0;
  }

  &__overview-link,
  &__overview-link-secondary {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: var(--color-primary);
    }
  }

  &__overview-link-secondary {
    font-size: 0.92rem;
    font-weight: 600;
  }

  &__overview-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  @media (max-width: 960px) {
    &__hero {
      grid-template-columns: 1fr;
    }
  }
}
</style>
