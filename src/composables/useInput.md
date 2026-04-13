# useInput

`useInput()` opens a shared prompt dialog and resolves with the entered value or `null`.

## Returns

- `input(options)`: open a configured input dialog
- `prompt(title, message?)`: simple text prompt
- `promptWithValidation(title, validate, message?)`: prompt with inline validation

## Requirements

- The popup service must be available through the feedback plugin tree.
- Mount `UIFeedback` near the app root before calling this composable.

## Example

```ts
import { useInput } from '@sil/ui'

const { promptWithValidation } = useInput()

const projectName = await promptWithValidation(
  'Rename project',
  (value) => value.trim().length > 0 || 'Name is required',
)
```
