# Markdown

Render markdown content using [nizel](https://nizel.hakobs.com/).

## Usage

```vue
<script setup lang="ts">
import { Markdown } from '@sil/ui'

const content = `
# Release notes

- Added a reusable markdown surface
- Supports fenced code blocks
`
</script>

<template>
  <Markdown :content="content" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `''` | Markdown source to render. |
| `tag` | `string` | `'article'` | Root element tag. |
| `inline` | `boolean` | `false` | Renders inline markdown (no wrapping `<p>`). |
| `html` | `boolean` | `false` | Allows raw HTML in the markdown source. |
| `langPrefix` | `string` | `'language-'` | Prefix used for fenced code block language classes. |
| `nizelOptions` | `NizelOptions` | `undefined` | Additional options passed to nizel. |
