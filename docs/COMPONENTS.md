# Components

This document describes the current shared component surface in `@sil/ui`.

## Stable Root Exports

### Primitives

- `Button`: shared action primitive.
- `Card`: existing shared surface container.
- `Badge`: compact status or metadata marker.
- `Alert`: inline feedback block built on top of `Card`.
- `Avatar`: generic avatar display.
- `Icon`: shared icon renderer.
- `Field`: label, hint, and error wrapper for controls.
- `Textarea`: standalone textarea primitive.
- `StatusBadge`: compact tone-based status label.
- `CopyValueButton`: small copy-to-clipboard action.
- `ReferenceBadge`: reference chip with tooltip, copy, and optional external link.

### Layout

- `Container`: content wrapper with optional page actions.
- `Section`: generic content section wrapper.
- `PlatformHeader`: neutral header shell with `brand`, `nav`, `actions`, and `secondary` slots.
- `FloatingHeader`: floating pill-shaped header with brand, navigation, and action slots.
- `PillHeader`: floating pill-shaped app header using the shared `NavigationItem` contract.
- `Card`: reusable surface and content container.

### Data And Navigation

- `Table`: generic table presentation.
- `NavigationItem`, `NavigationSection`: shared navigation contracts used by app shell and navigation components.
- `ContextMenu`, `ContextPanel`, `ContextMenuItems`: contextual action primitives.
- `DropdownMenu`: menu-style dropdown surface.

### Feedback

- `Notification`: inline dismissible feedback message.
- `Popup`, `popupService`: popup system.
- `Toast`, `toastService`: toast notification system.
- `ToolTip`: feedback tooltip.
- `Tooltip`: newer tooltip primitive.
- `Progress`: generic progress indicator.
- `ThemeToggle`: generic theme toggle control.

### User

- `HeaderUser`: compact user summary control displaying initials, name, and optional email.

### Pricing

- `PricingCard`: pricing plan card with features, badges, and call-to-action.
- `PricingGrid`: responsive grid layout for pricing cards.

### Forms

- `Form`: form surface exported through the existing `Form` entry.
- `TForm`, `TInput`, `TInputText`, `TInputTextArea`, `TInputSelect`, `TInputCheckbox`, `TToggle`, and related form inputs remain available through the form exports.

## Transitional Deep Imports

These are shared code, but the API is still being normalized. Prefer root exports for new work when possible.

- `Input`: `@sil/ui/src/components/Input/Input.vue`
- `Select`: `@sil/ui/src/components/Select/Select.vue`

## Usage Pattern

Prefer composition:

```vue
<PlatformHeader>
  <template #brand>
    <img src="/logo.svg" alt="Brand" />
  </template>

  <template #actions>
    <Button>Save</Button>
  </template>
</PlatformHeader>
```

Prefer shared controls in app-local wrappers:

```vue
<Field label="Project Name">
  <Input v-model="projectName" />
</Field>
```
