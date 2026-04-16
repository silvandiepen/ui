<template>
  <Example>
<Markdown :content="content" />
  </Example>
</template>

<script lang="ts" setup>
import { Markdown } from '.'

const content = [
  '# UIMarkdown',
  '',
  'Render Markdown content with built-in typography, tables, and code highlighting.',
  '',
  '## Features',
  '',
  '- Uses `markdown-it` under the hood',
  '- Supports custom plugins',
  '- Highlights fenced code blocks',
  '',
  '```ts',
  "import { UIMarkdown } from '@sil/ui'",
  '```',
  '',
  '| Prop | Description |',
  '| --- | --- |',
  '| `content` | Markdown source to render |',
  '| `plugins` | Optional markdown-it plugins |',
].join('\n')
</script>
