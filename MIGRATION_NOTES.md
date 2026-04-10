# Migration Notes

## Decisions

- `@sil/ui` remains the shared local package consumed by both `edit` and `lezu`.
- Shared-source alias helpers now live in `ui/src/vite/index.ts` so consuming apps can resolve `@/...` imports safely when they compile directly against `../ui/src`.
- Product-app popup calls in `edit` now cast popup component references to the shared popup component type to avoid `vue-tsc` recursion and excessive stack depth failures while keeping runtime behavior unchanged.

## Validation

Validation run on April 10, 2026.

### `ui`

- `npm run build`: passed
- `npm run typecheck`: passed

### `edit`

- `npm run build`: passed
- `npm run typecheck`: passed
- `npm test`: passed

### `lezu`

- `npm run build`: passed
- `npm run typecheck`: passed
