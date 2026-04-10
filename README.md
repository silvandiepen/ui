# @sil/ui

Shared UI package for SIL applications.

This repository is the source of truth for reusable UI primitives, shared form building blocks, feedback systems, shared styles, and neutral layout shells.

## Documentation

- Component inventory: [docs/COMPONENTS.md](./docs/COMPONENTS.md)
- AI usage and implementation guide: [AI_GUIDE.md](./AI_GUIDE.md)
- Migration plan: [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)
- Migration notes and validation log: [MIGRATION_NOTES.md](./MIGRATION_NOTES.md)

## Package Rules

- Shared code belongs here only when it is product-neutral or can be made product-neutral with props and slots.
- Product wrappers stay in the consuming app or compatibility layer.
- Prefer root imports from `@sil/ui` when the component is part of the stable shared surface.
- Use deep imports only for compatibility surfaces that are still being normalized.

## Import Examples

```ts
import { Button, Card, Field, PlatformHeader, StatusBadge } from "@sil/ui";
```

```ts
import Input from "@sil/ui/src/components/Input/Input.vue";
import Select from "@sil/ui/src/components/Select/Select.vue";
```

The deep-import pattern above is transitional. Prefer moving components to the root export surface once their API is stable across apps.
