<template>
  <component
    :is="tag"
    :class="bemm()"
    :data-test-id="testId"
    v-html="renderedContent"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useBemm } from 'bemm'

import { renderMarkdownContent, renderMarkdownInline } from './markdown'

import type { MarkdownProps } from './Markdown.model'

defineOptions({
  name: 'Markdown',
})

const props = withDefaults(defineProps<MarkdownProps>(), {
  breaks: false,
  content: '',
  html: false,
  inline: false,
  langPrefix: 'language-',
  linkify: true,
  plugins: () => [],
  tag: 'article',
  typographer: true,
})

const bemm = useBemm('ui-markdown', {
  includeBaseClass: true,
})

const renderedContent = computed(() => {
  const options = {
    breaks: props.breaks,
    highlight: props.highlight,
    html: props.html,
    langPrefix: props.langPrefix,
    linkify: props.linkify,
    plugins: props.plugins,
    typographer: props.typographer,
  }

  if (props.inline) {
    return renderMarkdownInline(props.content, options)
  }

  return renderMarkdownContent(props.content, options)
})
</script>

<style lang="scss">
.ui-markdown {
  --markdown-border: color-mix(in srgb, var(--color-foreground), transparent 88%);
  --markdown-emphasis: color-mix(in srgb, var(--color-foreground), transparent 18%);
  --markdown-inline-background: color-mix(in srgb, var(--color-background), var(--color-foreground) 5%);
  --markdown-inline-foreground: color-mix(in srgb, var(--color-foreground), transparent 8%);
  --markdown-soft: color-mix(in srgb, var(--color-foreground), transparent 42%);
  --markdown-surface: color-mix(in srgb, var(--color-background), var(--color-foreground) 3.5%);
  --markdown-surface-strong: color-mix(in srgb, var(--color-background), var(--color-foreground) 5%);
  --markdown-selection: color-mix(in srgb, var(--color-primary), transparent 82%);
  --markdown-code-keyword: color-mix(in srgb, var(--color-primary), var(--color-foreground) 26%);
  --markdown-code-string: color-mix(in srgb, var(--color-success), var(--color-foreground) 26%);
  --markdown-code-number: color-mix(in srgb, var(--color-warning), var(--color-foreground) 24%);
  --markdown-code-title: color-mix(in srgb, var(--color-tertiary), var(--color-foreground) 24%);
  --markdown-code-attribute: color-mix(in srgb, var(--color-info), var(--color-foreground) 20%);
  --markdown-code-tag: color-mix(in srgb, var(--color-quinary), var(--color-foreground) 24%);
  --markdown-code-meta: color-mix(in srgb, var(--color-secondary), var(--color-foreground) 30%);

  color: inherit;
  line-height: 1.7;

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }

  a {
    color: var(--color-primary);
    text-decoration-thickness: 0.08em;
    text-underline-offset: 0.14em;
  }

  p,
  ul,
  ol,
  blockquote,
  pre,
  table,
  hr {
    margin: 1rem 0 1.5rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 1.5rem 0 0.85rem;
    line-height: 1.15;
  }

  h1 {
    font-size: clamp(2rem, 4vw, 2.8rem);
  }

  h2 {
    font-size: clamp(1.5rem, 3vw, 2rem);
  }

  h3 {
    font-size: clamp(1.25rem, 2vw, 1.45rem);
  }

  ul,
  ol {
    padding-left: 1.4rem;
  }

  li + li {
    margin-top: 0.35rem;
  }

  blockquote {
    padding: 0.85rem 1rem;
    border-left: 3px solid color-mix(in srgb, var(--color-primary), transparent 50%);
    background: color-mix(in srgb, var(--color-primary), transparent 95%);
    color: var(--markdown-emphasis);
  }

  hr {
    border: 0;
    border-top: 1px solid var(--markdown-border);
  }

  :not(pre) > code {
    display: inline-block;
    padding: 0.1rem 0.45rem;
    border: 1px solid var(--markdown-border);
    border-radius: calc(var(--border-radius) * 0.55);
    background: var(--markdown-inline-background);
    color: var(--markdown-inline-foreground);
    font-family: var(--font-family-mono);
    font-size: 0.92em;
    line-height: 1.45;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    display: table;
    font-size: 0.98rem;
    line-height: 1.55;
  }

  thead {
    background: color-mix(in srgb, var(--color-foreground), transparent 97%);
  }

  th,
  td {
    padding: 0.8rem 0.9rem;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid var(--markdown-border);
  }

  th {
    color: var(--color-foreground);
    font-size: 0.84rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  td code,
  th code {
    white-space: nowrap;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: var(--border-radius-l);
  }

  &__code-block {
    margin: 0;
    overflow: auto;
    padding: 1rem 1.1rem;
    border: 1px solid var(--markdown-border);
    border-radius: var(--border-radius-l);
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--markdown-surface-strong), transparent 2%) 0%,
        var(--markdown-surface) 100%
      );
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-background), transparent 20%);

    &::selection,
    *::selection {
      background: var(--markdown-selection);
    }

    code.hljs {
      display: block;
      padding: 0;
      background: transparent;
      color: var(--markdown-inline-foreground);
      font-family: var(--font-family-mono);
      font-size: 0.95rem;
      line-height: 1.65;
    }
  }

  .hljs-comment,
  .hljs-quote {
    color: var(--markdown-soft);
    font-style: italic;
  }

  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-literal,
  .hljs-name,
  .hljs-section {
    color: var(--markdown-code-keyword);
  }

  .hljs-title,
  .hljs-title.class_,
  .hljs-title.class_.inherited__,
  .hljs-type,
  .hljs-built_in {
    color: var(--markdown-code-title);
  }

  .hljs-attr,
  .hljs-attribute,
  .hljs-selector-attr,
  .hljs-selector-class,
  .hljs-selector-id,
  .hljs-variable,
  .hljs-template-variable {
    color: var(--markdown-code-attribute);
  }

  .hljs-string,
  .hljs-regexp,
  .hljs-symbol,
  .hljs-bullet {
    color: var(--markdown-code-string);
  }

  .hljs-number,
  .hljs-meta,
  .hljs-meta .hljs-keyword,
  .hljs-link {
    color: var(--markdown-code-number);
  }

  .hljs-tag,
  .hljs-selector-pseudo,
  .hljs-subst {
    color: var(--markdown-code-tag);
  }

  .hljs-doctag,
  .hljs-formula {
    color: var(--markdown-code-meta);
  }
}
</style>
