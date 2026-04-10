# EmptyState

Feedback surface for empty lists, first-run screens, and zero-result states.

## Usage

```vue
<EmptyState
  icon="search"
  title="No results"
  description="Try adjusting your filters."
/>
```

## Notes

- Accepts an icon, title, and description
- Exposes an `actions` slot for primary follow-up actions
- Best used when a list or workflow has nothing to show yet
