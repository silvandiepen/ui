# Card

`Card` is a shared surface container for grouped content, optional headlines, and action regions.

## When to use

- Use it for dashboard panels, settings blocks, and content sections that need a bounded visual surface.
- Prefer the built-in header and footer action props before recreating panel chrome at the app layer.

## Variants

- `default`: the standard bordered surface for most card layouts.
- `elevated`: adds a subtle shadow for more separation from the surrounding page.
- `ghost`: removes visible chrome while preserving the same structure and slots.

## Structure

- Use `title` and `description` for the standard header layout.
- Use `headerActions` for compact, icon-only controls in the header.
- Use `footerActions` for bottom-aligned commit and navigation actions.
- Switch to the `header` and `footer` slots only when the default structure is not expressive enough.

## Presentation Options

- `color` applies a tinted version of a semantic color token to the card surface.
- `featured` strengthens emphasis for highlighted plans or featured content.
- `hoverable` adds a lift-on-hover affordance for clickable or interactive cards.
- `badge` and `badgeColor` add a compact label above the card without extra wrapper markup.
- `noPadding`, `noHeaderPadding`, `noContentPadding`, and `noFooterPadding` let slotted content own its spacing when needed.

## Guidance

- Default cards should be the baseline in app layouts; only reach for `elevated` or `ghost` when hierarchy clearly benefits.
- Combine header and footer actions sparingly so the content remains the primary focus.
- If a card is fully interactive, pair `hoverable` with matching click behavior in the consuming app.
