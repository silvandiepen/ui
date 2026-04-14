<template>
  <div v-if="componentEntry" :class="bemm()">
    <header :class="bemm('header')">
      <div :class="bemm('header-copy')">
        <p :class="bemm('eyebrow')">{{ t(`docs.categories.${componentEntry.categoryId}.label`) }}</p>
        <h1 :class="bemm('title')">{{ componentEntry.apiName }}</h1>
        <p :class="bemm('summary')">{{ componentEntry.summary }}</p>
        <div :class="bemm('api-badges')">
          <Badge>{{ t('docs.component.preferred', { name: componentEntry.apiName }) }}</Badge>
          <Badge v-if="componentEntry.aliases.length > 0">
            {{ t('docs.component.aliases', { aliases: componentEntry.aliases.join(', ') }) }}
          </Badge>
        </div>
      </div>

      <div :class="bemm('meta')">
        <StatusBadge :label="t(`docs.common.status.${componentEntry.status}`)" :tone="componentEntry.statusTone" />
        <ReferenceBadge
          :label="componentEntry.name"
          :copy-value="componentEntry.name"
          :tooltip-text="t('docs.component.sourceSurface')"
        />
        <ReferenceBadge
          :label="componentEntry.sourcePath"
          :copy-value="componentEntry.sourcePath"
          :tooltip-text="t('docs.component.sourceLocation')"
        />
      </div>
    </header>

    <Card v-if="asyncExampleComponent" :class="bemm('example-card')">
      <header :class="bemm('example-header')">
        <h2 :class="bemm('section-title')">{{ t('docs.component.liveExample') }}</h2>
        <Badge>{{ t('docs.component.renderedFromExample') }}</Badge>
      </header>

      <div :class="bemm('example-preview')">
        <component :is="asyncExampleComponent" />
      </div>
    </Card>

    <Card :class="bemm('usage-card')">
      <header :class="bemm('doc-header')">
        <h2 :class="bemm('section-title')">{{ t('docs.component.usage') }}</h2>
        <Badge>{{ t('docs.component.preferredImport') }}</Badge>
      </header>

      <div
        :class="bemm('code-block')"
        v-html="renderedUsageExample"
      />
    </Card>

    <Card v-if="sourceDocumentation.props.length > 0" :class="bemm('props-card')">
      <header :class="bemm('doc-header')">
        <h2 :class="bemm('section-title')">{{ t('docs.component.props') }}</h2>
        <Badge>{{ sourceDocumentation.props.length }}</Badge>
      </header>

      <div :class="bemm('props-table')">
        <div :class="[bemm('props-row'), bemm('props-row', 'header')]">
          <span>{{ t('docs.common.labels.name') }}</span>
          <span>{{ t('docs.common.labels.type') }}</span>
          <span>{{ t('docs.common.labels.default') }}</span>
          <span>{{ t('docs.common.labels.details') }}</span>
        </div>

        <div
          v-for="prop in sourceDocumentation.props"
          :key="prop.name"
          :class="bemm('props-row')"
        >
          <strong :class="bemm('props-name')">
            {{ prop.name }}
            <StatusBadge
              :class="bemm('props-required')"
              :label="prop.required ? t('docs.component.required') : t('docs.component.optional')"
              :tone="prop.required ? Status.ERROR : Status.INFO"
            />
          </strong>
          <code>{{ prop.type }}</code>
          <code>{{ prop.defaultValue ?? t('docs.common.labels.none') }}</code>
          <span>{{ prop.description || t('docs.component.noPropDescription') }}</span>
        </div>
      </div>
    </Card>

    <Card v-if="sourceDocumentation.events.length > 0" :class="bemm('events-card')">
      <header :class="bemm('doc-header')">
        <h2 :class="bemm('section-title')">{{ t('docs.component.events') }}</h2>
        <Badge>{{ sourceDocumentation.events.length }}</Badge>
      </header>

      <div :class="bemm('events-table')">
        <div :class="[bemm('events-row'), bemm('events-row', 'header')]">
          <span>{{ t('docs.common.labels.name') }}</span>
          <span>{{ t('docs.common.labels.payload') }}</span>
          <span>{{ t('docs.common.labels.details') }}</span>
        </div>

        <div
          v-for="event in sourceDocumentation.events"
          :key="event.name"
          :class="bemm('events-row')"
        >
          <strong>{{ event.name }}</strong>
          <code>{{ event.payload }}</code>
          <span>{{ event.description || t('docs.component.noEventDescription') }}</span>
        </div>
      </div>
    </Card>

    <Card v-if="sourceDocumentation.slots.length > 0" :class="bemm('slots-card')">
      <header :class="bemm('doc-header')">
        <h2 :class="bemm('section-title')">{{ t('docs.component.slots') }}</h2>
        <Badge>{{ sourceDocumentation.slots.length }}</Badge>
      </header>

      <div :class="bemm('slots-table')">
        <div :class="[bemm('slots-row'), bemm('slots-row', 'header')]">
          <span>{{ t('docs.common.labels.name') }}</span>
          <span>{{ t('docs.common.labels.details') }}</span>
        </div>

        <div
          v-for="slot in sourceDocumentation.slots"
          :key="slot.name"
          :class="bemm('slots-row')"
        >
          <strong>{{ slot.name }}</strong>
          <span>{{ slot.description }}</span>
        </div>
      </div>
    </Card>

    <section v-if="compiledDocs.length > 0" :class="bemm('docs')">
      <Card
        v-for="doc in compiledDocs"
        :key="doc.path"
        :class="bemm('doc-card')"
      >
        <header :class="bemm('doc-header')">
          <h2 :class="bemm('section-title')">{{ doc.title }}</h2>
          <Badge>{{ doc.pathLabel }}</Badge>
        </header>

        <article :class="bemm('doc-content')">
          <Markdown :content="doc.content" />
        </article>
      </Card>
    </section>

    <Card v-else :class="bemm('empty-card')">
      <h2 :class="bemm('section-title')">{{ t('docs.component.documentation') }}</h2>
      <p :class="bemm('empty-copy')">{{ t('docs.component.emptyCopy') }}</p>
    </Card>
  </div>

  <div v-else :class="bemm('missing')">
    <Card :class="bemm('empty-card')">
      <h1 :class="bemm('section-title')">{{ t('docs.component.missingTitle') }}</h1>
      <p :class="bemm('empty-copy')">{{ t('docs.component.missingSummary') }}</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'

