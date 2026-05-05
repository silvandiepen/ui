<template>
  <AppLayout
    class="docs-layout"
    :config="docsConfig"
    :navigation="navigationSections"
    navigation-settings-key="docs-app-sidebar-navigation"
  >
    <template #sidebar-header>
      <RouterLink :class="bemm('brand')" to="/">
        <span :class="bemm('brand-logo')" aria-hidden="true" v-html="logoSvg" />
      </RouterLink>
    </template>

    <template #sidebar-footer>
      <div :class="bemm('sidebar-footer')">
        <span :class="bemm('sidebar-footer-copy')">Resize</span>
        <div :class="bemm('sidebar-footer-keys')">
          <Kbd size="small" variant="subtle" :icon="Icons.ARROWS_ARROW_LEFT" />
          <Kbd size="small" variant="subtle" :icon="Icons.ARROWS_ARROW_RIGHT" />
        </div>
      </div>
    </template>

    <template #brand>
      <RouterLink :class="bemm('header-brand')" to="/">
        <span :class="bemm('header-brand-logo')" aria-hidden="true" v-html="logoSvg" />
      </RouterLink>
    </template>

    <template #header-actions>
      <div :class="bemm('header-actions')">
        <DocsHeaderSearch />
        <UILanguageSwitch
          :model-value="docsLocale"
          :options="DOCS_LANGUAGE_OPTIONS"
          :title="t('docs.common.language.title')"
          @update:model-value="setLocale"
        />
        <ThemeToggle :theme="colorMode" @toggle="toggleColorMode" />
        <Button href="https://github.com/silvandiepen" target="_blank">
          {{ t("docs.common.actions.github") }}
        </Button>
      </div>
    </template>

    <Popup />
    <RouterView />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useBemm } from "bemm";
import { useI18n } from "vue-i18n";

import logoSvg from "@ui-lib/assets/logo.svg?raw";
import { AppLayout } from "@ui-lib/components/AppLayout";
import type { AppLayoutConfig } from "@ui-lib/components/AppLayout";
import { Button } from "@ui-lib/components/Button";
import { Kbd } from "@ui-lib/components/Kbd";
import { LanguageSwitch as UILanguageSwitch } from "@ui-lib/components/LanguageSwitch";
import { ThemeToggle } from "@ui-lib/components/ThemeToggle";
import Popup from "@ui-lib/components/Feedback/Popup/Popup.vue";

import { DocsHeaderSearch } from "@ui-docs/components/DocsHeaderSearch";
import { UI_COMPONENT_CATEGORIES } from "@ui-docs/lib/componentCategories";
import { getComposableCatalog } from "@ui-docs/lib/composableCatalog";
import { getComponentCatalog } from "@ui-docs/lib/componentRegistry";
import { useColorMode } from "@ui-docs/lib/useColorMode";
import { useDocsLocale } from "@ui-docs/lib/useDocsLocale";
import { DOCS_LANGUAGE_OPTIONS } from "../i18n";
import { Icons } from "open-icon";

const bemm = useBemm("docs-layout");
const { t } = useI18n();
const { colorMode, toggleColorMode } = useColorMode();
const { locale: docsLocale, setLocale } = useDocsLocale();

const docsConfig: AppLayoutConfig = {
  header: {
    maxWidth: "88rem",
    variant: "float",
  },
  sidebar: {
    defaultWidth: 244,
    maxWidth: 360,
    minMainWidth: 640,
    minWidth: 208,
    mobileBreakpoint: 960,
    mobileWidth: "80vw",
    settingsKey: "docs-app-layout-sidebar-width",
  },
  split: {
    breakpoint: 1280,
    enabled: false,
  },
};

