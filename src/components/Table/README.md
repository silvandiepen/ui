# Table

Simple shared table wrapper with a header slot and default body content slot.

## Usage

```vue
<Table>
  <template #header>
    <tr><th>Name</th><th>Status</th></tr>
  </template>
  <tr><td>UI Docs</td><td>Ready</td></tr>
</Table>
```

## Notes

- Exposes a `header` slot for table headings
- Keeps styling minimal so feature-specific table behavior can sit on top
- Best for lightweight structured data displays
