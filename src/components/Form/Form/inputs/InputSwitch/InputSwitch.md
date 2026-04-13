# InputSwitch

`InputSwitch` is a segmented multi-option selector. It is not a boolean on/off toggle.

For new work, prefer `InputSwitchOptions`, which makes the multi-option behavior explicit in the API name.

Use it when the user needs to choose one value from a small set of visible options such as view mode, density, or status filters.

## When To Use

- Switching between 2-5 named modes
- Keeping all available options visible
- Using a button-style alternative to radio inputs

## When Not To Use

- Do not use `InputSwitch` for a simple enabled/disabled state
- For boolean on/off settings, use `InputToggle`
- Prefer `InputSwitchOptions` when you want the segmented selector API to be explicit

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIInputSwitch } from '@sil/ui'

const viewMode = ref('grid')

const options = [
  { label: 'Grid', value: 'grid' },
  { label: 'List', value: 'list' },
  { label: 'Compact', value: 'compact' },
]
</script>

<template>
  <UIInputSwitch
    v-model="viewMode"
    label="View mode"
    :options="options"
  />
</template>
```

## Related Components

- `InputToggle` for boolean on/off behavior
- `InputSwitchOptions` as the preferred explicit name for this segmented control pattern
- `InputRadio` for a more traditional single-choice form control
- `InputSelect` when there are too many options to show inline
