# Display

`Display` is a shared namespace export, not a single Vue component. It groups small presentation helpers like chips, notes, rows, and spacing utilities.

## When to use

- Use these exports when existing product surfaces already depend on them.
- Prefer the newer top-level primitives such as `Badge`, `EmptyState`, and `Spacer` for fresh work when there is an equivalent.

## Notes

- This folder is documented as a namespace so the grouped exports stay explicit in the docs.
- The overview example highlights a few of the still-common helpers without hiding the fact that the namespace is mixed.
