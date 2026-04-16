# Steps

Visual step indicator for multi-step flows, wizards, and onboarding processes.

## Usage

```vue
<Steps :steps="steps" :current-step="1" />
```

With icons and vertical direction:

```vue
<Steps
  :steps="[
    { title: 'Account', icon: 'user' },
    { title: 'Profile', icon: 'settings' },
    { title: 'Done', icon: 'check-circle' },
  ]"
  :current-step="0"
  direction="vertical"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepItem[]` | — | Array of step objects (required) |
| `currentStep` | `number` | `0` | Active step index (0-based) |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `showNumber` | `boolean` | `true` | Show step numbers in circles |
| `color` | `Colors` | — | Global accent color for all steps |

## StepItem

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Step label (required) |
| `description` | `string` | Secondary text below the title |
| `icon` | `IconNameOrString` | Icon name to show instead of number |
| `status` | `StepStatus` | Override status: `'pending'`, `'active'`, `'completed'`, `'error'` |
| `color` | `Colors` | Per-step accent color |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:currentStep` | `number` | Emitted when step changes (v-model) |
| `step-click` | `number` | Emitted when a step is clicked |

## Notes

- Steps before `currentStep` show as completed automatically
- Individual `status` overrides on `StepItem` take priority
- Per-step `color` overrides the global `color` prop
- Completed steps show a checkmark unless an icon is provided
