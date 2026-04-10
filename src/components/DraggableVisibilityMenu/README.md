# DraggableVisibilityMenu

`DraggableVisibilityMenu` lets users reorder visible columns or sections and toggle them on and off.

## When to use

- Use it inside settings popovers and table configuration panels.
- Pass an ordered `items` array and listen to `update:items` to persist the result.

## Notes

- The current implementation uses simple move-up and move-down controls rather than pointer drag interactions.
- It is primarily intended as an internal utility surface for `DataList`.
