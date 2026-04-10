# Alert

Inline feedback block for informational, success, warning, and error states.

## Usage

```vue
<Alert
  variant="warning"
  title="Heads up"
  description="This action cannot be undone."
/>
```

## Notes

- Supports tone variants and an optional dismiss action
- Can render either a `description` prop or slot content
- Useful for page-level and section-level guidance
