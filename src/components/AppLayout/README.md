# AppLayout

Full-screen application shell with a resizable sidebar, top header, and optional split panel. Manages mobile sidebar toggling, sidebar width persistence, and route-based closing.

## Usage

```vue
<AppLayout :config="config" :navigation="sections">
  <template #sidebar-header>
    <Logo />
  </template>

  <template #brand>
    <Logo />
  </template>

  <template #header-actions>
    <ThemeToggle />
  </template>

  <RouterView />
</AppLayout>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `config` | `AppLayoutConfig` | `{}` | Layout configuration (sidebar, header, split) |
| `navigation` | `SidebarNavigationSection[]` | `undefined` | Sections passed to the built-in `SidebarNavigation` |
| `navigationSettingsKey` | `string` | `undefined` | Persistence key for sidebar expanded-section state |

### `AppLayoutConfig`

```ts
interface AppLayoutConfig {
  header?: {
    maxWidth?: string          // default: '88rem'
  }
  sidebar?: {
    defaultWidth?: number      // px, default: 244
    minWidth?: number          // px, default: 208
    maxWidth?: number          // px, default: 360
    minMainWidth?: number      // px, default: 640
    mobileBreakpoint?: number  // px, default: 960
    mobileWidth?: string       // CSS value, default: '80vw'
    settingsKey?: string       // localStorage key for width persistence
  }
  split?: {
    enabled?: boolean          // default: false
    breakpoint?: number        // px at which split activates, default: 1280
    defaultWidth?: number      // px, default: 480
    minWidth?: number          // px, default: 320
    minSecondaryWidth?: number // px, default: 320
    settingsKey?: string
  }
}
```

## Slots

| Slot | Description |
|---|---|
| `default` | Main content area |
| `sidebar-header` | Renders at the top of the sidebar (logo, brand mark) |
| `sidebar-footer` | Renders at the bottom of the sidebar |
| `brand` | Rendered in the header — shown on mobile always, on desktop only when the slot is provided |
| `header-actions` | Right-hand side of the header bar |
| `split` | Content for the split panel (only shown when `config.split.enabled` is true and viewport is wide enough) |

## Exposed

| Method | Description |
|---|---|
| `openSidebar()` | Programmatically open the sidebar (mobile) |
| `closeSidebar()` | Programmatically close the sidebar (mobile) |

## Mobile behaviour

Below `config.sidebar.mobileBreakpoint` (default 960 px):

- The sidebar collapses and slides in as a fixed overlay.
- A hamburger button appears in the header.
- The sidebar closes automatically on route change.

## CSS custom properties

These can be set on a wrapper element to override layout internals.

| Property | Default | Description |
|---|---|---|
| `--app-layout-sidebar-mobile-width` | `80vw` | Width of the mobile sidebar overlay (set via `config.sidebar.mobileWidth`) |

## Theming the sidebar

`AppLayout` applies no visual styles to the sidebar itself — background, padding, and border should be provided by the consuming application via a wrapper class:

```scss
.my-layout {
  .app-layout__sidebar {
    background: var(--color-background);
    border-right: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    padding: 1rem 0.75rem;
    gap: 1rem;
  }
}
```
