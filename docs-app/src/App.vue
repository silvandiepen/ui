<template>
  <div :class="bemm()">
    <Sidebar :class="bemm('sidebar')" width="15rem">
      <template #header>
        <RouterLink :class="bemm('brand')" to="/">
          <span :class="bemm('brand-logo')" aria-hidden="true" v-html="logoSvg" />
        </RouterLink>
      </template>

      <SidebarNavigation
        :class="bemm('nav')"
        :sections="navigationSections"
        settings-key="docs-app-sidebar-navigation"
      />
    </Sidebar>

    <main :class="bemm('main')">
      <Popup />
      <PlatformHeader :class="bemm('header')">
        <template #brand>
          <RouterLink :class="bemm('header-brand')" to="/">
            <span :class="bemm('header-brand-logo')" aria-hidden="true" v-html="logoSvg" />
          </RouterLink>
        </template>

        <template #actions>
          <div :class="bemm('header-actions')">
            <div
              ref="searchRef"
              :class="bemm('search', {
                open: searchOpen,
              })"
            >
              <div :class="bemm('search-input-shell')">
                <Icon name="search" :class="bemm('search-icon')" />
                <input
                  v-model="query"
                  :class="bemm('search-input')"
                  :placeholder="t('docs.search.placeholder')"
                  type="search"
                  @focus="searchFocused = true"
                  @keydown="handleSearchKeydown"
                />
                <button
                  v-if="query"
                  :class="bemm('search-clear')"
                  type="button"
                  @click="clearSearch"
                >
                  <Icon name="close" />
                </button>
              </div>

              <div v-if="searchOpen" :class="bemm('search-panel')">
                <div :class="bemm('search-status')">{{ searchStatus }}</div>

                <RouterLink
                  v-for="result in searchResults"
                  :key="result.id"
                  :class="bemm('search-result')"
                  :to="getSearchResultTarget(result.route)"
                  @click="clearSearch"
                >
                  <span :class="bemm('search-result-kind')">
                    {{ getSearchKindLabel(result.kind) }}
                  </span>
                  <strong :class="bemm('search-result-title')">{{ result.title }}</strong>
                  <span :class="bemm('search-result-summary')">
                    {{ result.summary || result.excerpt }}
                  </span>
                </RouterLink>

                <div v-if="searchResults.length === 0" :class="bemm('search-empty')">
                  {{ t('docs.search.noResults') }}
                </div>
              </div>
            </div>

            <UILanguageSwitch
              :model-value="docsLocale"
              :options="DOCS_LANGUAGE_OPTIONS"
              display-mode="label"
              :title="t('docs.common.language.title')"
              :trigger-label="t('docs.common.language.trigger')"
              @update:model-value="setLocale"
            />
            <ThemeToggle :theme="colorMode" @toggle="toggleColorMode" />
            <Button href="https://github.com/silvandiepen" target="_blank">
              {{ t('docs.common.actions.github') }}
            </Button>
          </div>
        </template>
      </PlatformHeader>

      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'

import logoSvg from '@ui-lib/assets/logo.svg?raw'
import { Button } from '@ui-lib/components/Button'
import { Icon } from '@ui-lib/components/Icon'
import { LanguageSwitch as UILanguageSwitch } from '@ui-lib/components/LanguageSwitch'
import { PlatformHeader } from '@ui-lib/components/PlatformHeader'
import Popup from '@ui-lib/components/Feedback/Popup/Popup.vue'
import { popupService } from '@ui-lib/components/Feedback/Popup/Popup.service'
import { Sidebar } from '@ui-lib/components/Sidebar'
import { SidebarNavigation } from '@ui-lib/components/SidebarNavigation'
import { ThemeToggle } from '@ui-lib/components/ThemeToggle'
import { useSearch } from '@sil/ui'
import type { ContentRouteTarget } from '@sil/ui'

import { UI_COMPONENT_CATEGORIES } from '@ui-docs/lib/componentCategories'
import { getComponentCatalog } from '@ui-docs/lib/componentRegistry'
import { buildDocsSearchSources } from '@ui-docs/lib/docsSearchContent'
import { useColorMode } from '@ui-docs/lib/useColorMode'
import { useDocsLocale } from '@ui-docs/lib/useDocsLocale'
import { useDocsTheme } from '@ui-docs/lib/docsTheme'
import { DOCS_LANGUAGE_OPTIONS } from './i18n'

