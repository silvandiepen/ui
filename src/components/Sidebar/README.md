# Sidebar

Shared vertical layout surface for navigation, contextual metadata, and docs side panels.

## Usage

```vue
<Sidebar title="Navigation" subtitle="Shared component docs">
  <SidebarNavigation :sections="sections" />
</Sidebar>
```

## Props

- `title`: optional heading text
- `subtitle`: optional supporting copy below the title
- `sticky`: keeps the sidebar pinned while the page scrolls
- `width`: custom sidebar width
