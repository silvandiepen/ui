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
- `mobileEnabled`: enables mobile trigger mode for small viewports
- `mobileBreakpoint`: max viewport width that enables mobile trigger mode
- `mobileOpenLabel`: accessible label for the compact arrow trigger when closed
- `mobileCloseLabel`: accessible label for the compact arrow trigger when open
- `mobileDefaultOpen`: controls whether mobile mode starts open

In mobile mode, the sidebar panel is fixed to the viewport (`100vh`) and overlays the page content. It also auto-closes on route changes.
