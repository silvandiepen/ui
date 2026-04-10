# TPinInput

Legacy PIN and verification-code input from the older shared form namespace.

## Usage

```vue
<TPinInput
  v-model="code"
  :length="6"
  auto-submit
  @complete="verifyCode"
/>
```

## Notes

- Emits `update:modelValue`, `change`, `complete`, `focus`, and `blur`
- Supports masked or visible digits
- Often combined with `TNumberPad` on touch-first verification flows
