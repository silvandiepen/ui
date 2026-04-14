# StatusBadge

Small status pill used to label state at a glance.

## What It Does

- Renders a short label such as `Stable`, `Draft`, `Error`, or `Queued`.
- Applies a shared `Status` variant so the same component can communicate default, success, warning, error, and info states.

## Tone Types

- `Status.DEFAULT`: default muted state
- `Status.SUCCESS`: positive or healthy state
- `Status.WARNING`: caution or pending attention
- `Status.ERROR`: destructive, failed, or high-risk state
- `Status.INFO`: highlighted informational state

## Usage

```vue
<StatusBadge label="Stable" :tone="Status.SUCCESS" />
<StatusBadge label="Needs Review" :tone="Status.WARNING" />
```