import { Badge } from '@ui-lib/components/Badge'
import { Card } from '@ui-lib/components/Card'
import { Markdown } from '../../../src/components'
import { ReferenceBadge } from '@ui-lib/components/ReferenceBadge'
import StatusBadge from '@ui-lib/components/StatusBadge/StatusBadge.vue'
import { Status } from '@ui-lib/types'

import { renderCodeBlock } from '@ui-docs/lib/codeBlock'
import { normalizeMarkdownContent } from '@ui-docs/lib/markdown'
import {
  getComponentBySlug,
  getComponentNameReplacements,
  getDocContent,
  getExampleLoader,
} from '@ui-docs/lib/componentRegistry'
import { getSourceDocumentation } from '@ui-docs/lib/sourceDocumentation'

interface Props {
  slug: string
}

const props = defineProps<Props>()

const bemm = useBemm('docs-component-page')
const { t } = useI18n()

const componentEntry = computed(() => getComponentBySlug(props.slug))

const asyncExampleComponent = computed(() => {
  const examplePath = componentEntry.value?.examplePath

  if (!examplePath) {
    return null
  }

  const loader = getExampleLoader(examplePath)

  if (!loader) {
    return null
  }

  return defineAsyncComponent(loader)
})

const sourceDocumentation = computed(() => {
  if (!componentEntry.value) {
    return {
      events: [],
      modelPath: null,
      props: [],
      slots: [],
      sourcePath: '',
      usageExample: '',
    }
  }

  return getSourceDocumentation(componentEntry.value)
})

const renderedUsageExample = computed(() => renderCodeBlock(sourceDocumentation.value.usageExample, 'vue'))

const compiledDocs = computed(() => {
  return (componentEntry.value?.docs ?? []).map((docPath) => {
    const rawContent = getDocContent(docPath) ?? t('docs.component.missingDocument')
    const normalizedContent = normalizeMarkdownContent(
      rawContent,
      getComponentNameReplacements(),
    )

    return {
      path: docPath,
      pathLabel: docPath.replace('../../../src/components/', ''),
      title: getDocTitle(docPath),
      content: normalizedContent,
    }
  })
})

function getDocTitle(path: string): string {
  const name = path.split('/').pop() ?? path

  return name.replace(/\.md$/i, '')
}
</script>

