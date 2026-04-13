import {
  normalizeCodeBlockLanguage as normalizeSharedCodeBlockLanguage,
  renderMarkdownCodeBlock,
} from '../../../src/components/Markdown'

import type { CodeBlockLanguage } from './codeBlock.model'

export function normalizeCodeBlockLanguage(language?: string | null): CodeBlockLanguage {
  return normalizeSharedCodeBlockLanguage(language) as CodeBlockLanguage
}

export function renderCodeBlock(code: string, language?: string | null): string {
  return renderMarkdownCodeBlock(code, language, {
    blockClass: 'docs-code-block',
    langPrefix: 'language-',
  })
}
