# Carousel

`Carousel` is a scroll-snap-powered slideshow component for cycling through content with optional navigation, indicators, and autoplay.

## When to use

- Use it to showcase a horizontal or vertical series of items (images, cards, features) where one or more items are visible at a time.
- Prefer it over custom scroll containers when you need prev/next navigation, dot indicators, or autoplay behavior.

## Props

- `itemsToShow` (`number | { default?, s?, m?, l?, xl? }`, default `1`): Number of items visible at once. Pass an object for responsive breakpoints.
- `itemsToScroll` (`number`, default `1`): Number of items to advance per navigation click.
- `gap` (`string`, default `var(--space)`): CSS gap between carousel items.
- `showNavigation` (`boolean`, default `true`): Show prev/next arrow buttons.
- `showIndicators` (`boolean`, default `true`): Show dot indicators.
- `navigationPosition` (`'inside' | 'outside' | 'overlay'`, default `'overlay'`): Where navigation arrows are placed. `overlay` fades them in on hover.
- `indicatorsPosition` (`'inside' | 'outside'`, default `'inside'`): Where dot indicators appear.
- `autoplay` (`boolean`, default `false`): Automatically advance the carousel.
- `autoplayInterval` (`number`, default `4000`): Milliseconds between autoplay transitions.
- `pauseOnHover` (`boolean`, default `true`): Pause autoplay when the user hovers over the carousel.
- `loop` (`boolean`, default `false`): Continue from the beginning after reaching the last slide.
- `snapAlign` (`'start' | 'center' | 'end'`, default `'start'`): CSS `scroll-snap-align` value for each item.
- `vertical` (`boolean`, default `false`): Use vertical orientation instead of horizontal.
- `height` (`string`, optional): Explicit height for the carousel (useful in vertical mode).

## Events

- `slide(index)`: Emitted when navigating to a slide.
- `prev()`: Emitted when navigating backward.
- `next()`: Emitted when navigating forward.

## Slots

- `default`: Carousel items (each direct child is treated as a slide).
- `prev-icon`: Custom content for the previous navigation button.
- `next-icon`: Custom content for the next navigation button.

## Guidance

- Use `itemsToShow` with a responsive object for layouts that adapt across screen sizes.
- Combine `autoplay` with `loop` for a continuously cycling showcase.
- Navigation buttons are hidden when there is nothing to scroll in that direction.
