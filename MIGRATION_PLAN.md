# UI Migration Plan

## Goal

Create `./ui` as the shared local package for reusable UI across `lezu` and `edit` (`emila`) while avoiding breakage during active development.

Package target:

- `@sil/ui`

## Current Landscape

### `lezu/packages/ui`

This is the best starting base because it already contains:

- shared primitives: `Button`, `Card`, `Badge`, `Alert`, `Avatar`, `Container`, `Table`
- feedback/overlay systems: `Popup`, `Toast`, `ToolTip`
- reusable form infrastructure: `TForm`, `TInput`, `TInputText`, `TInputTextArea`, `TInputSelect`, `TInputCheckbox`, `TToggle`
- shared composables/utilities: `useConfirm`, `useId`, popup/toast utilities, event bus
- shared styles/tokens/build setup

It also contains product-specific exports that should not become part of the shared package surface as-is:

- `LezuHeader`
- `LezuHeaderUser`
- `LezuLogo`
- `LanguageSwitcher`
- `PricingCard`
- `PricingGrid`
- `useDashboardSession`
- `useI18n`

These should become thin app-local wrappers where appropriate. The shared structural part should move into `@sil/ui` when it can be expressed generically with slots and neutral props.

### `edit/packages/ui`

This package is thinner but contains reusable primitives not present in the same shape in `lezu`:

- `Field`
- `Input`
- `Select`
- `Textarea`
- `Dropdown`
- `List`
- `Notification`
- `PlatformHeader`
- `AuthModal`
- alternative `Button`, `Card`, `Popup`, `Toast`, `Tooltip`, `Icon`
- shared style tokens used broadly in `edit`

### Reusable Candidates In App Folders

`edit/apps/dashboard/src/components` contains a few clearly generic candidates:

- `StatusBadge`
- `CopyValueButton`
- `ReferenceBadge`

Conservative choice:

- move `StatusBadge`
- move `CopyValueButton`
- defer `ReferenceBadge` unless integration remains clean after the main package merge

The rest of the app-folder components in `edit` are feature screens, panels, route-level containers, or product workflows and should stay app-specific.

`lezu/apps/*/src/components` are currently product-specific and should remain in their apps.

## Shared-Structure Rule

Prefer extracting reusable structural shells into `@sil/ui` when they can be made generic.

Examples:

- a shared header shell with `brand`, `nav`, `actions`, and `secondary` slots belongs in `@sil/ui`
- `LezuHeader` should then become a thin Lezu wrapper that injects the Lezu logo, routes, and product-specific behavior

This means the migration is not limited to primitive inputs and buttons. It can also include neutral composition components when the product-specific identity stays outside the shared package.

## Migration Strategy

### Phase 1: Seed `./ui` from `lezu/packages/ui`

- copy package structure, build config, styles, composables, utils, and generic components into `./ui`
- normalize package metadata to `@sil/ui`
- keep the package buildable on its own

### Phase 2: Strip Shared Surface To Generic Exports

- keep generic exports in `ui/src/index.ts`
- do not expose Lezu-branded or Lezu-core-coupled exports from `@sil/ui`
- document every product-specific exclusion in `MIGRATION_NOTES.md`

### Phase 3: Merge In `edit` Reusable UI

Add or adapt the following from `edit/packages/ui`:

- `Field`
- `Input`
- `Select`
- `Textarea`
- `Dropdown`
- `List`
- `Notification`
- `PlatformHeader` as the shared header shell candidate
- `AuthModal`
- supporting shared types and style tokens

Overlap policy:

- prefer the more complete or less product-specific implementation
- keep both APIs temporarily when the components solve different layers of abstraction
- document the canonical choice where names overlap

### Phase 4: Lift Safe App-Level Generics From `edit`

Move into `./ui` only if still clean after integration:

- `StatusBadge`
- `CopyValueButton`

Defer unless obviously generic after merge:

- `ReferenceBadge`

### Phase 4.5: Convert Product Components To Thin Wrappers Where Safe

When a product-specific component is mostly structure plus branding:

- move the neutral structure into `@sil/ui`
- keep the product wrapper in the app or local compatibility layer
- pass logos, links, actions, and brand-specific content through props or slots

Initial candidate:

- `PlatformHeader` in `@sil/ui`
- `LezuHeader` in `lezu` as a wrapper built on top of the shared header shell

### Phase 5: Wire Local Consumption

`edit`

- switch Vite and TypeScript path aliases from local `packages/ui/src` to sibling `../ui/src`
- update imports from `@ui/...` to `@sil/ui/...`
- add a local file dependency on `../ui`

`lezu`

- add a local file dependency on `../ui`
- use a compatibility bridge in `lezu/packages/ui` so existing `@lezu/ui` imports keep working while shared exports resolve from `@sil/ui`
- keep Lezu-specific exports in the compatibility layer for now

This is the least fragile incremental path because it avoids a full import rewrite in `lezu` during the first extraction pass.

## Validation Plan

Run, at minimum, the relevant package/app checks after wiring:

- `ui`: install, build, typecheck
- `edit`: install, build, typecheck, test
- `lezu`: install, build or targeted app builds, typecheck

Record all commands and results in `./ui/MIGRATION_NOTES.md`.

## Success Criteria For This Pass

- `./ui` is the shared package repo and source of truth for neutral shared UI
- `@sil/ui` is the package name
- `edit` consumes the sibling `./ui` package locally
- `lezu` consumes the sibling `./ui` package locally through a conservative compatibility bridge
- product-specific Lezu and app workflow components stay outside the shared package surface
- migration decisions and validation results are documented
