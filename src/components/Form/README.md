# Form

`UIForms` is the namespace export for the shared `T*` form system. It is not the same thing as `UIForm`.

## `UIForms` vs `UIForm`

- `UIForms` is the grouped namespace export. Use it when you want namespaced access such as `UIForms.TInputText`, `UIForms.TInputSelect`, or `UIForms.TFormField`.
- `UIForm` is the concrete form container component exported from that namespace. It is the actual wrapper that owns submission, validation, and form context.

## Scope

- Namespace exports for `TForm`, `TInput`, `TToggle`, `TNumberPad`, `TPinInput`, and related field controls.
- Alternate aliases used by existing app surfaces.
- Shared form building blocks that still back several existing products.

## Guidance

- Reach for `UIForm` when you want the actual form shell.
- Reach for `UIForms` when you want to browse or import multiple related form primitives from one namespace.
- Use the nested docs pages for the concrete controls; this root page is only the namespace overview.
