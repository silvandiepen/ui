# Tabs

Reusable tabs primitives:

- `Tabs.vue`: root container that manages active pane state and navigation sync.
- `TabPane.vue`: individual pane that registers itself with the root.
- `TabNavigation.vue`: interactive tab switcher UI.

## Architecture

Shared tab state logic lives in:

- `useTabs.ts`
  - `useTabsRoot`: tab registration, activation/deactivation, `value`/`activeTab` syncing, emits.
  - `useTabPane`: pane registration lifecycle and prop sync (`id`, `title`).
- `Tabs.model.ts`
  - shared types (`TabPaneItem`, `TabNavigationItem`, `TabsRootProps`, etc.)
  - typed provide/inject key (`tabsContextKey`)

## Events

`Tabs.vue` emits:

- `input`: active tab identifier (`id` or `title`)
- `tab-click`: active tab identifier (`id` or `title`)

`TabNavigation.vue` emits:

- `input`: selected navigation item id
- `change`: `(id, item)`

## Basic Usage

```vue
<template>
	<Tabs value="overview" @input="onTabChange">
		<TabPane id="overview" title="Overview">Overview content</TabPane>
		<TabPane id="details" title="Details">Details content</TabPane>
	</Tabs>
</template>
```

## Tests

- `/Users/silvandiepen/Repositories/_arritech/thanos_hela_ui/tests/unit/Tabs.spec.ts`
- `/Users/silvandiepen/Repositories/_arritech/thanos_hela_ui/tests/unit/TabNavigation.spec.ts`
