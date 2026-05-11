import { useNizel } from 'nizel'
import type { NizelCodeNode } from 'nizel'

import { renderCodeBlock } from './codeBlock'

const renderer = useNizel({
  frontmatter: false,
  template: false,
  toc: false,
  anchors: false,
  safe: false,
  elements: {
    pre: { class: 'docs-code-block' },
    code: (node) => ({
      class: node.type === 'inlineCode'
        ? undefined
        : `language-${(node as NizelCodeNode).lang ?? 'plaintext'}`,
    }),
  },
})

export interface MarkdownReplacement {
  from: string
  to: string
}

export async function renderMarkdown(markdown: string): Promise<string> {
  return renderer.html(markdown)
}

export function normalizeMarkdownContent(
  markdown: string,
  replacements: MarkdownReplacement[],
): string {
  let normalized = markdown.replace(/@tiko\/ui/g, '@sil/ui')

  for (const replacement of [...replacements].sort((left, right) => right.from.length - left.from.length)) {
    normalized = normalized.replace(
      new RegExp(`\\b${escapeRegExp(replacement.from)}\\b`, 'g'),
      replacement.to,
    )
  }

  return normalized
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
