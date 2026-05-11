import type { CodeBlockLanguage } from './codeBlock.model'

const LANGUAGE_ALIASES: Record<string, string> = {
  css: 'css',
  html: 'xml',
  javascript: 'javascript',
  js: 'javascript',
  json: 'json',
  md: 'plaintext',
  plaintext: 'plaintext',
  scss: 'scss',
  shell: 'bash',
  sh: 'bash',
  ts: 'typescript',
  typescript: 'typescript',
  vue: 'xml',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
  zsh: 'bash',
}

export function normalizeCodeBlockLanguage(language?: string | null): CodeBlockLanguage {
  if (!language) return 'plaintext'
  return (LANGUAGE_ALIASES[language.trim().toLowerCase()] ?? 'plaintext') as CodeBlockLanguage
}

export function renderCodeBlock(code: string, language?: string | null): string {
  const normalizedLanguage = normalizeCodeBlockLanguage(language)
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  return [
    `<pre class="docs-code-block" data-language="${normalizedLanguage}">`,
    `<code class="language-${normalizedLanguage}">`,
    escaped,
    '</code>',
    '</pre>',
  ].join('')
}
