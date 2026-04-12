# StatusBadge

Small status pill used to label state at a glance.

## What It Does

- Renders a short label such as `Stable`, `Draft`, `Error`, or `Queued`.
- Applies a tone variant so the same component can communicate success, warning, danger, neutral, or accent states.

## Tone Types

- `neutral`: default muted state
- `success`: positive or healthy state
- `warning`: caution or pending attention
- `danger`: destructive, failed, or high-risk state
- `accent`: highlighted informational state

## Usage

```vue
<StatusBadge label="Stable" tone="success" />
<StatusBadge label="Needs Review" tone="warning" />
```