const bemm = useBemm('docs-app')
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { colorMode, toggleColorMode } = useColorMode()
const { locale: docsLocale, setLocale } = useDocsLocale()
useDocsTheme()

provide('popupService', popupService)

const searchRef = ref<HTMLElement | null>(null)
const searchFocused = ref(false)
const searchQuery = ref('')
const { hasQuery, query, results: searchResults, totalResults } = useSearch({
  limit: 8,
  query: searchQuery,
  sources: computed(() => buildDocsSearchSources(t)),
})

const searchOpen = computed(() => searchFocused.value && hasQuery.value)
const searchStatus = computed(() => (
  hasQuery.value
    ? (
      totalResults.value > 0
        ? t('docs.search.results', { count: totalResults.value })
        : t('docs.search.noResults')
    )
    : ''
))

function getSearchKindLabel(kind?: string) {
  return t(`docs.search.kinds.${kind || 'page'}`)
}

function closeSearch() {
  searchFocused.value = false
}

function clearSearch() {
  query.value = ''
  closeSearch()
}

function getSearchResultTarget(target?: ContentRouteTarget): RouteLocationRaw {
  return (target || '/') as RouteLocationRaw
}

function navigateToSearchResult(target?: ContentRouteTarget) {
  if (!target) {
    return
  }

  router.push(getSearchResultTarget(target))
  clearSearch()
}

function handleSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    clearSearch()
    return
  }

  if (event.key === 'Enter' && searchResults.value[0]?.route) {
    event.preventDefault()
    navigateToSearchResult(searchResults.value[0].route)
  }
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null

  if (!target || !searchRef.value?.contains(target)) {
    closeSearch()
  }
}

watch(() => route.fullPath, () => {
  clearSearch()
})

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})

const navigationSections = computed(() => {
  const groups = new Map<string, ReturnType<typeof getComponentCatalog>>()

  for (const item of getComponentCatalog()) {
    const groupItems = groups.get(item.categoryId) ?? []

    groupItems.push(item)
    groups.set(item.categoryId, groupItems)
  }

  return [
    {
      id: 'guides',
      label: t('docs.navigation.guides'),
      items: [
        {
          id: 'guides-getting-started',
          label: t('docs.navigation.gettingStarted'),
          to: {
            name: 'docs-guide-getting-started',
          },
        },
        {
          id: 'guides-theme-builder',
          label: t('docs.navigation.themeBuilder'),
          to: {
            name: 'docs-guide-theme-builder',
          },
        },
        {
          id: 'guides-composables',
          label: t('docs.navigation.composables'),
          to: {
            name: 'docs-guide-composables',
          },
        },
      ],
    },
    ...UI_COMPONENT_CATEGORIES
    .map((category) => ({
      id: category.id,
      items: [
        {
          id: `${category.id}-overview`,
          label: t('docs.common.labels.overview'),
          to: {
            name: 'docs-category',
            params: {
              categoryId: category.id,
            },
          },
        },
        ...(groups.get(category.id) ?? []).map((item) => ({
          id: item.slug,
          label: item.apiName,
          to: {
            name: 'docs-component',
            params: {
              slug: item.slug,
            },
          },
        })),
      ],
      label: t(`docs.categories.${category.id}.label`),
    })),
  ]
})
</script>

