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
            <DocsHeaderSearch />
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
import { computed, provide } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useBemm } from 'bemm'
import { useI18n } from 'vue-i18n'

import logoSvg from '@ui-lib/assets/logo.svg?raw'
import { Button } from '@ui-lib/components/Button'
import { LanguageSwitch as UILanguageSwitch } from '@ui-lib/components/LanguageSwitch'
import { PlatformHeader } from '@ui-lib/components/PlatformHeader'
import Popup from '@ui-lib/components/Feedback/Popup/Popup.vue'
import { popupService } from '@ui-lib/components/Feedback/Popup/Popup.service'
import { Sidebar } from '@ui-lib/components/Sidebar'
import { SidebarNavigation } from '@ui-lib/components/SidebarNavigation'
import { ThemeToggle } from '@ui-lib/components/ThemeToggle'

import { DocsHeaderSearch } from '@ui-docs/components/DocsHeaderSearch'
import { UI_COMPONENT_CATEGORIES } from '@ui-docs/lib/componentCategories'
import { getComponentCatalog } from '@ui-docs/lib/componentRegistry'
import { useColorMode } from '@ui-docs/lib/useColorMode'
import { useDocsLocale } from '@ui-docs/lib/useDocsLocale'
import { useDocsTheme } from '@ui-docs/lib/docsTheme'
import { DOCS_LANGUAGE_OPTIONS } from './i18n'

const bemm = useBemm('docs-app')
const { t } = useI18n()
const { colorMode, toggleColorMode } = useColorMode()
const { locale: docsLocale, setLocale } = useDocsLocale()
useDocsTheme()

provide('popupService', popupService)

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

    .platform-header__actions {
      flex: 1 1 auto;
      min-width: 0;
    }
  }

  &__header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1 1 auto;
    min-width: 0;
    gap: 0.75rem;
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
  }
}

@media (max-width: 700px) {
  .docs-app {
    &__header {
      .platform-header__inner {
        grid-template-columns: minmax(0, 1fr);
      }

      .platform-header__actions {
        grid-column: 1 / -1;
        width: 100%;
      }
    }
  }
}
</style>
