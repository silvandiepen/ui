# useId

`useId()` returns a unique local id string for form labels, ARIA bindings, and lightweight component associations.

## Behavior

- The composable uses an incrementing counter.
- It is intentionally simple and mirrors the common `useId` pattern for environments that do not expose a built-in helper.

## Example

```ts
import { useId } from '@sil/ui'

const inputId = useId()
```
