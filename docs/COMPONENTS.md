# Components

This document describes the current shared component surface in `@sil/ui`.

## Stable Root Exports

### Primitives

- `Button`: existing shared action primitive used broadly in Lezu-compatible surfaces.
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
- `Card`: reusable surface and content container.

### Data And Navigation

- `Table`: generic table presentation.
- `ContextMenu`, `ContextPanel`, `ContextMenuItems`: contextual action primitives.
- `DropdownMenu`: menu-style dropdown surface.

### Feedback

- `Notification`: inline dismissible feedback message.
- `Popup`, `popupService`: legacy popup system kept for Lezu compatibility.
- `Toast`, `toastService`: legacy toast system kept for Lezu compatibility.
- `ToolTip`: legacy tooltip system kept for Lezu compatibility.
- `Tooltip`: newer tooltip primitive from the Emila side.
- `Progress`: generic progress indicator.
- `ThemeToggle`: generic theme toggle control.

### Forms

- `Form`: Lezu-compatible form surface exported through the existing `Form` entry.
- `TForm`, `TInput`, `TInputText`, `TInputTextArea`, `TInputSelect`, `TInputCheckbox`, `TToggle`, and related form inputs remain available through the form exports.

## Transitional Deep Imports

These are shared code, but the API is still being normalized. Prefer root exports for new work when possible.

- `Input`: `@sil/ui/src/components/Input/Input.vue`
- `Select`: `@sil/ui/src/components/Select/Select.vue`
- Emila-style `Toast`: `@sil/ui/src/components/Toast`

## Temporary Compatibility Split

Some concepts still exist in more than one form while the migration is underway.

### Tooltip

- `ToolTip`: legacy Lezu-compatible feedback tooltip exported from the root
- `Tooltip`: newer generic tooltip component from the Emila side

### Toast

- root `Toast`: legacy Lezu-compatible feedback toast
- deep `src/components/Toast`: Emila-style toast primitives used by migrated Edit components

### Buttons And Cards

- `Button`, `Card`, and `Icon` are still in compatibility mode
- new shared work should prefer building wrappers on top of the current shared primitives instead of cloning them again
- canonical consolidation is deferred until both app compatibility layers are stable

## Usage Pattern

Prefer composition:

```vue
<PlatformHeader>
  <template #brand>
    <LezuLogo />
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
