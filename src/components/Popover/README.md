# Popover

`Popover` renders anchored contextual content next to a trigger.

## When to use

- Use it for small settings panels, contextual help, and compact action groups that stay attached to a trigger.
- Prefer it over full modal flows when the content is lightweight and should preserve nearby page context.

## Notes

- The component supports `v-model`, named trigger slots, width control, and optional close-on-content behavior.
- For menu-specific behavior, use `DropdownMenu` or `ContextMenu` instead of rebuilding that logic inside a popover.
