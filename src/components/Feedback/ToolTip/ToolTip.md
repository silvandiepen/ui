# ToolTip

A contextual tooltip component that displays additional information on hover. It provides multiple positioning options and customizable appearance with smooth animations.

## Basic Usage

```vue
<template>
  <div tooltip>
    <button>Hover me</button>
    <ToolTip>This is a helpful tooltip</ToolTip>
  </div>
</template>

<script setup>
import { ToolTip } from '@tiko/ui'
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `ToolTipPosition` | `'bottom'` | Tooltip position: 'top', 'right', 'bottom', 'left' |
| `delay` | `number` | `0.5` | Hover delay in seconds before showing |

## Positioning

The tooltip can be positioned relative to its trigger element:

```vue
<template>
  <div class="tooltip-examples">
    <!-- Bottom (default) -->
    <div tooltip>
      <button>Bottom</button>
      <ToolTip position="bottom">
        Tooltip appears below
      </ToolTip>
    </div>

    <!-- Top -->
    <div tooltip>
      <button>Top</button>
      <ToolTip position="top">
        Tooltip appears above
      </ToolTip>
    </div>

    <!-- Right -->
    <div tooltip>
      <button>Right</button>
      <ToolTip position="right">
        Tooltip appears to the right
      </ToolTip>
    </div>

    <!-- Left -->
    <div tooltip>
      <button>Left</button>
      <ToolTip position="left">
        Tooltip appears to the left
      </ToolTip>
    </div>
  </div>
</template>
```

## Examples

### With Custom Delay

```vue
<template>
  <div tooltip>
    <button>Hover and wait</button>
    <ToolTip :delay="1.5">
      This tooltip appears after 1.5 seconds
    </ToolTip>
  </div>
</template>
```

### Icon with Tooltip

```vue
<template>
  <div tooltip>
    <Button icon="help-circle" type="ghost" size="small" />
    <ToolTip position="top">
      Click for help documentation
    </ToolTip>
  </div>
</template>

<script setup>
import { ToolTip, Button } from '@tiko/ui'
</script>
```

### Form Field Help

```vue
<template>
  <div class="form-field">
    <label for="password">
      Password
      <div tooltip>
        <Icon name="info" />
        <ToolTip position="right">
          Password must be at least 8 characters with uppercase, lowercase, and numbers
        </ToolTip>
      </div>
    </label>
    <input type="password" id="password" />
  </div>
</template>

<script setup>
import { ToolTip, Icon } from '@tiko/ui'
</script>

<style>
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}

label {
  display: flex;
  align-items: center;
  gap: var(--space-s);
}
</style>
```

### Action Button Tooltips

```vue
<template>
  <div class="action-bar">
    <div tooltip>
      <Button icon="edit" type="ghost" />
      <ToolTip position="top">Edit item</ToolTip>
    </div>

    <div tooltip>
      <Button icon="share" type="ghost" />
      <ToolTip position="top">Share item</ToolTip>
    </div>

    <div tooltip>
      <Button icon="trash" type="ghost" />
      <ToolTip position="top">Delete item</ToolTip>
    </div>
  </div>
</template>

<script setup>
import { ToolTip, Button } from '@tiko/ui'
</script>

<style>
.action-bar {
  display: flex;
  gap: var(--space-s);
}
</style>
```

### Status Indicators

```vue
<template>
  <div class="status-indicators">
    <div tooltip>
      <div class="status-dot status-dot--online"></div>
      <ToolTip position="top">User is online</ToolTip>
    </div>

    <div tooltip>
      <div class="status-dot status-dot--away"></div>
      <ToolTip position="top">User is away</ToolTip>
    </div>

    <div tooltip>
      <div class="status-dot status-dot--offline"></div>
      <ToolTip position="top">User is offline</ToolTip>
    </div>
  </div>
</template>

<script setup>
import { ToolTip } from '@tiko/ui'
</script>