<style lang="scss">
.docs-app {
  --docs-shell-background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--color-primary), transparent 96%),
      transparent 24rem
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 1%) 0%,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 2.5%) 100%
    );
  --docs-shell-surface: color-mix(in srgb, var(--color-background), var(--color-foreground) 1.5%);
  --docs-shell-overlay: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
  --docs-shell-border: color-mix(in srgb, var(--color-foreground), transparent 90%);
  --docs-shell-muted: color-mix(in srgb, var(--color-foreground), transparent 40%);

  display: grid;
  grid-template-columns: 15rem minmax(0, 1fr);
  min-height: 100vh;
  background: var(--docs-shell-background);
  color: var(--color-foreground);
  overflow-x: hidden;
  height: 100vh;
  overflow-y: scroll;

  &__sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: auto;
    border-right: 1px solid var(--docs-shell-border);
    background: color-mix(in srgb, var(--color-background), transparent 2%);
    backdrop-filter: blur(8px);
    box-shadow: none;
    border-radius: 0;
    padding: 1.1rem 0.85rem;
  }

  &__brand {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: inherit;
  }

  &__brand-logo {
    width: 2.6rem;
    height: 2.6rem;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &__main {
    min-width: 0;
  }

  &__header {
    position: sticky;
    top: 0;
    z-index: 3;
    border-bottom: 1px solid var(--docs-shell-border);
    background: color-mix(in srgb, var(--docs-shell-overlay), transparent 6%);
    backdrop-filter: blur(8px);
  }

  &__header-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__search {
    position: relative;
    width: min(30rem, 46vw);
    min-width: 18rem;
  }

  &__search-input-shell {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.6rem;
    padding: 0.35rem 0.5rem 0.35rem 0.8rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
    transition:
      border-color 140ms ease,
      background-color 140ms ease,
      box-shadow 140ms ease;

    .docs-app__search--open &,
    &:focus-within {
      border-color: color-mix(in srgb, var(--color-primary), transparent 55%);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary), transparent 90%);
      background: color-mix(in srgb, var(--color-background), var(--color-foreground) 1%);
    }
  }

  &__search-icon {
    color: color-mix(in srgb, var(--color-foreground), transparent 44%);
    font-size: 0.95rem;
  }

  &__search-input {
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;

    &::placeholder {
      color: color-mix(in srgb, var(--color-foreground), transparent 52%);
    }

    &:focus {
      outline: none;
    }
  }

  &__search-clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.8rem;
    height: 1.8rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 42%);
    cursor: pointer;

    &:hover {
      background: color-mix(in srgb, var(--color-foreground), transparent 94%);
      color: inherit;
    }
  }

  &__search-panel {
    position: absolute;
    top: calc(100% + 0.6rem);
    left: 0;
    width: 100%;
    max-height: min(70vh, 34rem);
    overflow: auto;
    padding: 0.55rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    border-radius: 1rem;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 2%);
    box-shadow: 0 1.2rem 3rem color-mix(in srgb, var(--color-foreground), transparent 90%);
  }

  &__search-status {
    padding: 0.35rem 0.55rem 0.55rem;
    color: var(--docs-shell-muted);
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__search-result {
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

  &__search-result-kind {
    color: var(--docs-shell-muted);
    font-size: 0.74rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__search-result-title {
    font-size: 0.98rem;
  }

  &__search-result-summary,
  &__search-empty {
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    font-size: 0.9rem;
    line-height: 1.45;
  }

  &__search-empty {
    padding: 0.85rem;
  }

  &__header-brand {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }

  &__header-brand-logo {
    width: 1.6rem;
    height: 1.6rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    :deep(svg) {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &__nav {
    .sidebar-navigation__section {
      gap: 0.25rem;
    }

    .sidebar-navigation__section-header {
      display: block;
      padding: 0.2rem 0;
    }

    .sidebar-navigation__section-header .badge,
    .sidebar-navigation__section-description {
      display: none;
    }

    .sidebar-navigation__section-label {
      color: var(--docs-shell-muted);
      font-size: 0.68rem;
      letter-spacing: 0.09em;
    }

    .sidebar-navigation__items {
      gap: 0.1rem;
    }

    .sidebar-navigation__item {
      justify-content: flex-start;
      gap: 0.5rem;
      padding: 0.45rem 0.2rem 0.45rem 0.7rem;
      border-radius: 0;
      border-left: 2px solid transparent;
      background: transparent;
      box-shadow: none;
    }

    .sidebar-navigation__item:hover {
      transform: none;
      background: color-mix(in srgb, var(--color-foreground), transparent 97%);
      box-shadow: none;
    }

    .sidebar-navigation__item--active {
      border-left-color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary), transparent 95%);
      box-shadow: none;
    }

    .sidebar-navigation__item .status-badge,
    .sidebar-navigation__item-description {
      display: none;
    }

    .sidebar-navigation__item-label {
      font-size: 0.84rem;
      font-weight: 600;
    }
  }
}

@media (max-width: 960px) {
  .docs-app {
    grid-template-columns: 1fr;

    &__sidebar {
      position: relative;
      height: auto;
      border-right: 0;
      border-bottom: 1px solid var(--docs-shell-border);
    }

    &__search {
      width: min(100%, 24rem);
      min-width: 0;
    }
  }
}
</style>
