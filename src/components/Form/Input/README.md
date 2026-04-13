# Input

Text and number input used in the shared `T*` form namespace.

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
- Prefer the newer shared primitives for brand-new surfaces when the `T*` namespace is not required
