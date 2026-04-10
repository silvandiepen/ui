# DataList

`DataList.vue` is the shared data grid primitive used by table wrappers.

## Features

- Configurable typed columns (`DataListColumn`)
- Row selection with header select-all
- Per-row actions (`contextMenuItems`) via sticky actions column
- Bulk actions (`selectionActions`) shown through the global Toolbar shell when rows are selected
- Sort events, pagination wiring, column visibility controls, and header drag-resize handles

## API Types

- `/Users/silvandiepen/Repositories/_arritech/thanos_hela_ui/src/components/ui/DataList/DataList.model.ts`

## Composables

- `/Users/silvandiepen/Repositories/_arritech/thanos_hela_ui/src/components/ui/DataList/useDataList.ts`
- `/Users/silvandiepen/Repositories/_arritech/thanos_hela_ui/src/components/ui/DataList/useDataListLayout.ts`
- `/Users/silvandiepen/Repositories/_arritech/thanos_hela_ui/src/components/ui/DataList/useDataListInteractions.ts`

## Utilities

- `/Users/silvandiepen/Repositories/_arritech/thanos_hela_ui/src/components/ui/DataList/DataList.utils.ts`
- `/Users/silvandiepen/Repositories/_arritech/thanos_hela_ui/src/components/ui/DataList/DataList.layout.ts`

All DataList utility/composable behavior is covered by unit tests in `/Users/silvandiepen/Repositories/_arritech/thanos_hela_ui/tests/unit`.
