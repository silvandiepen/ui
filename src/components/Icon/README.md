# UIIcon

`UIIcon` is the shared icon renderer backed by `open-icon`.

## Usage

```vue
<script setup lang="ts">
import { UIIcon } from '@sil/ui'
import { Icons } from 'open-icon'
</script>

<template>
  <UIIcon :name="Icons.SEARCH" size="large" />
</template>
```

## Notes

- Pass either an `Icons.*` token from `open-icon` or a supported icon name string.
- `open-icon` is the source of truth for the icon set exposed by this component.
- `UIIcon` resolves the icon and renders the SVG inline so it inherits surrounding color and sizing.
