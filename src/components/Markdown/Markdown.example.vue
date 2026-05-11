<template>
  <Markdown :content="content" />
</template>

<script lang="ts" setup>
import { Markdown } from '.'

const content = [
  '# Markdown',
  '',
  'Render Markdown content with built-in typography, tables, and code blocks.',
  '',
  '## Features',
  '',
  '- Uses `nizel` under the hood',
  '- Async rendering with Vue reactivity',
  '- Safe by default (HTML stripped)',
  '',
  '```ts',
  "import { Markdown } from '@sil/ui'",
  '```',
  '',
  '| Prop | Description |',
  '| --- | --- |',
  '| `content` | Markdown source to render |',
  '| `inline` | Render inline markdown (no wrapping `<p>`) |',
  '| `html` | Allow raw HTML in markdown |',
].join('\n')
</script>
