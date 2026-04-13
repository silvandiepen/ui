# Composables

This document tracks the shared composable surface exposed by `@sil/ui`.

## Stable Exports

- `useConfirm`: shared confirmation dialog helpers built on the popup service.
- `useI18n`: lightweight translation wrapper with a no-plugin fallback.
- `useId`: simple unique id generator for local component wiring.
- `useInput`: shared prompt dialog helpers built on the popup service.
- `useSettings`: shared UI preference store with optional `load` and `save` persistence handlers.
- `useSettingsStore`: compatibility alias for `useSettings`.
- `configureSettings`: global settings persistence configuration hook for API-backed save and load flows.
- `configureContent`: replace the shared lightweight content registry used for static search.
- `registerContentSource`: add or replace one shared searchable content source.
- `removeContentSource`: remove one shared searchable content source.
- `useContent`: normalize app-provided static content into lightweight searchable entries.
- `useSearch`: search through `useContent` entries with locale-aware normalization.

## Notes

- `useConfirm` and `useInput` require the popup service from `UIFeedback`.
- `useSettings` persists to local storage by default and only talks to remote APIs when handlers are configured.
- `useContent` and `useSearch` are intended for static or curated content, not large unbounded datasets.
