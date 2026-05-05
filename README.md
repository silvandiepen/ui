# @sil/ui

Shared UI package for SIL applications.

This repository is the source of truth for reusable UI primitives, shared form building blocks, feedback systems, shared styles, and neutral layout shells.

## Documentation

- Local docs app: `npm run docs:dev`
- Docs production build: `npm run docs:build`
- Cloudflare Pages deployment: [docs/CLOUDFLARE_PAGES.md](./docs/CLOUDFLARE_PAGES.md)
- Component inventory: [docs/COMPONENTS.md](./docs/COMPONENTS.md)
- Vite integration: [docs/VITE_INTEGRATION.md](./docs/VITE_INTEGRATION.md)
- Component authoring guide: [docs/COMPONENT_AUTHORING.md](./docs/COMPONENT_AUTHORING.md)
- AI usage and implementation guide: [AI_GUIDE.md](./AI_GUIDE.md)
- Migration plan: [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)
- Migration notes and validation log: [MIGRATION_NOTES.md](./MIGRATION_NOTES.md)

The docs app lives in [docs-app](./docs-app) and discovers markdown documents and example components directly from the component tree. Its catalog is the current organizing layer for the shared surface while the library is still normalizing older compatibility folders.

## Release Flow

- Pushes to `main` or `master` run [release.yml](./.github/workflows/release.yml).
- Releases are published through `semantic-release`.
- Every conventional commit type used in this repo produces a release on the default branch.
- npm publishing is configured for the public scoped package `@sil/ui`.

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

## Vue/Vite Theme Setup

Install the package and Sass in the consuming app:

```sh
npm install @sil/ui sass
```

```ts
// vite.config.ts
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

The plugin injects shared component styles and generated CSS custom properties. See [docs/VITE_INTEGRATION.md](./docs/VITE_INTEGRATION.md) for theme options and `injectSharedStyles`.
