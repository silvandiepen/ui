# InputSwitch

`InputSwitch` is a segmented multi-option selector rendered as a strip of buttons. Use it when the user needs to pick one value from a small set of visible options.

## When To Use

- Switching between 2–5 named modes
- Keeping all available options visible at once
- Icon-only toolbars (alignment, formatting, view mode)
- A button-style alternative to radio inputs

## When Not To Use

- For a simple enabled/disabled state, use `InputToggle`
- For more than ~6 options, use `InputSelect`

## SwitchItem

Each option is a `SwitchItem` object:

| Property   | Type                          | Default     | Description                        |
|------------|-------------------------------|-------------|------------------------------------|
| `label`    | `string`                      | *required*  | Text displayed on the button       |
| `value`    | `string \| number \| boolean` | *required*  | Value bound via `v-model`          |
| `icon`     | `string \| null`              | `null`      | Icon name shown before the label   |
| `disabled` | `boolean`                     | `false`     | Disable this specific option       |

You can also pass plain strings — they become `{ label: string, value: string }`.

## Props

| Prop        | Type                            | Default     | Description                          |
|-------------|---------------------------------|-------------|--------------------------------------|
| `items`     | `(string \| SwitchItem)[]`      | `[]`        | Available options                    |
| `modelValue`| `string \| number \| boolean`   | `undefined` | Current value (`v-model`)            |
| `label`     | `string`                        | `''`        | Label text above the switch          |
| `color`     | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Active item color |
| `size`      | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant                         |
| `disabled`  | `boolean`                       | `false`     | Disable the entire switch            |
| `error`     | `string[]`                      | `[]`        | Error messages below the switch      |
| `required`  | `boolean`                       | `false`     | Mark as required                     |

## Events

| Event              | Payload                         | Description                |
|--------------------|---------------------------------|----------------------------|
| `update:modelValue`| `string \| number \| boolean`   | Emitted on value change    |
| `change`           | `string \| number \| boolean`   | Emitted on value change    |
| `touched`          | `boolean`                       | Emitted on interaction     |

## Examples

### With labels and icons

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIInputSwitch } from '@sil/ui'

const viewMode = ref('grid')

const items = [
  { label: 'Grid', value: 'grid', icon: 'grid' },
  { label: 'List', value: 'list', icon: 'menu' },
  { label: 'Compact', value: 'compact', icon: 'rows' },
]
</script>

<template>
  <UIInputSwitch v-model="viewMode" label="View mode" :items="items" />
</template>
```

### Icon-only

Set `label` to an empty string on each item to show only icons.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIInputSwitch } from '@sil/ui'

const align = ref('left')

const items = [
  { label: '', value: 'left', icon: 'align-left' },
  { label: '', value: 'center', icon: 'align-center' },
  { label: '', value: 'right', icon: 'align-right' },
]
</script>

<template>
  <UIInputSwitch v-model="align" label="Alignment" color="success" :items="items" />
</template>
```

### Plain strings

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIInputSwitch } from '@sil/ui'

const status = ref('active')
</script>

<template>
  <UIInputSwitch v-model="status" :items="['planned', 'active', 'done']" />
</template>
```

## Related Components

- `InputToggle` — sliding on/off switch with optional two-value labels/icons
- `InputRadio` — traditional radio button group
- `InputSelect` — dropdown for larger option sets
