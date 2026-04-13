<template>
  <div v-if="category" :class="bemm()">
    <header :class="bemm('header')">
      <div :class="bemm('header-copy')">
        <p :class="bemm('eyebrow')">{{ t('docs.category.eyebrow') }}</p>
        <h1 :class="bemm('title')">{{ t(`docs.categories.${category.id}.label`) }}</h1>
        <p :class="bemm('summary')">{{ t(`docs.categories.${category.id}.description`) }}</p>
      </div>

      <Card :class="bemm('meta-card')">
        <strong>{{ components.length }}</strong>
        <span>{{ t('docs.category.meta') }}</span>
      </Card>
    </header>

    <section :class="bemm('grid')">
      <Card
        v-for="component in components"
        :key="component.slug"
        :class="bemm('card')"
      >
        <header :class="bemm('card-header')">
          <div :class="bemm('card-copy')">
            <RouterLink
              :class="bemm('card-link')"
              :to="{ name: 'docs-component', params: { slug: component.slug } }"
            >
              {{ component.apiName }}
            </RouterLink>
            <p :class="bemm('card-summary')">{{ component.summary }}</p>
          </div>
          <StatusBadge :label="t(`docs.common.status.${component.status}`)" :tone="component.statusTone" />
        </header>

        <dl :class="bemm('card-meta')">
          <div>
            <dt>{{ t('docs.common.labels.source') }}</dt>
            <dd>{{ component.name }}</dd>
          </div>
          <div>
            <dt>{{ t('docs.common.labels.aliases') }}</dt>
            <dd>{{ component.aliases.length > 0 ? component.aliases.join(', ') : t('docs.common.labels.none') }}</dd>
          </div>
          <div>
            <dt>{{ t('docs.common.labels.docs') }}</dt>
            <dd>{{ component.docs.length }}</dd>
          </div>
          <div>
            <dt>{{ t('docs.common.labels.example') }}</dt>
            <dd>{{ component.examplePath ? t('docs.common.labels.available') : t('docs.common.labels.missing') }}</dd>
          </div>
        </dl>
      </Card>
    </section>
  </div>

  <div v-else :class="bemm('missing')">
    <Card :class="bemm('meta-card')">
      <h1 :class="bemm('title')">{{ t('docs.category.missingTitle') }}</h1>
      <p :class="bemm('summary')">{{ t('docs.category.missingSummary') }}</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'

import { Card } from '@ui-lib/components/Card'
import { StatusBadge } from '@ui-lib/components/StatusBadge'

import { getComponentCategoryDefinitionById } from '@ui-docs/lib/componentCategories'
import { getComponentCatalog } from '@ui-docs/lib/componentRegistry'

interface Props {
  categoryId: string
}

const props = defineProps<Props>()

const bemm = useBemm('docs-category-page')
const { t } = useI18n()

const category = computed(() => getComponentCategoryDefinitionById(props.categoryId))

const components = computed(() =>
  getComponentCatalog().filter((entry) => entry.categoryId === props.categoryId),
)
</script>

<style lang="scss">
.docs-category-page {
  --docs-category-card-background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
  --docs-category-card-border: color-mix(in srgb, var(--color-foreground), transparent 88%);
  --docs-category-muted: color-mix(in srgb, var(--color-foreground), transparent 34%);
  --docs-category-soft: color-mix(in srgb, var(--color-foreground), transparent 44%);
  --docs-category-shadow: 0 1rem 2rem color-mix(in srgb, var(--color-foreground), transparent 94%);

  display: grid;
  gap: 1.5rem;
  padding: 2rem;

  &__header {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(15rem, 0.7fr);
    gap: 1rem;
  }

  &__header-copy {
    display: grid;
    gap: 0.6rem;
  }

  &__eyebrow {
    margin: 0;
    color: var(--docs-category-soft);
    font-size: var(--font-size-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title {
    margin: 0;
    font-size: clamp(2.1rem, 4vw, 3.3rem);
    line-height: 0.98;
  }

  &__summary {
    margin: 0;
    color: var(--docs-category-muted);
    line-height: 1.6;
    max-width: 46rem;
  }

  &__meta-card {
    display: grid;
    gap: 0.4rem;
    align-content: start;
    padding: 1.2rem;

    strong {
      font-size: 2rem;
    }

    span {
      color: var(--docs-category-muted);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: 1rem;
  }

  &__card {
    display: grid;
    gap: 1rem;
    padding: 1.1rem;
    border: 1px solid var(--docs-category-card-border);
    background: var(--docs-category-card-background);
    box-shadow: var(--docs-category-shadow);
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  &__card-copy {
    display: grid;
    gap: 0.35rem;
  }

  &__card-link {
    color: inherit;
    font-size: 1.05rem;
    font-weight: 700;
    text-decoration: none;
  }

  &__card-summary {
    margin: 0;
    color: var(--docs-category-muted);
    font-size: 0.94rem;
    line-height: 1.55;
  }

  &__card-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem;
    margin: 0;

    dt {
      color: var(--docs-category-soft);
      font-size: var(--font-size-xs);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    dd {
      margin: 0.2rem 0 0;
    }
  }

  &__missing {
    padding: 2rem;
  }
}

@media (max-width: 960px) {
  .docs-category-page {
    padding: 1.2rem;

    &__header {
      grid-template-columns: 1fr;
    }

    &__card-meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>
