# Breadcrumb

`Breadcrumb` renders a compact path trail with support for links, router targets, and action callbacks.

## When to use

- Use it near page headers where the current location has meaningful hierarchy.
- Prefer short labels so the path stays legible on smaller screens.

## Notes

- The current implementation also includes a copy-current-URL affordance.
- For app-level navigation patterns, pair it with `PlatformHeader` rather than using it as the only page navigation control.
