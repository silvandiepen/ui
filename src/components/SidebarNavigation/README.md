# SidebarNavigation

Shared grouped navigation for side panels and documentation shells.

## Usage

```vue
<SidebarNavigation :sections="sections" />
```

Each section contains an `id`, `label`, and `items`. Items can target router locations through `to` or external URLs through `href`.