<style lang="scss">
.docs-component-page {
  --docs-component-surface: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
  --docs-component-surface-strong: color-mix(in srgb, var(--color-background), var(--color-foreground) 5%);
  --docs-component-code-background: color-mix(in srgb, var(--color-foreground), var(--color-background) 20%);
  --docs-component-code-foreground: color-mix(in srgb, var(--color-background), var(--color-foreground) 8%);
  --docs-component-border: color-mix(in srgb, var(--color-foreground), transparent 88%);
  --docs-component-muted: color-mix(in srgb, var(--color-foreground), transparent 24%);
  --docs-component-soft: color-mix(in srgb, var(--color-foreground), transparent 40%);

  display: grid;
  gap: 1.5rem;
  padding: 2rem;

  &__header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1.5rem;
  }

  &__header-copy {
    display: grid;
    gap: 0.6rem;
  }

  &__eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--docs-component-soft);
    font-size: 0.85rem;
  }

  &__title {
    margin: 0;
    font-size: clamp(2.2rem, 4vw, 3.6rem);
    line-height: 0.98;
  }

  &__summary {
    margin: 0;
    max-width: 46rem;
    line-height: 1.6;
    color: var(--docs-component-muted);
  }

  &__api-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: end;
    gap: 0.75rem;
  }

  &__example-card,
  &__usage-card,
  &__props-card,
  &__events-card,
  &__doc-card,
  &__empty-card {
    display: grid;
    gap: 1rem;
    padding: 1.2rem;
  }

  &__example-header,
  &__doc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__section-title {
    margin: 0;
    font-size: 1.15rem;
  }

  &__example-preview {
    padding: 1rem;
    border-radius: 1rem;
    background: var(--docs-component-surface);
  }

  &__docs {
    display: grid;
    gap: 1rem;
  }

  &__doc-content {
    :deep(.ui-markdown) {
      --markdown-border: var(--docs-component-border);
    }
  }

  &__code-block {
    margin: 0;
  }

  &__props-table {
    display: grid;
    gap: 0.55rem;
  }

  &__events-table {
    display: grid;
    gap: 0.55rem;
  }

  &__slots-table {
    display: grid;
    gap: 0.55rem;
  }

  &__props-row {
    display: grid;
    grid-template-columns: minmax(10rem, 1.1fr) minmax(10rem, 1fr) minmax(8rem, 0.8fr) minmax(0, 1.6fr);
    gap: 0.8rem;
    align-items: start;
    padding: 0.9rem 0;
    border-top: 1px solid var(--docs-component-border);

    &--header {
      border-top: 0;
      padding-top: 0;
      color: var(--docs-component-soft);
      font-size: var(--font-size-s);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  &__events-row {
    display: grid;
    grid-template-columns: minmax(10rem, 1fr) minmax(10rem, 1fr) minmax(0, 1.8fr);
    gap: 0.8rem;
    align-items: start;
    padding: 0.9rem 0;
    border-top: 1px solid var(--docs-component-border);

    &--header {
      border-top: 0;
      padding-top: 0;
      color: var(--docs-component-soft);
      font-size: var(--font-size-s);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  &__slots-row {
    display: grid;
    grid-template-columns: minmax(10rem, 1fr) minmax(0, 2fr);
    gap: 0.8rem;
    align-items: start;
    padding: 0.9rem 0;
    border-top: 1px solid var(--docs-component-border);

    &--header {
      border-top: 0;
      padding-top: 0;
      color: var(--docs-component-soft);
      font-size: var(--font-size-s);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  &__props-name {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  &__props-required {
    flex: 0 0 auto;
  }

  &__empty-copy {
    margin: 0;
    line-height: 1.6;
    color: var(--docs-component-muted);
  }

  &__missing {
    padding: 2rem;
  }
}

@media (max-width: 960px) {
  .docs-component-page {
    padding: 1.2rem;

    &__header {
      flex-direction: column;
      align-items: start;
    }

    &__meta {
      justify-content: start;
    }

    &__example-header,
    &__doc-header {
      flex-direction: column;
      align-items: start;
    }

    &__props-row {
      grid-template-columns: 1fr;
    }

    &__events-row {
      grid-template-columns: 1fr;
    }

    &__slots-row {
      grid-template-columns: 1fr;
    }
  }
}
</style>
