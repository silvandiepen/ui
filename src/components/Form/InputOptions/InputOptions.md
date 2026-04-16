# InputOptions

Multi-option input that renders a list of selectable controls. Supports three input types:

- **`checkbox`** (default) — `InputCheckbox` for each option
- **`toggle`** — `InputToggle` for each option
- **`radio`** — `InputRadio` for single-selection behavior

## Usage

```vue
<template>
  <!-- Multiple checkboxes -->
  <InputOptions v-model="selected" type="checkbox" :options="options" />

  <!-- Toggle switches -->
  <InputOptions v-model="selected" type="toggle" :options="options" />

  <!-- Single-select radio -->
  <InputOptions v-model="selected" type="radio" :options="options" />

  <!-- Single-select checkbox -->
  <InputOptions v-model="selected" type="checkbox" :multiple="false" :options="options" />
</template>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `(string \| number)[]` | `[]` | Selected values |
| `options` | `InputOption[]` | required | Array of `{ label, value, disabled?, description? }` |
| `type` | `'checkbox' \| 'toggle' \| 'radio'` | `'checkbox'` | Input control type |
| `multiple` | `boolean` | `true` | Allow multiple selections (ignored for radio) |
| `name` | `string` | auto | Shared input name (radios need matching names) |
| `disabled` | `boolean` | `false` | Disable all options |
| `direction` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction |

## Notes

- Radio mode is always single-select regardless of `multiple`.
- Set `multiple: false` with checkbox or toggle for single-select behavior without radio styling.
