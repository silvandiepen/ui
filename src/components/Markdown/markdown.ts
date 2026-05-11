import { useNizel } from 'nizel'
import type { NizelCodeNode } from 'nizel'

import type {
  MarkdownRendererOptions,
} from './Markdown.model'

const DEFAULT_LANG_PREFIX = 'language-'

/**
 * Creates a nizel processor instance with the given options.
 */
export function createMarkdownRenderer(options: MarkdownRendererOptions = {}) {
  const langPrefix = options.langPrefix ?? DEFAULT_LANG_PREFIX

  return useNizel({
    frontmatter: false,
    template: false,
    toc: false,
    anchors: false,
    safe: options.html !== true,
    elements: {
      pre: { class: 'ui-markdown__code-block' },
      code: (node) => ({
        class: node.type === 'inlineCode'
          ? undefined
          : langPrefix + ((node as NizelCodeNode).lang ?? 'plaintext'),
      }),
    },
    ...options.nizelOptions,
  })
}

/**
 * Renders markdown content to HTML (async).
 */
export async function renderMarkdownContent(content: string, options: MarkdownRendererOptions = {}): Promise<string> {
  const processor = createMarkdownRenderer(options)
  return processor.html(content)
}

/**
 * Renders inline markdown to HTML (async).
 * Strips the wrapping <p> tag that nizel adds to inline content.
 */
export async function renderMarkdownInline(content: string, options: MarkdownRendererOptions = {}): Promise<string> {
  const processor = createMarkdownRenderer(options)
  const html = await processor.html(content)
  // nizel wraps inline content in <p>...</p> — strip it for inline mode
  return html.replace(/^<p>([\s\S]*?)<\/p>$/, '$1')
}
