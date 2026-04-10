// Stub implementation - remove markdown-it and turndown dependencies
// import MarkdownIt from 'markdown-it'
// import TurndownService from 'turndown'

// Simple stub implementations for markdown conversion
// In production, you would use proper markdown libraries

/**
 * Convert markdown content to HTML for the rich text editor
 * STUB: Returns markdown as-is
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return ''
  // In production, this would use markdown-it to render markdown to HTML
  return markdown
}

/**
 * Convert HTML content from the rich text editor back to markdown
 * STUB: Returns HTML as-is
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return ''
  // In production, this would use turndown to convert HTML to markdown
  return html
}

/**
 * Check if content is likely markdown (contains markdown syntax)
 */
export function isMarkdown(content: string): boolean {
  if (!content) return false
  
  // If it contains HTML tags, it's probably not markdown
  if (/<[^>]*>/.test(content)) return false
  
  // Check for common markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s/m, // Headers
    /^[\*\-\+]\s/m, // Bullet lists  
    /^\d+\.\s/m, // Numbered lists
    /__.*__/, // Bold with underscores
    /\*\*.*\*\*/, // Bold with asterisks
    /\*[^*]+\*/, // Italic (but not bold)
    /\[.*?\]\(.*?\)/, // Links
    /```/, // Code blocks
    /`[^`]+`/, // Inline code
    /^>/m, // Blockquotes
  ]
  
  // Content should have at least one markdown pattern to be considered markdown
  return markdownPatterns.some(pattern => pattern.test(content))
}