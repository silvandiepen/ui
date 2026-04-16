# InputSwitchOptions

`InputSwitchOptions` is the explicit segmented selector for choosing one option from a written-out list.

Use it when the user should see all choices inline and there can be more than two options.

## When To Use

- Switching between 3+ visible modes
- Choosing one state from a short written list
- Using a segmented control instead of radios or a select

## When Not To Use

- Do not use `InputSwitchOptions` for a simple on/off setting
- For boolean state, use `InputToggle`

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIInputSwitchOptions } from '@sil/ui'

const status = ref('planned')

const options = [
  { label: 'Planned', value: 'planned' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Done', value: 'done' },
]
</script>

<template>
  <UIInputSwitchOptions
    v-model="status"
    label="Project status"
    :options="options"
  />
</template>
```

## Related Components

- `InputToggle` for boolean on/off behavior
- `InputSwitch` as the legacy alias for the same segmented control behavior
- `InputRadio` for a more traditional single-choice form control
- `InputSelect` when there are too many options to show inline