<style>
.status-indicators {
  display: flex;
  gap: var(--space);
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &--online { background: var(--color-success); }
  &--away { background: var(--color-warning); }
  &--offline { background: var(--color-error); }
}
</style>
```

### Table Cell Tooltips

```vue
<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>
          <div tooltip>
            Last Activity
            <ToolTip position="top">
              When the user was last active
            </ToolTip>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.name }}</td>
        <td>
          <div tooltip>
            <TChip :color="user.statusColor">{{ user.status }}</TChip>
            <ToolTip position="top">
              {{ user.statusDescription }}
            </ToolTip>
          </div>
        </td>
        <td>{{ user.lastActivity }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ToolTip, TChip } from '@tiko/ui'

const users = [
  {
    id: 1,
    name: 'John Doe',
    status: 'Active',
    statusColor: 'success',
    statusDescription: 'User is currently online and active',
    lastActivity: '2 minutes ago'
  },
  // ... more users
]
</script>
```

### Truncated Text

```vue
<template>
  <div class="truncated-content">
    <div tooltip>
      <p class="truncated-text">
        {{ longText }}
      </p>
      <ToolTip position="top">
        {{ fullText }}
      </ToolTip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ToolTip } from '@tiko/ui'

const fullText = "This is a very long text that might be truncated in the UI but can be shown in full via the tooltip"
const longText = computed(() =>
  fullText.length > 50 ? fullText.substring(0, 50) + '...' : fullText
)
</script>

<style>
.truncated-text {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
```

### Dynamic Tooltip Content

```vue
<template>
  <div class="dynamic-tooltip">
    <div tooltip>
      <Button :loading="isLoading" @click="performAction">
        {{ isLoading ? 'Processing...' : 'Click me' }}
      </Button>
      <ToolTip position="top">
        {{ tooltipText }}
      </ToolTip>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ToolTip, Button } from '@tiko/ui'

const isLoading = ref(false)

const tooltipText = computed(() => {
  return isLoading.value
    ? 'Please wait while we process your request'
    : 'Click to start the action'
})

const performAction = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false
}
</script>
```

## Required HTML Structure

The tooltip requires a parent element with the `tooltip` attribute:

```html
<div tooltip>
  <button>Trigger element</button>
  <ToolTip>Tooltip content</ToolTip>
</div>
```

## Styling

The tooltip uses CSS custom properties for styling:

```css
.tool-tip {
  /* Tooltip appearance */
  background-color: var(--color-foreground);
  color: var(--color-background);
  font-size: var(--tooltip-font-size, 0.75em);
  padding: var(--space-s) calc(var(--space) / 3 * 2);
  border-radius: var(--border-radius);

  /* Animation */
  transition: all 0.2s ease-in-out;
  transition-delay: var(--tooltip-delay, 0.5s);

  /* Positioning */
  position: absolute;
  z-index: 20;
  pointer-events: none;
}

/* Hover trigger */
[tooltip]:hover .tool-tip {
  opacity: 1;
  transition-delay: var(--tooltip-delay, 0.5s);
}
```

### Custom Tooltip Styling

```vue
<style>
/* Custom tooltip appearance */
.tool-tip {
  --tooltip-font-size: 0.875rem;
  background: var(--color-primary);
  color: var(--color-primary-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Custom positioning */
.tool-tip--bottom {
  --context-tooltip-x: -25%; /* Offset from center */
  --context-tooltip-y: 75%;   /* Offset from top */
}
</style>
```

## Accessibility

- Screen readers will announce tooltip content
- Tooltip content should be supplementary, not essential
- Keyboard users can access tooltip content through focus
- High contrast mode compatible

## Best Practices

1. **Keep content concise** - Tooltips should be brief and helpful
2. **Use appropriate positioning** - Avoid tooltips going off-screen
3. **Don't hide essential info** - Tooltips should enhance, not replace content
4. **Test on mobile** - Consider touch interaction patterns
5. **Provide alternative access** - Don't rely solely on hover
6. **Use meaningful content** - Avoid redundant tooltip text
7. **Consider delay** - Longer delays for non-essential information

## Touch Considerations

On touch devices, tooltips may not work as expected since there's no hover state. Consider:

- Using click/tap to show tooltips
- Providing alternative ways to access information
- Testing thoroughly on mobile devices

## Related Components

- `Button` - Often used as tooltip triggers
- `Icon` - Commonly paired with tooltips
- `TChip` - May use tooltips for additional context
- `Popup` - For more complex contextual content
