# Tabs

Reusable tab primitives built around three components:

- `TabNavigation.vue` — interactive tab switcher UI (standalone, no content panes)
- `Tabs.vue` — root container that manages active pane state and syncs with `TabNavigation`
- `TabPane.vue` — individual content pane that registers itself with `Tabs`

---

## TabNavigation

Standalone tab bar. Use this when you manage your own active state or render content outside the component (routing, custom panels, etc.).

### Props

| Prop       | Type                             | Default    | Description                                          |
| ---------- | -------------------------------- | ---------- | ---------------------------------------------------- |
| `value`    | `string \| number \| null`       | `null`     | Active tab id                                        |
| `items`    | `TabNavigationItem[]`            | `[]`       | Tab definitions                                      |
| `variant`  | `'pills' \| 'underline'`         | `'pills'`  | Visual style                                         |
| `size`     | `'small' \| 'medium' \| 'large'` | `'medium'` | Controls font size, icon size, and button padding    |
| `align`    | `'left' \| 'center' \| 'right'`  | `'left'`   | Horizontal alignment (or cross-axis when `vertical`) |
| `stretch`  | `boolean`                        | `false`    | Tabs fill the full width equally                     |
| `iconOnly` | `boolean`                        | `false`    | Show icons only, hide labels                         |
| `vertical` | `boolean`                        | `false`    | Stack tabs vertically                                |

### Events

| Event    | Payload            | Description                                 |
| -------- | ------------------ | ------------------------------------------- |
| `input`  | `string \| number` | Emitted on tab select with the item id      |
| `change` | `(id, item)`       | Emitted on tab select with id and full item |

### Item shape

```ts
type TabNavigationItem = {
  id: string | number;
  label: string;
  icon?: string; // open-icon name
  badge?: string | number;
  color?: string; // color token name
  disabled?: boolean;
};
```

### Basic usage

```vue
<TabNavigation :items="tabs" :value="activeTab" @input="activeTab = $event" />
```

### With icons, size, and variant

```vue
<TabNavigation
  :items="tabs"
  v-model="activeTab"
  variant="underline"
  size="small"
  align="center"
/>
```

### Variants

`pills` — animated background pill tracks the active tab. Hover shows a lighter pill.

`underline` — animated bottom line (or right-side line in vertical mode) tracks the active tab.

### Size

The `size` prop scales font size, icon size, and button padding together:

| Size     | Font             | Icon     | Padding  |
| -------- | ---------------- | -------- | -------- |
| `small`  | `--font-size-sm` | `1em`    | xs / s   |
| `medium` | `--font-size`    | `1.25em` | s / base |
| `large`  | `--font-size-lg` | `1.5em`  | m / l    |

### Vertical mode

When `vertical` is true:

- Tabs stack in a column.
- The `align` prop controls horizontal (cross-axis) alignment: `left`, `center`, `right`.
- The animated indicator moves vertically.
- For the `underline` variant the indicator renders as a right-side line.

---

## Tabs + TabPane

Use `Tabs` when you want content panes managed automatically.

```vue
<Tabs value="overview" @input="onTabChange">
  <TabPane id="overview" title="Overview" icon="home">
    Overview content
  </TabPane>
  <TabPane id="details" title="Details" icon="book-open">
    Details content
  </TabPane>
</Tabs>
```

Use sticky underline navigation for settings and other long forms:

```vue
<Tabs value="project" tab-navigation-variant="underline" sticky-navigation>
  <TabPane id="project" title="Project" icon="settings">
    Project settings
  </TabPane>
  <TabPane id="locales" title="Locales" icon="location-pin">
    Locale settings
  </TabPane>
</Tabs>
```

### TabPane props

| Prop    | Type               | Description                               |
| ------- | ------------------ | ----------------------------------------- |
| `id`    | `string \| number` | Unique tab identifier                     |
| `title` | `string`           | Tab label                                 |
| `icon`  | `string`           | open-icon name forwarded to TabNavigation |

### Tabs props

| Prop                     | Type                     | Default   | Description                                        |
| ------------------------ | ------------------------ | --------- | -------------------------------------------------- |
| `tabNavigationVariant`   | `'pills' \| 'underline'` | `'pills'` | Visual style forwarded to TabNavigation            |
| `stickyNavigation`       | `boolean`                | `false`   | Keep navigation sticky while scrolling tab content |
| `stickyNavigationOffset` | `string`                 | `'0'`     | CSS top offset used by `stickyNavigation`          |
| `vertical`               | `boolean`                | `false`   | Always place navigation on the left                |

---

## CSS custom properties

### Public (override in your project)

```css
--tab-navigation-pills-padding
--tab-navigation-pills-background
--tab-navigation-pills-button-inactive-color
--tab-navigation-pills-button-active-color
--tab-navigation-underline-inactive-color
--tab-navigation-underline-active-color
--tab-navigation-underline-baseline-color
--tab-navigation-underline-indicator-height
--tab-navigation-underline-indicator-color
```

### Internal (set by component logic — do not override)

```css
--int-tab-navigation-border-radius
--int-tab-navigation-font-size
--int-tab-navigation-icon-size
--int-tab-navigation-pills-button-padding-y
--int-tab-navigation-pills-button-padding-x
--int-tab-navigation-underline-padding-y
--int-tab-navigation-underline-padding-x
```

---

## Architecture

Shared state logic lives in `useTabs.ts`:

- `useTabsRoot` — tab registration, activation, `value`/`activeTab` sync, emits
- `useTabPane` — pane registration lifecycle and prop sync

Types live in `Tabs.model.ts`.
