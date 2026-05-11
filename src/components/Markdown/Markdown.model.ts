import type { TestIdProps } from "../../types";
import type { NizelOptions, NizelPlugin } from 'nizel';

export interface MarkdownRendererOptions {
  html?: boolean
  highlight?: boolean
  langPrefix?: string
  nizelOptions?: NizelOptions
}

export interface MarkdownProps extends MarkdownRendererOptions {
  testId?: TestIdProps['testId']
  content: string
  inline?: boolean
  tag?: string
}
