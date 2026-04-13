export type MarkdownHighlightRenderer = (code: string, language?: string | null) => string

export type MarkdownPlugin = (renderer: any, ...options: unknown[]) => void

export interface MarkdownPluginRegistration {
  options?: unknown[]
  plugin: MarkdownPlugin
}

export interface MarkdownCodeBlockOptions {
  blockClass?: string
  langPrefix?: string
}

export interface MarkdownRendererOptions {
  breaks?: boolean
  highlight?: MarkdownHighlightRenderer
  html?: boolean
  langPrefix?: string
  linkify?: boolean
  plugins?: Array<MarkdownPlugin | MarkdownPluginRegistration>
  typographer?: boolean
}

export interface MarkdownProps extends MarkdownRendererOptions {
  content: string
  inline?: boolean
  tag?: string
}
