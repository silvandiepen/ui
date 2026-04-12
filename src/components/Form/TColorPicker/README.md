# TColorPicker

Color token picker built on the shared `TForm` input base.

## Usage

```vue
<TColorPicker
  v-model="accentColor"
  label="Accent color"
/>
```

## Notes

- Uses the shared theme color tokens as selectable values
- Emits `update:modelValue` and `change`
- Best suited for back-office tools and token-driven customization flows
