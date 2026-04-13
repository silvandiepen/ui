import hljs from 'highlight.js/lib/common'
import MarkdownIt from 'markdown-it'

import type {
  MarkdownCodeBlockOptions,
  MarkdownPluginRegistration,
  MarkdownRendererOptions,
} from './Markdown.model'

const DEFAULT_CODE_BLOCK_CLASS = 'ui-markdown__code-block'
const DEFAULT_LANG_PREFIX = 'language-'

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

const AUTO_DETECT_LANGUAGES = ['bash', 'css', 'javascript', 'json', 'scss', 'typescript', 'xml', 'yaml']

export function normalizeCodeBlockLanguage(language?: string | null): string {
  if (!language) {
    return 'plaintext'
  }

  return LANGUAGE_ALIASES[language.trim().toLowerCase()] ?? 'plaintext'
}

export function renderMarkdownCodeBlock(
  code: string,
  language?: string | null,
  options: MarkdownCodeBlockOptions = {},
): string {
  const normalizedLanguage = normalizeCodeBlockLanguage(language)
  const langPrefix = options.langPrefix ?? DEFAULT_LANG_PREFIX
  const blockClass = options.blockClass ?? DEFAULT_CODE_BLOCK_CLASS
  const languageClass = `${langPrefix}${normalizedLanguage}`

  if (normalizedLanguage === 'plaintext') {
    const autoDetected = highlightAutoCode(code)

    if (autoDetected) {
      return wrapHighlightedCode(
        autoDetected.value,
        autoDetected.language ?? normalizedLanguage,
        languageClass,
        blockClass,
      )
    }

    return wrapHighlightedCode(escapeHtml(code), normalizedLanguage, languageClass, blockClass)
  }

  const highlightedCode = hljs.highlight(code, {
    ignoreIllegals: true,
    language: normalizedLanguage,
  }).value

  return wrapHighlightedCode(highlightedCode, normalizedLanguage, languageClass, blockClass)
}

export function createMarkdownRenderer(options: MarkdownRendererOptions = {}) {
  const langPrefix = options.langPrefix ?? DEFAULT_LANG_PREFIX
  const highlight = options.highlight ?? ((code: string, language?: string | null) => {
    return renderMarkdownCodeBlock(code, language, {
      blockClass: DEFAULT_CODE_BLOCK_CLASS,
      langPrefix,
    })
  })

  const renderer = new MarkdownIt({
    breaks: options.breaks ?? false,
    html: options.html ?? false,
    highlight,
    langPrefix,
    linkify: options.linkify ?? true,
    typographer: options.typographer ?? true,
  })

  applyMarkdownPlugins(renderer, options.plugins ?? [])

  return renderer
}

export function renderMarkdownContent(content: string, options: MarkdownRendererOptions = {}): string {
  return createMarkdownRenderer(options).render(content)
}

export function renderMarkdownInline(content: string, options: MarkdownRendererOptions = {}): string {
  return createMarkdownRenderer(options).renderInline(content)
}

function applyMarkdownPlugins(
  renderer: any,
  plugins: NonNullable<MarkdownRendererOptions['plugins']>,
) {
  for (const plugin of plugins) {
    if (!plugin) {
      continue
    }

    if (typeof plugin === 'function') {
      renderer.use(plugin)
      continue
    }

    const registration = plugin as MarkdownPluginRegistration
    renderer.use(registration.plugin, ...(registration.options ?? []))
  }
}

function highlightAutoCode(code: string) {
  const normalizedCode = code.trim()

  if (!normalizedCode) {
    return null
  }

  return hljs.highlightAuto(code, AUTO_DETECT_LANGUAGES)
}

function wrapHighlightedCode(code: string, language: string, languageClass: string, blockClass: string): string {
  return [
    `<pre class="${blockClass}" data-language="${language}">`,
    `<code class="hljs ${languageClass}">`,
    code,
    '</code>',
    '</pre>',
  ].join('')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
