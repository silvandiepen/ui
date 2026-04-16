# ColorPicker

Color token picker built on the shared `Form` input base.

## Usage

```vue
<ColorPicker
  v-model="accentColor"
  label="Accent color"
  :columns="6"
/>
```

## Notes

- Uses the shared theme color tokens as selectable values
- `columns` controls how many swatches are shown per row (`number` or `'auto'`)
- Emits `update:modelValue` and `change`
- Best suited for back-office tools and token-driven customization flows
