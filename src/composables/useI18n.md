# useI18n

`useI18n()` gives shared UI code a lightweight translation fallback without requiring every consumer to import `vue-i18n` directly.

## Returns

- `t(key, params?)`: delegates to the active app `$t` function when present
- `locale`: computed locale value from the active app instance, defaulting to `'en'`

## Behavior

- If no app-level i18n instance is available, `t()` falls back to simple `{param}` interpolation and returns the key.
- This makes the composable safe in isolated tests, Storybook-style previews, and low-dependency host apps.

## Example

```ts
import { useI18n } from '@sil/ui'

const { t, locale } = useI18n()

const title = t('projects.empty.title')
```
