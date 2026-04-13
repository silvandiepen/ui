# Tooltip

A contextual tooltip that appears on hover or programmatically.

## Usage

```vue
<div class="anchor">
  Hover me
  <Tooltip
    text="More info"
    placement="right"
    show-on-parent-hover
  />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | — | Tooltip text |
| html | string | — | Tooltip HTML content |
| placement | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Where the tooltip is positioned relative to the anchor |
| color | `Color \| 'default'` | `'default'` | Tooltip surface color token |
| multiline | boolean | false | Enables multiline wrapping for longer content |
| maxWidth | number \| string | `280` | Max width before text wraps |
| showArrow | boolean | true | Shows the directional arrow |
| actions | `TooltipAction[]` | `[]` | Optional inline action buttons inside the tooltip |
| disabled | boolean | false | Disable tooltip |
| open | boolean | false | Controls visibility directly |
| showOnParentHover | boolean | true | Shows the tooltip when the parent wrapper is hovered |

## Notes

- The component is rendered as an absolutely positioned panel, so the parent anchor should be `position: relative`.
- Use `show-on-parent-hover` for the common passive tooltip pattern.
- Use `open` when you need a controlled or always-visible tooltip in docs, onboarding, or debug flows.
