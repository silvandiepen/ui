# Migration Notes

## Decisions

- `@sil/ui` remains the shared local package consumed by consuming apps.
- Shared-source alias helpers now live in `ui/src/vite/index.ts` so consuming apps can resolve `@/...` imports safely when they compile directly against `../ui/src`.
- Product-app popup calls now cast popup component references to the shared popup component type to avoid `vue-tsc` recursion and excessive stack depth failures while keeping runtime behavior unchanged.
- Product-specific Lezu components have been unbranded and moved into `@sil/ui` as generic components:
  - `LezuHeader` → `FloatingHeader`
  - `LezuHeaderUser` → `HeaderUser`
  - `LezuLogo` → removed (brand-specific SVG wordmark)
  - `PricingCard` → generic `PricingCard` with local types (no `@lezu/core` dependency)
  - `PricingGrid` → generic `PricingGrid` with local types (no `@lezu/core` dependency)
  - `useDashboardSession` → `useSessionCheck` composable with config-based URL building
  - `LanguageSwitcher` → removed (redundant with existing `LanguageSwitch`)

## Validation

Validation run on April 10, 2026.

### `ui`

- `npm run build`: passed
- `npm run typecheck`: passed

### `edit`

- `npm run build`: passed
- `npm run typecheck`: passed
- `npm test`: passed
