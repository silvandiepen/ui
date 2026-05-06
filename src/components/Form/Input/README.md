# Input

Text and number input used in the shared `T*` form namespace.

For new single-line text fields, prefer `InputText`. This component is kept for legacy `T*` form surfaces and number-spinner behavior.

## Usage

```vue
<Input
  v-model="value"
  label="Email"
  placeholder="name@example.com"
  type="email"
/>
```

## Notes

- Supports text-like input types and number fields
- Emits `update:modelValue`, `focus`, `blur`, and `enter`
- Prefer `InputText` for brand-new text fields when the `T*` namespace is not required
