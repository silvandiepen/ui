# Card

`Card` is a shared surface container for grouped content, optional headlines, and action regions.

## When to use

- Use it for dashboard panels, settings blocks, and content sections that need a bounded visual surface.
- Prefer the built-in header and footer action props before recreating panel chrome at the app layer.

## Notes

- `variant`, `badge`, `color`, and `hoverable` cover most presentation changes without requiring custom wrappers.
- Slots remain available for fully custom header and footer layouts when the standard structure is not enough.
