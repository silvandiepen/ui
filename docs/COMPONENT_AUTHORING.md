# Component Authoring

Use this guide when creating or updating shared `@sil/ui` components.

## Component Shape

Shared components should be reusable primitives, form controls, feedback elements, layout shells, or product-neutral building blocks. Product branding, route-specific orchestration, and domain workflows belong in the consuming application.

Use this structure for Vue components:

```vue
<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBemm } from 'bemm'

defineOptions({
  name: 'SilExample',
})

const props = withDefaults(
  defineProps<{
    tone?: 'default' | 'success' | 'warning' | 'error'
  }>(),
  {
    tone: 'default',
  },
)

const { bemm } = useBemm('example')

const classes = computed(() => [
  bemm(),
  bemm('', props.tone),
])
</script>

<style lang="scss">
.example {
  color: var(--example-color, var(--color-foreground));
}
</style>
```

## Style Rules

- Do not use `<style scoped>` for shared components.
- Use global component classes generated with `bemm`.
- Use a stable block name matching the component concept, such as `button`, `pill-header`, or `ui-tab-nav`.
- Keep selectors inside the component block.
- Do not style product-specific page structure from a shared component.
- Use CSS custom properties for color, spacing, sizing, and state-specific styling.

Shared component styles are global because consuming apps receive them from the package stylesheet or the Vite plugin. Scoped styles break the expected public class API and make cross-component theming harder.

## Class Naming

Use `bemm` for block, element, and modifier classes.

```ts
const { bemm } = useBemm('status-badge')

const classes = computed(() => [
  bemm(),
  bemm('', props.tone),
  props.clickable ? bemm('', 'clickable') : undefined,
])
```

Expected output:

```html
<span class="status-badge status-badge--success status-badge--clickable">
```

Element classes should be generated with `bemm('element')`:

```vue
<span :class="bemm('icon')" />
<span :class="bemm('label')" />
```

## CSS Custom Properties

Use the two-tier custom property model:

- `--int-<component>-*` for internal values set by the component itself.
- `--<component>-*` for public values consuming apps may override.

```scss
.tab-navigation {
  --int-tab-navigation-font-size: var(--font-size);
  --tab-navigation-indicator-color: var(--color-primary);

  font-size: var(--int-tab-navigation-font-size);

  &--size-small {
    --int-tab-navigation-font-size: var(--font-size-s);
  }
}
```

If a prop maps a theme color onto an element, set a CSS custom property from Vue and let SCSS consume it:

```vue
<button
  :style="item.color ? { '--int-example-item-color': `var(--color-${item.color})` } : undefined"
/>
```

```scss
.example__item {
  color: var(--int-example-item-color, var(--color-foreground));
}
```

## Props And Types

- Define prop contracts in TypeScript.
- Export shared contracts from the component model file or shared `src/types` when multiple components use them.
- Reuse shared contracts instead of inventing local variants for navigation, actions, sizes, statuses, and color modes.
- Keep prop names product-neutral.
- Prefer slots for product-owned content such as brand marks, navigation extras, actions, and footer content.

## Documentation And Examples

Every public component should include:

- A `README.md` beside the component.
- An `.example.vue` file when it appears in the docs app.
- At least one basic example and one example covering non-trivial props or slots.
- Notes for shared interfaces the component consumes, such as `NavigationItem`.

## Tests

Add tests when a component has behavior, computed classes, emitted events, keyboard interaction, responsive state, or non-trivial type-driven rendering. Keep visual-only tests focused on stable DOM structure and public classes.
