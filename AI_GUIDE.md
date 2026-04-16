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
- Keep props neutral and product-agnostic.
- Prefer CSS custom properties for color and variant behavior.
- Prefer composition over duplication.
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
4. Add a usage document or extend the component inventory.
5. Add tests where behavior is non-trivial.
6. Export it from the correct surface:
   root export if stable
   deep import only if transitional

## Migration Rules

- Prefer conservative extraction over aggressive rewrites.
- Preserve working app behavior first.
- If two apps have different APIs for the same concept, keep a compatibility layer until one shared API is defensible.
- Document canonical choices in `MIGRATION_NOTES.md`.
