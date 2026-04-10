# Scroller

`Scroller` is a 100% width/height scroll container with built-in scroll snapping.

## Props

- `horizontal` (`boolean`, default `false`): Enables horizontal scroll mode.
- `vertical` (`boolean`, default `false`): Enables vertical scroll mode.
- `gap` (`string`, default `var(--space-s)`): Space between snapped items.
- `height` (`number | string`, optional):
  - Number in vertical mode means: fit the first `N` items (`height=5` => first 5 items).
  - String is used as CSS height directly (e.g. `320px`, `40vh`).

## Behavior

- If `horizontal` is `true`, horizontal snapping is used.
- Otherwise vertical snapping is used.
- Children in the slot are treated as snap items.

## Types

- `/Users/silvandiepen/Repositories/_arritech/thanos_hela_ui/src/components/ui/Scroller/Scroller.model.ts`
