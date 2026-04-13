# Markdown

Render markdown content with a reusable `markdown-it` based component.

## Usage

```vue
<script setup lang="ts">
import { UIMarkdown } from '@sil/ui'

const content = `
# Release notes

- Added a reusable markdown surface
- Supports fenced code blocks
`
</script>

<template>
  <UIMarkdown :content="content" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `''` | Markdown source to render. |
| `tag` | `string` | `'article'` | Root element tag. |
| `inline` | `boolean` | `false` | Uses `renderInline()` instead of full block rendering. |
| `html` | `boolean` | `false` | Allows raw HTML in the markdown source. |
| `linkify` | `boolean` | `true` | Auto-detects bare URLs and turns them into links. |
| `typographer` | `boolean` | `true` | Enables smart punctuation replacements. |
| `breaks` | `boolean` | `false` | Treats single line breaks as `<br>`. |
| `langPrefix` | `string` | `'language-'` | Prefix used for fenced code block language classes. |
| `highlight` | `(code, language) => string` | built-in | Override the fenced code block renderer. |
| `plugins` | `Array<MarkdownPlugin \| MarkdownPluginRegistration>` | `[]` | Applies markdown-it plugins to the renderer instance. |

## Plugins

```ts
import type { MarkdownPlugin } from '@sil/ui'

const headingAnchors: MarkdownPlugin = (renderer) => {
  renderer.renderer.rules.paragraph_open = () => '<p data-plugin="enabled">'
}
```

```vue
<UIMarkdown :content="content" :plugins="[headingAnchors]" />
```
