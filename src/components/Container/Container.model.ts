import type { Action } from '../Actions'
import type { TestIdProps } from '../../types'

export interface ContainerProps {
  testId?: TestIdProps['testId']
  maxWidth?: string
  padding?: string
  fluid?: boolean
  title?: string
  subtitle?: string
  headerActions?: Action[]
  headerActionSize?: 'small' | 'medium' | 'large'
  footerActions?: Action[]
  showHeader?: boolean
  showFooter?: boolean
  noPadding?: boolean
  noHeaderPadding?: boolean
  noContentPadding?: boolean
  noFooterPadding?: boolean
  back?: boolean | (() => void) | string
  next?: boolean | (() => void) | string
}
