# InputToggle

`InputToggle` is a sliding on/off switch. It toggles between two states — either a simple boolean (`true`/`false`) or two custom values with optional labels and icons shown on each side.

By default it's a plain boolean toggle with no side labels.

## ToggleItem

When using custom values, pass exactly two items via the `items` prop:

| Property | Type                            | Default     | Description                      |
|----------|---------------------------------|-------------|----------------------------------|
| `label`  | `string`                        | *required*  | Text shown beside the switch     |
| `value`  | `boolean \| string \| number`   | *required*  | Value bound via `v-model`        |
| `icon`   | `string \| null`                | `null`      | Icon name shown beside the label |

## Props

| Prop          | Type                                                            | Default      | Description                         |
|---------------|-----------------------------------------------------------------|--------------|-------------------------------------|
| `modelValue`  | `boolean \| string \| number`                                   | `false`      | Current value (`v-model`)           |
| `items`       | `[ToggleItem, ToggleItem]`                                      | `undefined`  | Two-value config with labels/icons  |
| `label`       | `string`                                                        | `''`         | Label text above the toggle         |
| `description` | `string`                                                        | `''`         | Description below the label         |
| `color`       | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error'`| `'primary'`  | Active state color                  |
| `size`        | `'small' \| 'medium' \| 'large'`                                | `'medium'`   | Size variant                        |
| `disabled`    | `boolean`                                                       | `false`      | Disable the toggle                  |
| `error`       | `string[]`                                                      | `[]`         | Error messages below the toggle     |
| `required`    | `boolean`                                                       | `false`      | Mark as required                    |
| `name`        | `string`                                                        | `undefined`  | Name attribute for form submission  |

## Events

| Event              | Payload                         | Description             |
|--------------------|---------------------------------|-------------------------|
| `update:modelValue`| `boolean \| string \| number`   | Emitted on value change |
| `change`           | `boolean \| string \| number`   | Emitted on value change |
| `touched`          | `boolean`                       | Emitted on interaction  |

## Examples

### Boolean (default)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIInputToggle } from '@sil/ui'

const enabled = ref(false)
</script>

<template>
  <UIInputToggle v-model="enabled" label="Enable notifications" />
</template>
```

### With two custom values and icons

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIInputToggle } from '@sil/ui'

const theme = ref('light')

const items = [
  { label: 'Light', value: 'light', icon: 'sun' },
  { label: 'Dark', value: 'dark', icon: 'moon' },
]
</script>

<template>
  <UIInputToggle v-model="theme" label="Theme" color="secondary" :items="items" />
</template>
```

### Icon-only sides

Set `label` to an empty string to show only icons beside the switch.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIInputToggle } from '@sil/ui'

const locked = ref('public')

const items = [
  { label: '', value: 'public', icon: 'globe' },
  { label: '', value: 'private', icon: 'lock' },
]
</script>

<template>
  <UIInputToggle v-model="locked" label="Visibility" :items="items" />
</template>
```

## Related Components

- `InputSwitch` — multi-option button strip (2+ items)
- `InputCheckbox` — traditional checkbox for forms
