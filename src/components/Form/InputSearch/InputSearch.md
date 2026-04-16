# InputSearch

Search input with built-in icon and clear action, designed for use with the shared search composable.

Use `searchAction` to run a custom callback when the search icon is clicked (and on Enter when enabled). If omitted, the component emits `search`.

## Usage

```vue
<template>
  <InputSearch v-model="query" placeholder="Search..." />
</template>
```
