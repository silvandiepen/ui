# @sil/ui Theme System Refactor Plan

> **Goal:** Replace the virtual module / `defineTheme()` / `generateThemeStyles()` theming with plain SCSS defaults that projects override in their own stylesheets. Components USE `var(--color-*)` but never DEFINE them.

**Repo:** `/home/hermes/workspace/sil-ui`
**Principle:** Ship defaults, let projects override. No virtual modules for theming.

## New Architecture

```
@sil/ui/src/styles/_defaults.scss    ← ALL :root CSS custom properties (colors, fonts, spacing, dark/light mode)
@sil/ui/src/styles/main.scss         ← base styles, includes _defaults.scss
@sil/ui/src/vite/index.ts            ← only alias resolution + @sil/ui/styles resolver
```

**Consumer setup:**
```ts
// vite.config.ts
import { ui } from '@sil/ui/vite'  // only resolves aliases
export default defineConfig({ plugins: [vue(), ui()] })

// main.ts
import '@sil/ui/styles'        // base styles with defaults
import './styles/global.scss'   // project overrides
```

```scss
// project global.scss
:root {
  --color-primary: #FF3B1F;  // override whatever you want
}
```

## Tasks

### Task 1: Create `_defaults.scss`

**Objective:** Extract all `:root` CSS custom property output into a standalone SCSS file.

**Create:** `src/styles/_defaults.scss`

Move the `:root` output from `color/color.scss` here. Include:
- All `$colors` as `--color-{name}` + `-text`, `-contrast` variants
- All `$extended-colors` as `--color-{name}`
- Dark/light mode media queries (`prefers-color-scheme`)
- `[data-theme='dark']` / `[data-theme='light']` rules
- `--color-accent` definition
- Font family variables (`--font-family`, etc.) from `generateThemeStyles` defaults
- Spacing defaults (`--space`, `--spacing`, etc.) from `base.scss`

### Task 2: Strip `:root` output from `color/color.scss`

**Modify:** `src/styles/color/color.scss`

Remove the `:root {}` block, `@media (prefers-color-scheme)` blocks, and `[data-theme]` blocks.
Keep the `@use 'functions'` and `@use 'variables'` imports (needed for SCSS internals).
The file becomes a no-output module (only provides SCSS variables/functions to other modules).

### Task 3: Include `_defaults.scss` in `main.scss`

**Modify:** `src/styles/main.scss`

Add `@use './defaults'` before other imports so defaults come first in the cascade.

### Task 4: Simplify the Vite plugin

**Modify:** `src/vite/index.ts`

- Remove `defineTheme()`, `generateThemeStyles()`, `buildThemeStyles()`, `resolveTheme()` from exports
- Remove virtual modules (`virtual:sil-ui/theme`, `virtual:sil-ui/styles.css`)
- Remove `transformIndexHtml` hook
- Remove `resolveId` and `load` hooks for virtual modules
- Keep `config()` hook for alias resolution
- Add `resolveId` to resolve `'@sil/ui/styles'` → actual `main.scss` path
- Remove `./vite/theme` export from package.json

### Task 5: Update `package.json` exports

**Modify:** `package.json`

- Remove `./vite/theme` export
- Add `'./styles'` → `'./src/styles/main.scss'` export (or let the plugin resolve it)
- Add `'./defaults'` → `'./src/styles/_defaults.scss'` for direct access
- Keep `'./vite'` for the simplified plugin

### Task 6: Update consuming projects (pietru)

**Modify:** `apps/marketing/vite.config.ts` — remove `defineTheme()`, keep `ui()`
**Modify:** `apps/marketing/src/main.ts` — replace `import 'virtual:sil-ui/theme'` with `import '@sil/ui/styles'`
**Modify:** `apps/marketing/src/styles/_tokens.scss` — add color overrides directly in `:root`

### Task 7: Update skill documentation

Update `sil-ui` and `sil-vue-projects` skills to reflect the new approach.

## Verification

1. Build @sil/ui: `cd sil-ui && npm run build`
2. In pietru: `npm link @sil/ui && npm run dev -w apps/marketing`
3. Check browser: `--color-primary` should show project's value, not default
4. Build pietru: `npm run build:marketing && grep -oE '\-\-color-primary:#[0-9a-fA-F]+' apps/marketing/dist/assets/index-*.css`
