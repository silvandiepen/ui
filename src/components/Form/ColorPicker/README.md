# ColorPicker

Color token picker built on the shared `Form` input base.

## Usage

```vue
<ColorPicker
  v-model="accentColor"
  label="Accent color"
/>
```

## Notes

- Uses the shared theme color tokens as selectable values
- Emits `update:modelValue` and `change`
- Best suited for back-office tools and token-driven customization flows
