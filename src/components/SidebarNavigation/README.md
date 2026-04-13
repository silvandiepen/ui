# SidebarNavigation

Shared grouped navigation for side panels and documentation shells.

## Usage

```vue
<SidebarNavigation :sections="sections" />
```

Each section contains an `id`, `label`, and `items`. Items can target router locations through `to` or external URLs through `href`.

Sections are collapsible by default. Use `defaultCollapsed: true` to start a section closed, or `collapsible: false` to keep a section permanently open.
Pass `settingsKey` when you want the open and closed section state to persist through the shared settings store.
