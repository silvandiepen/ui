<template>
  <Container :class="bemm()">
    <section :class="bemm('hero')">
      <StatusBadge :label="t('docs.common.status.guide')" :tone="Status.INFO" />
      <h1 :class="bemm('title')">{{ guide.title }}</h1>
      <p :class="bemm('summary')">{{ guide.summary }}</p>
    </section>

    <Card :class="bemm('content')">
      <Markdown :content="guide.content" />
    </Card>
  </Container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'

import { Card } from '@ui-lib/components/Card'
import { Container } from '@ui-lib/components/Container'
import { Markdown } from '@ui-lib/components/Markdown'
import StatusBadge from '@ui-lib/components/StatusBadge/StatusBadge.vue'
import { Status } from '@ui-lib/types'

import componentAuthoringContent from '../../../docs/COMPONENT_AUTHORING.md?raw'
import viteIntegrationContent from '../../../docs/VITE_INTEGRATION.md?raw'

interface GuidePageContent {
  content: string
  summary: string
  title: string
}

const props = defineProps<{
  slug: string
}>()

const bemm = useBemm('docs-guide-page', { includeBaseClass: true })
const { t } = useI18n()

const guides: Record<string, GuidePageContent> = {
  'component-authoring': {
    content: componentAuthoringContent,
    summary: 'Rules for shared component structure, global classes, unscoped styles, CSS custom properties, examples, and tests.',
    title: 'Component Authoring',
  },
  'vite-integration': {
    content: viteIntegrationContent,
    summary: 'How to wire @sil/ui into Vue/Vite apps with shared styles and generated theme tokens.',
    title: 'Vite Integration',
  },
}

const guide = computed(() => guides[props.slug] ?? {
  content: '# Unknown guide\n\nThe requested guide does not exist.',
  summary: 'The requested guide does not exist.',
  title: 'Unknown Guide',
})
</script>

<style lang="scss">
.docs-guide-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding-block: var(--space-xl);

  &__hero {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
    max-width: 52rem;
  }

  &__title {
    margin: 0;
    font-size: clamp(2rem, 4vw, 4rem);
    line-height: 1;
  }

  &__summary {
    max-width: 46rem;
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 24%);
    font-size: var(--font-size-l);
    line-height: 1.6;
  }

  &__content {
    max-width: 58rem;
  }
}
</style>
