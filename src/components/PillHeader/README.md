# PillHeader

Floating pill-shaped app header for compact product shells.

## Usage

```vue
<PillHeader
  brand-suffix="Console"
  :nav-items="navigation"
  :actions="actions"
  color-mode="auto"
  current-path="/projects/releases"
/>
```

`colorMode` defaults to `auto`, which follows the document color mode through `data-color-mode` or `data-theme`, with `prefers-color-scheme` as a fallback. Pass `light` or `dark` to keep the header fixed in that mode.

`navItems` uses the shared `NavigationItem` contract. Use `id`, `label`, `to` or `href`, optional `icon`, and nested `items` for subnavigation. Items without `to` or `href` render as buttons and can use `action`.

```ts
import type { PillHeaderNavItem } from '@sil/ui'

const navigation: PillHeaderNavItem[] = [
  {
    id: 'projects',
    label: 'Projects',
    icon: 'folder',
    to: '/projects',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        icon: 'home',
        to: '/projects',
        exact: true,
      },
      {
        id: 'releases',
        label: 'Releases',
        icon: 'rocket',
        to: '/projects/releases',
      },
    ],
  },
]
```

## Shared Navigation Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable key for rendering and test ids. |
| `label` | `string` | Visible item label. |
| `to` | `RouteLocationRaw` | Router target. |
| `href` | `string` | Anchor URL. |
| `target` | `'_blank' \| '_self'` | Link target. |
| `icon` | `IconNameOrString` | Optional icon rendered before the label. |
| `items` | `NavigationItem[]` | Nested subnavigation items. |
| `action` | `(event: MouseEvent) => void \| Promise<void>` | Click handler for button-style items or custom navigation. |
| `disabled` | `boolean` | Disables interaction. |
| `exact` | `boolean` | Requires exact path matching for active state. |
