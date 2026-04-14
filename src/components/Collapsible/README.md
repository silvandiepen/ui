# Collapsible

Expandable content surface with a clickable header, optional leading icon, and a right-side disclosure indicator.

## Usage

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import { Collapsible } from '@sil/ui'

const isOpen = ref(false)
</script>

<template>
  <Collapsible
    v-model="isOpen"
    label="Advanced filters"
    icon="filter"
    toggle-icon="chevron"
    @toggle="({ isOpen }) => console.log(isOpen)"
  >
    <p>Filter content goes here.</p>
  </Collapsible>
</template>
```

## Props

- `label`: header label text.
- `icon`: optional leading icon in the header.
- `modelValue`: controlled open state.
- `defaultOpen`: initial open state for uncontrolled usage.
- `toggleIcon`: right-side indicator style, either `chevron` or `plus`.
- `disabled`: prevents header interaction.

## Events

- `update:modelValue`: emitted with the next open state.
- `toggle`: emitted whenever the state changes.
- `open`: emitted when the content opens.
- `close`: emitted when the content closes.
- `header-click`: emitted with the original click event.

## Slots

- default: collapsible content. Receives `isOpen`, `open`, `close`, and `toggle`.
- `icon`: custom leading header icon.
- `label`: custom header label content.
