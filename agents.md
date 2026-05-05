# Agent Notes

Conventions and non-obvious rules for agents working in this codebase.
See `AI_GUIDE.md` for the higher-level design and implementation rules.

## CSS Custom Property Naming

Components use a two-tier naming scheme for CSS custom properties:

### Internal properties — `--int-<component>-*`

Set by the component itself (e.g. overridden by a size or variant modifier).
Not intended for project-level customisation.

```scss
// Set defaults on the root element
--int-tab-navigation-font-size: var(--font-size);
--int-tab-navigation-pills-button-padding-y: var(--space-s);

// Override inside a modifier
&--size-small {
  --int-tab-navigation-font-size: var(--font-size-sm);
}
```

### Public properties — `--<component>-*`

The project-facing API. Consuming apps override these to customise the component.

```scss
--tab-navigation-pills-background: color-mix(in srgb, var(--color-foreground), transparent 94%);
--tab-navigation-underline-indicator-color: var(--color-primary);
```

**Rule:** if a custom property is only ever written by the component's own SCSS (e.g. set by a size modifier), prefix it with `--int-`. If it is meant to be set by a consuming project, use the bare component prefix.

## Component Authoring

- Follow `docs/COMPONENT_AUTHORING.md` for shared component structure.
- Use Vue `<script setup lang="ts">`.
- Use `bemm` for public component classes.
- Do not use `<style scoped>` in shared components.
- Keep shared components product-neutral and push branding or route-specific behavior into app-local wrappers.
- Reuse shared interfaces for navigation, actions, statuses, sizes, color names, and color modes.

## Vite Integration

- Follow `docs/VITE_INTEGRATION.md` when wiring `@sil/ui` into Vue/Vite apps.
- Use `ui()` and `defineTheme()` from `@sil/ui/vite`.
- Leave `injectSharedStyles` enabled unless the consuming app imports `@sil/ui/styles/main.scss` manually.
