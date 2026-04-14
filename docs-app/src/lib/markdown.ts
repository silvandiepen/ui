import { createMarkdownRenderer } from '../../../src/components/Markdown'

import { renderCodeBlock } from './codeBlock'

const renderer = createMarkdownRenderer({
  highlight(code: string, language?: string | null) {
    return renderCodeBlock(code, language)
  },
})

export interface MarkdownReplacement {
  from: string
  to: string
}

export function renderMarkdown(markdown: string): string {
  return renderer.render(markdown)
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
