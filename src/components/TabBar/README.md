# TabBar

`TabBar` is a compact value-driven tab switcher built on the shared tabs navigation surface.

## When to use

- Use it when you need a small `v-model` tab switcher without tab pane composition.
- Use `Tabs` when the content panes live inside the component and you need the fuller tabs API.

## Notes

- `TabBar` now reuses the same navigation styling and interaction model as `Tabs`.
- Supported variants are `default`, `pills`, `underline`, and `minimal`.
- `minimal` dims inactive items and uses an animated underline that moves and resizes to the active tab.
- Each tab item supports `label`, `value`, `icon`, `badge`, and `disabled`.
