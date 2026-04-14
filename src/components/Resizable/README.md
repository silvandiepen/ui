# Resizable

Two-panel resizable layout with pointer dragging and keyboard resizing.

## Usage

```vue
<Resizable :default-size="240" :min-size="180" :min-secondary-size="320">
  <template #start>
    <Sidebar />
  </template>

  <template #end>
    <main>Content</main>
  </template>
</Resizable>
```

## Props

- `defaultSize`: initial size of the start panel in pixels.
- `modelValue`: controlled size of the start panel in pixels.
- `settingsKey`: persists the current size through `useSettings`.
- `direction`: `horizontal` or `vertical`.
- `minSize`: minimum size of the start panel.
- `maxSize`: optional maximum size of the start panel.
- `minSecondarySize`: minimum remaining size for the end panel.
- `keyboardStep`: keyboard resize increment in pixels.
- `disabled`: disables pointer and keyboard resizing.

## Events

- `update:modelValue`: emitted with the next start-panel size.
- `resize`: emitted whenever the size changes.
- `resize-start`: emitted when pointer dragging begins.
- `resize-end`: emitted when pointer dragging ends.
