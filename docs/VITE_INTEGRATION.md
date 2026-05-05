# Vite Integration

Use the `@sil/ui` Vite plugin in Vue/Vite applications when the app should receive shared styles and a generated theme from one configuration point.

## Vue/Vite Setup

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
          secondary: '#2563eb',
          success: '#16a34a',
          warning: '#f59e0b',
          error: '#dc2626',
          info: '#0ea5e9',
        },
        fonts: {
          body: 'Inter, system-ui, sans-serif',
          heading: 'Manrope, Inter, system-ui, sans-serif',
          mono: '"SF Mono", Consolas, monospace',
        },
        variables: {
          '--border-radius': '0.5rem',
          '--space': '1rem',
        },
      }),
    }),
  ],
})
```

The plugin injects a virtual module script into `index.html`. That virtual module imports the generated theme stylesheet so Vite includes the CSS in the normal dev and production build graph.

## Shared Styles

By default, the plugin injects both:

- `src/styles/main.scss`, which contains the shared component styles.
- A generated `:root` theme block from the `theme` option.

Use `injectSharedStyles: false` only when the app already imports the shared stylesheet manually.

```ts
import { defineConfig } from 'vite'
import { ui } from '@sil/ui/vite'

export default defineConfig({
  plugins: [
    ui({
      injectSharedStyles: false,
    }),
  ],
})
```

If `injectSharedStyles` is disabled, the app must import one of the exported style entry points:

```ts
import '@sil/ui/styles/main.scss'
```

## Theme Tokens

`defineTheme()` accepts `colors`, `palette`, `fonts`, and arbitrary CSS custom properties through `variables`.

Color tokens generate the base token and derived text/contrast/tint/shade tokens:

```css
--color-primary
--color-primary-text
--color-primary-contrast
--color-primary-light
--color-primary-dark
```

Components should consume these tokens through CSS custom properties instead of hard-coded color values.

## App Requirements

- Use Vue 3 and Vite.
- Install `sass`; the shared stylesheet and generated theme entry are SCSS-based.
- Add `@sil/ui/vite` to `vite.config.ts`.
- Prefer root imports from `@sil/ui` for stable components.
- Do not manually duplicate the shared stylesheet when `injectSharedStyles` is left at its default.
- Keep product-specific tokens in the app's theme config rather than in shared components.

## Integration Test Coverage

The plugin has integration tests in `src/vite/index.test.ts`. They build a temporary Vue/Vite app with the real Vite build API and verify that:

- Generated theme CSS is emitted.
- Shared component styles are emitted by default.
- `injectSharedStyles: false` keeps theme variables but omits shared component styles.
