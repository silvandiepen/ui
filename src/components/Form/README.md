# Form

Form container component that provides submission handling, validation orchestration, and form context for nested fields and groups.

## Exports

- `UIForm` — the concrete form container with scoped slot props (`isValid`, `errors`, `submit()`, `reset()`)
- `UIFormField` — label and hint wrapper for individual controls
- `UIFormGroup` — layout group for sets of related fields
- `UIInputBase` — shared input primitive with label, error, and status support

## Guidance

- Use `UIForm` as the outer form shell for validation and submission.
- Use `UIFormField` to wrap individual inputs with labels and validation messages.
- Use `UIFormGroup` to arrange fields in columns or rows.
