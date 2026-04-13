# useConfirm

`useConfirm()` opens shared confirmation dialogs through the popup service provided by `UIFeedback`.

## Returns

- `confirm(options)`: open a custom confirmation dialog and resolve to `true` or `false`
- `confirmDelete(itemName)`: destructive delete helper
- `confirmArchive(itemName)`: archive helper
- `confirmAction(title, message, confirmLabel?)`: lightweight generic helper

## Requirements

- The popup service must be available through the feedback plugin tree.
- Mount `UIFeedback` near the app root before calling this composable.

## Example

```ts
import { useConfirm } from '@sil/ui'

const { confirmDelete } = useConfirm()

const approved = await confirmDelete('Project Atlas')

if (approved) {
  await deleteProject()
}
```
