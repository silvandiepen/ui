# TNumberPad

Legacy keypad surface for PIN entry, one-time codes, and compact numeric workflows.

## Usage

```vue
<TNumberPad
  @number="appendDigit"
  @clear="removeDigit"
  @submit="submitCode"
/>
```

## Notes

- Emits `number`, `clear`, and `submit`
- Supports shuffled layouts and multiple visual variants
- Often paired with `TPinInput` for verification-code flows
