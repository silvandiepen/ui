# UI Migration Plan

## Goal

Create `./ui` as the shared local package for reusable UI across consuming apps while avoiding breakage during active development.

Package target:

- `@sil/ui`

## Current Landscape

### Shared UI Package (`@sil/ui`)

The shared package now contains:

- shared primitives: `Button`, `Card`, `Badge`, `Alert`, `Avatar`, `Container`, `Table`
- feedback/overlay systems: `Popup`, `Toast`, `ToolTip`
- reusable form infrastructure: `TForm`, `TInput`, `TInputText`, `TInputTextArea`, `TInputSelect`, `TInputCheckbox`, `TToggle`
- layout shells: `PlatformHeader`, `FloatingHeader`
- user components: `HeaderUser`
- pricing components: `PricingCard`, `PricingGrid`
- shared composables/utilities: `useConfirm`, `useId`, `useSessionCheck`, popup/toast utilities, event bus
- shared styles/tokens/build setup

### Product-Specific Components

Product-specific branding and routing should remain in consuming apps as thin wrappers on top of shared components:

- Brand logos and wordmarks
- App-specific header wrappers (using `PlatformHeader` or `FloatingHeader` with brand slots)
- App-specific routing and navigation orchestration

## Shared-Structure Rule

Prefer extracting reusable structural shells into `@sil/ui` when they can be made generic.

Examples:

- a shared header shell with `brand`, `nav`, `actions`, and `secondary` slots belongs in `@sil/ui`
- app-specific wrappers inject the brand logo, routes, and product-specific behavior

This means the migration is not limited to primitive inputs and buttons. It can also include neutral composition components when the product-specific identity stays outside the shared package.

## Validation Plan

Run, at minimum, the relevant package/app checks after wiring:

- `ui`: install, build, typecheck
- consuming apps: install, build or targeted app builds, typecheck

Record all commands and results in `./ui/MIGRATION_NOTES.md`.

## Success Criteria

- `./ui` is the shared package repo and source of truth for neutral shared UI
- `@sil/ui` is the package name
- product-specific branding stays outside the shared package surface
- migration decisions and validation results are documented
