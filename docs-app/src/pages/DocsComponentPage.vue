<template>
  <Container v-if="componentEntry" :class="bemm()">
    <header :class="bemm('header')">
      <div :class="bemm('header-copy')">
        <p :class="bemm('eyebrow')">{{ componentEntry.category }}</p>
        <h1 :class="bemm('title')">{{ componentEntry.name }}</h1>
        <p :class="bemm('summary')">{{ componentEntry.summary }}</p>
      </div>

      <div :class="bemm('meta')">
        <StatusBadge :label="componentEntry.status" :tone="componentEntry.statusTone" />
        <ReferenceBadge
          :label="componentEntry.sourcePath"
          :copy-value="componentEntry.sourcePath"
          tooltip-text="Component source location"
        />
      </div>
    </header>

    <Card v-if="asyncExampleComponent" :class="bemm('example-card')">
      <header :class="bemm('example-header')">
        <h2 :class="bemm('section-title')">Live Example</h2>
        <Badge>rendered from .example.vue</Badge>
      </header>

      <div :class="bemm('example-preview')">
        <component :is="asyncExampleComponent" />
      </div>
    </Card>

    <Card :class="bemm('usage-card')">
      <header :class="bemm('doc-header')">
        <h2 :class="bemm('section-title')">Usage</h2>
        <Badge>root import</Badge>
      </header>

      <pre :class="bemm('code-block')"><code>{{ sourceDocumentation.usageExample }}</code></pre>
    </Card>

    <Card v-if="sourceDocumentation.props.length > 0" :class="bemm('props-card')">
      <header :class="bemm('doc-header')">
        <h2 :class="bemm('section-title')">Props</h2>
        <Badge>{{ sourceDocumentation.props.length }}</Badge>
      </header>

      <div :class="bemm('props-table')">
        <div :class="[bemm('props-row'), bemm('props-row', 'header')]">
          <span>Name</span>
          <span>Type</span>
          <span>Default</span>
          <span>Details</span>
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
              :label="prop.required ? 'required' : 'optional'"
              :tone="prop.required ? 'danger' : 'accent'"
            />
          </strong>
          <code>{{ prop.type }}</code>
          <code>{{ prop.defaultValue ?? 'none' }}</code>
          <span>{{ prop.description || 'No inline prop description yet.' }}</span>
        </div>
      </div>
    </Card>

    <Card v-if="sourceDocumentation.events.length > 0" :class="bemm('events-card')">
      <header :class="bemm('doc-header')">
        <h2 :class="bemm('section-title')">Events</h2>
        <Badge>{{ sourceDocumentation.events.length }}</Badge>
      </header>

      <div :class="bemm('events-table')">
        <div :class="[bemm('events-row'), bemm('events-row', 'header')]">
          <span>Name</span>
          <span>Payload</span>
          <span>Details</span>
        </div>

        <div
          v-for="event in sourceDocumentation.events"
          :key="event.name"
          :class="bemm('events-row')"
        >
          <strong>{{ event.name }}</strong>
          <code>{{ event.payload }}</code>
          <span>{{ event.description || 'No inline event description yet.' }}</span>
        </div>
      </div>
    </Card>

    <Card v-if="sourceDocumentation.slots.length > 0" :class="bemm('slots-card')">
      <header :class="bemm('doc-header')">
        <h2 :class="bemm('section-title')">Slots</h2>
        <Badge>{{ sourceDocumentation.slots.length }}</Badge>
      </header>

      <div :class="bemm('slots-table')">
        <div :class="[bemm('slots-row'), bemm('slots-row', 'header')]">
          <span>Name</span>
          <span>Details</span>
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

        <article
          :class="bemm('doc-content')"
          v-html="doc.html"
        />
      </Card>
    </section>

    <Card v-else :class="bemm('empty-card')">
      <h2 :class="bemm('section-title')">Documentation</h2>
      <p :class="bemm('empty-copy')">
        No markdown documentation is attached to this surface yet. The catalog entry still
        gives it a stable place in the docs app so the missing docs are visible instead of
        hidden in the tree.
      </p>
    </Card>
  </Container>

  <Container v-else :class="bemm('missing')">
    <Card :class="bemm('empty-card')">
      <h1 :class="bemm('section-title')">Unknown component</h1>
      <p :class="bemm('empty-copy')">
        The requested component does not exist in the current docs catalog.
      </p>
    </Card>
  </Container>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useBemm } from 'bemm'

import { Badge, Card, Container, ReferenceBadge, StatusBadge } from '@sil/ui'

import { renderMarkdown } from '@ui-docs/lib/markdown'
import {
  getComponentBySlug,
  getDocContent,
  getExampleLoader,
} from '@ui-docs/lib/componentRegistry'
import { getSourceDocumentation } from '@ui-docs/lib/sourceDocumentation'

interface Props {
  slug: string
}

const props = defineProps<Props>()

const bemm = useBemm('docs-component-page')

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

const compiledDocs = computed(() => {
  return (componentEntry.value?.docs ?? []).map((docPath) => {
    const rawContent = getDocContent(docPath) ?? '# Missing document'

    return {
      path: docPath,
      pathLabel: docPath.replace('../../../src/components/', ''),
      title: getDocTitle(docPath),
      html: renderMarkdown(rawContent),
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
    color: rgba(43, 36, 29, 0.6);
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
    color: rgba(43, 36, 29, 0.76);
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
    background: rgba(250, 245, 238, 0.9);
  }

  &__docs {
    display: grid;
    gap: 1rem;
  }

  &__doc-content {
    line-height: 1.7;

    h1,
    h2,
    h3 {
      margin-top: 1.4rem;
    }

    h1:first-child,
    h2:first-child,
    h3:first-child,
    p:first-child {
      margin-top: 0;
    }

    pre {
      overflow: auto;
      padding: 1rem;
      border-radius: 0.9rem;
      background: #1f1914;
      color: #fff7ef;
    }

    code {
      font-family: 'SFMono-Regular', 'Menlo', 'Monaco', monospace;
    }
  }

  &__code-block {
    overflow: auto;
    padding: 1rem;
    border-radius: 0.9rem;
    background: #1f1914;
    color: #fff7ef;
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
    border-top: 1px solid rgba(43, 36, 29, 0.08);

    &--header {
      border-top: 0;
      padding-top: 0;
      color: rgba(43, 36, 29, 0.6);
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
    border-top: 1px solid rgba(43, 36, 29, 0.08);

    &--header {
      border-top: 0;
      padding-top: 0;
      color: rgba(43, 36, 29, 0.6);
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
    border-top: 1px solid rgba(43, 36, 29, 0.08);

    &--header {
      border-top: 0;
      padding-top: 0;
      color: rgba(43, 36, 29, 0.6);
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
    color: rgba(43, 36, 29, 0.76);
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