const navigationSections = computed(() => {
  const groups = new Map<string, ReturnType<typeof getComponentCatalog>>();

  for (const item of getComponentCatalog()) {
    const groupItems = groups.get(item.categoryId) ?? [];

    groupItems.push(item);
    groups.set(item.categoryId, groupItems);
  }

  const categoryIcons: Record<string, string> = {
    search: "search",
    auth: "lock",
    foundations: "layers",
    layout: "layout",
    "app-shell": "sidebar",
    forms: "edit-3",
    "data-and-navigation": "table",
    feedback: "bell",
  };

  return [
    {
      id: "guides",
      label: t("docs.navigation.guides"),
      icon: "book-open",
      items: [
        {
          id: "guides-getting-started",
          label: t("docs.navigation.gettingStarted"),
          icon: "play-circle",
          to: { name: "docs-guide-getting-started" },
        },
        {
          id: "guides-theme-builder",
          label: t("docs.navigation.themeBuilder"),
          icon: "sliders",
          to: { name: "docs-guide-theme-builder" },
        },
        {
          id: "guides-vite-integration",
          label: "Vite Integration",
          icon: "plug",
          to: {
            name: "docs-guide",
            params: { slug: "vite-integration" },
          },
        },
        {
          id: "guides-component-authoring",
          label: "Component Authoring",
          icon: "code",
          to: {
            name: "docs-guide",
            params: { slug: "component-authoring" },
          },
        },
        {
          id: "guides-form-builder",
          label: t("docs.navigation.formBuilder"),
          icon: "layout",
          to: { name: "docs-guide-form-builder" },
        },
        {
          id: "guides-foundation-types",
          label: t("docs.navigation.foundationTypes"),
          icon: "code",
          to: { name: "docs-guide-foundation-types" },
        },
      ],
    },
    {
      id: "composables",
      label: t("docs.navigation.composables"),
      icon: "zap",
      items: [
        {
          id: "composables-overview",
          label: t("docs.common.labels.overview"),
          to: { name: "docs-guide-composables" },
        },
        ...getComposableCatalog().map((entry) => ({
          id: entry.slug,
          label: entry.name,
          to: {
            name: "docs-composable",
            params: { slug: entry.slug },
          },
        })),
      ],
    },
    ...UI_COMPONENT_CATEGORIES.map((category) => ({
      id: category.id,
      icon: categoryIcons[category.id],
      items: [
        {
          id: `${category.id}-overview`,
          label: t("docs.common.labels.overview"),
          to: {
            name: "docs-category",
            params: { categoryId: category.id },
          },
        },
        ...(groups.get(category.id) ?? []).map((item) => ({
          id: item.slug,
          label: item.apiName.startsWith("UI") ? item.apiName.slice(2) : item.apiName,
          labelPrefix: item.apiName.startsWith("UI") ? "UI" : undefined,
          to: {
            name: "docs-component",
            params: { slug: item.slug },
          },
        })),
      ],
      label: t(`docs.categories.${category.id}.label`),
    })),
  ];
});
</script>

<style lang="scss">
.docs-layout {
  --docs-shell-background: radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--color-primary), transparent 96%),
      transparent 24rem
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 1%) 0%,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 2.5%) 100%
    );
  --docs-shell-surface: color-mix(
    in srgb,
    var(--color-background),
    var(--color-foreground) 1.5%
  );
  --docs-shell-overlay: color-mix(
    in srgb,
    var(--color-background),
    var(--color-foreground) 3%
  );
  --docs-shell-border: color-mix(in srgb, var(--color-foreground), transparent 90%);
  --docs-shell-muted: color-mix(in srgb, var(--color-foreground), transparent 40%);

  background: var(--docs-shell-background);
  color: var(--color-foreground);

  // Sidebar appearance — override the Sidebar component's card styling
  .app-layout__sidebar .sidebar {
    --sidebar-shadow: none;
    height: 100%;
    border: none;
    border-radius: 0;
    border-right: 1px solid var(--docs-shell-border);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 2.5%);
    padding: 1.1rem 0.85rem;
  }

  // Sidebar close button (mobile)
  .app-layout__sidebar-close {
    border-color: var(--docs-shell-border);
  }

  // Mobile: sidebar pane background + shadow
  @media (max-width: 960px) {
    .resizable__pane--start {
      background: var(--color-background);
      box-shadow: 0.5rem 0 2rem
        color-mix(in srgb, var(--color-foreground), transparent 88%);
    }

    .app-layout__sidebar .sidebar {
      border-right: none;
    }
  }

  // Brand logo in sidebar
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

  // Brand logo in header (mobile)
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

  // Header actions row
  &__header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1 1 auto;
    min-width: 0;
    gap: 0.75rem;
  }

  // Sidebar footer keyboard hint
  &__sidebar-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    color: var(--docs-shell-muted);
    font-size: 0.68rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;

    @media (max-width: 700px) {
      display: none;
    }
  }

  &__sidebar-footer-copy {
    white-space: nowrap;
  }

  &__sidebar-footer-keys {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  // SidebarNavigation overrides (docs style)
  .app-layout__nav {
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
</style>
