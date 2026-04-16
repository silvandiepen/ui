<template>
  <div v-if="entry" :class="bemm()">
    <header :class="bemm('header')">
      <div :class="bemm('header-copy')">
        <p :class="bemm('eyebrow')">{{ t('docs.search.kinds.composable') }}</p>
        <h1 :class="bemm('title')">{{ entry.name }}</h1>
        <p :class="bemm('summary')">{{ entry.summary }}</p>
        <p :class="bemm('description')">{{ entry.description }}</p>
      </div>

      <div :class="bemm('meta')">
        <StatusBadge :label="t('docs.common.status.stable')" :tone="Status.INFO" />
        <ReferenceBadge
          :label="entry.sourcePath"
          :copy-value="entry.sourcePath"
          :tooltip-text="t('docs.composable.sourceLocation')"
        />
      </div>
    </header>

    <Card :class="bemm('usage-card')" :title="t('docs.component.usage')">
      <template #actions>
        <Badge>{{ t('docs.composable.preferredImport') }}</Badge>
      </template>

      <div :class="bemm('code-block')" v-html="renderedUsageExample" />
    </Card>

    <Card :class="bemm('doc-card')" :title="t('docs.composable.documentation')">
      <template #actions>
        <Badge>{{ entry.sourcePath }}</Badge>
      </template>

      <article :class="bemm('doc-content')">
        <Markdown :content="docContent" />
      </article>
    </Card>
  </div>

  <div v-else :class="bemm('missing')">
    <Card :class="bemm('empty-card')" :title="t('docs.composable.missingTitle')">
      <p :class="bemm('empty-copy')">{{ t('docs.composable.missingSummary') }}</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'

import { Badge } from '@ui-lib/components/Badge'
import { Card } from '@ui-lib/components/Card'
import { Markdown } from '@ui-lib/components/Markdown'
import { ReferenceBadge } from '@ui-lib/components/ReferenceBadge'
import StatusBadge from '@ui-lib/components/StatusBadge/StatusBadge.vue'
import { Status } from '@ui-lib/types'

import { renderCodeBlock } from '@ui-docs/lib/codeBlock'
import {
  getComposableBySlug,
  getComposableDocContent,
} from '@ui-docs/lib/composableCatalog'

interface Props {
  slug: string
}

const props = defineProps<Props>()

const bemm = useBemm('docs-composable-page', { includeBaseClass: true })
const { t } = useI18n()

const entry = computed(() => getComposableBySlug(props.slug))
const docContent = computed(() => (
  entry.value
    ? getComposableDocContent(entry.value.docPath) ?? t('docs.composables.missingDocument')
    : t('docs.composables.missingDocument')
))
const renderedUsageExample = computed(() => renderCodeBlock(
  entry.value
    ? `import { ${entry.value.name} } from '@sil/ui'`
    : '',
  'typescript',
))
</script>

<style lang="scss">
.docs-composable-page {
  display: grid;
  gap: 1.25rem;
  padding: 2rem;

  &__header {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(16rem, 0.9fr);
    gap: 1rem;
  }

  &__header-copy,
  &__meta,
  &__usage-card,
  &__doc-card {
    display: grid;
    gap: 0.75rem;
  }

  &__eyebrow {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 36%);
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title {
    margin: 0;
    font-size: clamp(2.1rem, 4.4vw, 3.3rem);
    line-height: 0.96;
  }

  &__summary,
  &__description,
  &__empty-copy {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 28%);
    line-height: 1.6;
  }

  &__meta,
  &__card-header {
    align-content: start;
  }

  &__card-header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__section-title {
    margin: 0;
  }

  &__doc-content {
    :deep(pre) {
      overflow: auto;
    }
  }

  @media (max-width: 960px) {
    &__header {
      grid-template-columns: 1fr;
    }
  }
}
</style>
