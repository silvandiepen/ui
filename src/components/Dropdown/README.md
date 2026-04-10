# DropdownMenu

Anchored menu surface for contextual actions and small command lists.

## Usage

```vue
<DropdownMenu :items="items">
  <template #trigger="{ toggle }">
    <button type="button" @click="toggle">Open menu</button>
  </template>
</DropdownMenu>
```

## Notes

- Supports trigger and menu slots
- Can render from item data or fully custom menu content
- Emits `select` and `close`
