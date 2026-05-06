# Input

A basic text input component using CSS custom properties.

Prefer `InputText` from the form exports for new single-line text fields. This primitive remains available for low-level or legacy usage.

## Usage

```vue
<Input v-model="value" placeholder="Type here..." />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | string \| number | '' | Bound value |
| type | string | 'text' | Input type |
| placeholder | string | — | Placeholder text |
| disabled | boolean | false | Disabled state |
| id | string | — | HTML id |
