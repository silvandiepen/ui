import { useNizel } from 'nizel'
import type { NizelCodeNode, NizelPlugin } from 'nizel'

import type {
  MarkdownRendererOptions,
} from './Markdown.model'

const DEFAULT_LANG_PREFIX = 'language-'

/** Cached plugins — built once, reused across renders. */
let cachedPlugins: NizelPlugin[] | null = null
let cachedPluginsPromise: Promise<NizelPlugin[]> | null = null

/**
 * Builds the nizel plugin list (cached).
 * If nizel-plugin-shiki is available, it will be loaded for code highlighting.
 */
function getPlugins(options: MarkdownRendererOptions): NizelPlugin[] | Promise<NizelPlugin[]> {
  if (options.highlight === false) return []

  if (cachedPlugins) return cachedPlugins
  if (cachedPluginsPromise) return cachedPluginsPromise

  cachedPluginsPromise = (async () => {
    try {
      const { shikiPlugin, createJavaScriptShikiHighlighter } = await import('nizel-plugin-shiki/javascript')

      const highlighter = await createJavaScriptShikiHighlighter({
        themes: ['github-dark', 'github-light'],
        defaultLang: 'plaintext',
      })

      cachedPlugins = [shikiPlugin({ highlighter })]
      return cachedPlugins
    }
    catch {
      // nizel-plugin-shiki not installed — skip highlighting
      cachedPlugins = []
      return cachedPlugins
    }
  })()

  return cachedPluginsPromise
}

/**
 * Creates a nizel processor instance with the given options.
 */
export async function createMarkdownRenderer(options: MarkdownRendererOptions = {}) {
  const langPrefix = options.langPrefix ?? DEFAULT_LANG_PREFIX
  const plugins = await getPlugins(options)

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
    plugins,
    ...options.nizelOptions,
  })
}

/**
 * Renders markdown content to HTML (async).
 */
export async function renderMarkdownContent(content: string, options: MarkdownRendererOptions = {}): Promise<string> {
  const processor = await createMarkdownRenderer(options)
  return processor.html(content)
}

/**
 * Renders inline markdown to HTML (async).
 * Strips the wrapping <p> tag that nizel adds to inline content.
 */
export async function renderMarkdownInline(content: string, options: MarkdownRendererOptions = {}): Promise<string> {
  const processor = await createMarkdownRenderer(options)
  const html = await processor.html(content)
  // nizel wraps inline content in <p>...</p> — strip it for inline mode
  return html.replace(/^<p>([\s\S]*?)<\/p>$/, '$1')
}
