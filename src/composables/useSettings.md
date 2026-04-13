# useSettings

`useSettings()` manages shared UI preference state such as table sort order, column layouts, per-page values, sidebar sections, and custom colors.

By default it persists to local storage only. Remote persistence is opt-in through `configureSettings()`.

## Returns

- The same getter and setter methods exposed by `useSettingsStore()`
- `hydrate()`: load external state from configured handlers and merge it into the current store
- `whenSaved()`: wait for the latest async save handler to finish
- `clearAll()`: reset the in-memory store and remove the local storage entry
- `getState()`: return a cloned snapshot of the current settings state

## Remote Persistence

Use `configureSettings()` once during app startup when you want to plug in API-backed persistence.

```ts
import { configureSettings } from '@sil/ui'

configureSettings({
  load: async () => {
    const response = await fetch('/api/ui-settings')
    return response.ok ? await response.json() : null
  },
  save: async (state, context) => {
    await fetch('/api/ui-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context,
        state,
      }),
    })
  },
})
```

## Example

```ts
import { useSettings } from '@sil/ui'

const settings = useSettings()

await settings.hydrate()

settings.setPerPage('projects-table', 50)
await settings.whenSaved()
```

## Notes

- `useSettingsStore()` remains available as a compatibility alias.
- Local storage stays enabled even when custom handlers are configured.
- Save handlers are fire-and-forget from setter calls, so `whenSaved()` is the safe point for tests and explicit sync flows.
