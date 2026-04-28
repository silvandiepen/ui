<template>
  <div
    :class="bemm()"
    :data-test-id="testId"
  >
    <div
      v-if="statusLabel"
      :class="bemm('status')"
      :data-test-id="getTestId(props.testId, 'status')"
    >{{ statusLabel }}</div>

    <template v-if="hasQuery && normalizedResults.length > 0">
      <template v-for="result in normalizedResults" :key="result.id">
        <slot
          name="result"
          :result="result"
          :selectResult="() => emit('select', result)"
          :to="resolveResultTarget(result)"
        >
          <component
            :is="resolveResultTarget(result) ? RouterLink : 'div'"
            :class="bemm('result')"
            :to="resolveResultTarget(result)"
            :data-test-id="getTestId(props.testId, `result-${result.id}`)"
            @click="emit('select', result)"
          >
            <span
              :class="bemm('result-kind')"
              :data-test-id="getTestId(props.testId, `result-${result.id}-kind`)"
            >
              {{ getKindLabel(result.kind) }}
            </span>
            <strong
              :class="bemm('result-title')"
              :data-test-id="getTestId(props.testId, `result-${result.id}-title`)"
            >{{ result.title }}</strong>
            <span
              :class="bemm('result-summary')"
              :data-test-id="getTestId(props.testId, `result-${result.id}-summary`)"
            >
              {{ result.summary || result.excerpt }}
            </span>
          </component>
        </slot>
      </template>
    </template>

    <div
      v-else-if="!hasQuery && readyLabel"
      :class="bemm('empty')"
      :data-test-id="getTestId(props.testId, 'ready')"
    >
      {{ readyLabel }}
    </div>

    <div
      v-else-if="hasQuery && emptyLabel"
      :class="bemm('empty')"
      :data-test-id="getTestId(props.testId, 'empty')"
    >
      {{ emptyLabel }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { useBemm } from 'bemm'

import type { SearchResult } from '../../composables'

import type { SearchResultsEmits, SearchResultsProps } from './SearchResults.model'
import { getTestId } from '../../utils/testId'

defineOptions({
  name: 'SearchResults',
})

const props = withDefaults(defineProps<SearchResultsProps>(), {
  emptyLabel: '',
  hasQuery: false,
  readyLabel: '',
  results: () => [],
  statusLabel: '',
})

const emit = defineEmits<SearchResultsEmits>()

const bemm = useBemm('search-results')
const normalizedResults = computed(() => props.results ?? [])

function resolveResultTarget(result: SearchResult): RouteLocationRaw | undefined {
  return props.resolveTo?.(result) ?? (result.route as RouteLocationRaw | undefined)
}

function getKindLabel(kind?: string) {
  if (props.resolveKindLabel) {
    return props.resolveKindLabel(kind)
  }

  return normalizeKindLabel(kind)
}

function normalizeKindLabel(kind?: string) {
  const resolvedKind = kind || 'page'

  return resolvedKind
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}
</script>

<style lang="scss">
.search-results {
  display: grid;
  gap: 0.2rem;

  &__status {
    padding: 0.35rem 0.55rem 0.55rem;
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__result {
    display: grid;
    gap: 0.25rem;
    padding: 0.7rem 0.8rem;
    border-radius: 0.8rem;
    color: inherit;
    text-decoration: none;

    &:hover {
      background: color-mix(in srgb, var(--color-primary), transparent 94%);
    }
  }

  &__result-kind {
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
    font-size: 0.74rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__result-title {
    font-size: 0.98rem;
  }

  &__result-summary,
  &__empty {
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    font-size: 0.9rem;
    line-height: 1.45;
  }

  &__empty {
    padding: 0.85rem;
  }
}
</style>
