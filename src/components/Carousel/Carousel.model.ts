export type CarouselItemsToShow = number | Partial<Record<'default' | 's' | 'm' | 'l' | 'xl', number>>

export type CarouselNavigationPosition = 'inside' | 'outside' | 'overlay'
export type CarouselIndicatorsPosition = 'inside' | 'outside'
export type CarouselSnapAlign = 'start' | 'center' | 'end'

export interface CarouselProps {
  itemsToShow?: CarouselItemsToShow
  itemsToScroll?: number
  gap?: string
  showNavigation?: boolean
  showIndicators?: boolean
  navigationPosition?: CarouselNavigationPosition
  indicatorsPosition?: CarouselIndicatorsPosition
  autoplay?: boolean
  autoplayInterval?: number
  pauseOnHover?: boolean
  loop?: boolean
  snapAlign?: CarouselSnapAlign
  height?: string
  vertical?: boolean
}

export interface CarouselEmits {
  (e: 'slide', index: number): void
  (e: 'prev'): void
  (e: 'next'): void
}
