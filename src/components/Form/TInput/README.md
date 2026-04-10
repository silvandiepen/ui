# TInput

Legacy text and number input used in the older shared form namespace.

## Usage

```vue
<TInput
  v-model="value"
  label="Email"
  placeholder="name@example.com"
  type="email"
/>
```

## Notes

- Supports text-like input types and number fields
- Emits `update:modelValue`, `focus`, `blur`, and `enter`
- Prefer the newer shared primitives for brand-new surfaces when the older `T*` namespace is not required
