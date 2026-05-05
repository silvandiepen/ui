# AI Guide

## Purpose

Use `@sil/ui` as the shared UI foundation for new SIL projects.

The package should contain:

- reusable primitives
- shared form controls
- shared feedback and overlay systems
- neutral layout shells
- shared styles and tokens

The package should not contain:

- product branding
- product logos
- route-specific orchestration
- dashboard or marketing page sections
- domain workflows

## Design Rules

When a component is mostly structure plus branding:

- move the structure into `@sil/ui`
- keep the branding in an app-local wrapper
- use slots for `brand`, `nav`, `actions`, `footer`, and similar product-owned areas

Example:

- shared `PlatformHeader` in `@sil/ui`
- app-local wrapper that injects the product logo and routes

## Implementation Rules

- Use TypeScript.
- Use Vue `<script lang="ts" setup>`.
- Use `bemm`.
- Do not use `<style scoped>` in shared components.
- Write global component classes inside a stable component block.
- Keep props neutral and product-agnostic.
- Prefer CSS custom properties for color and variant behavior.
- Use `--int-<component>-*` for component-internal CSS variables and `--<component>-*` for public project overrides.
- Prefer composition over duplication.
- Reuse shared interfaces for common concepts such as navigation, actions, statuses, sizes, and color modes.
- Add tests for new composables and reusable component logic.
- Add or update documentation when a component enters the shared public surface.

## Import Rules

- Prefer root imports from `@sil/ui` for stable shared exports.
- Use deep imports only when a component is still in transition.
- In consuming apps, build product wrappers on top of shared components instead of re-implementing primitives.

## New Component Checklist

1. Confirm the component is reusable across products.
2. Check whether an existing shared primitive can be extended instead.
3. Keep the API neutral.
4. Use `bemm` classes and unscoped SCSS.
5. Add a usage document or extend the component inventory.
6. Add tests where behavior is non-trivial.
7. Export it from the correct surface:
   root export if stable
   deep import only if transitional

## Vite Integration

Vue/Vite apps should use the `@sil/ui` Vite plugin when they need shared styles and generated theme tokens:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { defineTheme, ui } from '@sil/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      theme: defineTheme({
        colors: {
          dark: '#101114',
          light: '#ffffff',
          primary: '#f40935',
        },
      }),
    }),
  ],
})
```

See [docs/VITE_INTEGRATION.md](./docs/VITE_INTEGRATION.md) for complete integration guidance.

## Component Authoring

See [docs/COMPONENT_AUTHORING.md](./docs/COMPONENT_AUTHORING.md) for the full shared component authoring rules, including class naming, unscoped styles, CSS custom properties, tests, and documentation expectations.

## Migration Rules

- Prefer conservative extraction over aggressive rewrites.
- Preserve working app behavior first.
- If two apps have different APIs for the same concept, keep a compatibility layer until one shared API is defensible.
- Document canonical choices in `MIGRATION_NOTES.md`.
