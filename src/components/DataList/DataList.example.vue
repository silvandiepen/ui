<template>
  <div class="data-list-example">

    <!-- Controls -->
    <div class="data-list-example__controls">
      <label
        v-for="ctrl in controls"
        :key="ctrl.key"
        class="data-list-example__toggle"
      >
        <input
          type="checkbox"
          :checked="Boolean(state[ctrl.key as keyof typeof state])"
          @change="(e) => (state[ctrl.key as keyof typeof state] = (e.target as HTMLInputElement).checked)"
        />
        <code>{{ ctrl.label }}</code>
      </label>
    </div>

    <!-- Main example -->
    <DataList
      :columns="mainColumns"
      :data="sortedRows"
      :loading="state.loading"
      :selectable="state.selectable"
      :row-clickable="state.rowClickable"
      :auto-width="state.autoWidth"
      :enable-pagination="state.enablePagination"
      :total="rows.length"
      :per-page="perPage"
      :current-page="currentPage"
      :context-menu-items="state.withContextMenu ? rowContextItems : undefined"
      :selection-actions="state.selectable ? bulkActions : undefined"
      selection-label-key="name"
      :sort-prop="sortProp"
      :sort-order="sortOrder"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      @update:per-page="perPage = $event"
      @update:current-page="currentPage = $event"
    >
      <template #cell-status="{ value }">
        <span :class="`data-list-example__status data-list-example__status--${value}`">
          {{ value }}
        </span>
      </template>
      <template #cell-progress="{ value }">
        <div class="data-list-example__progress">
          <div class="data-list-example__progress-track">
            <div
              class="data-list-example__progress-fill"
              :style="{ width: `${value}%` }"
            />
          </div>
          <span>{{ value }}%</span>
        </div>
      </template>
    </DataList>

    <p v-if="lastClickedRow" class="data-list-example__log">
      Last clicked: <strong>{{ lastClickedRow.name }}</strong> ({{ lastClickedRow.team }})
    </p>

    <!-- Column types: boolean + switch -->
    <h4 class="data-list-example__section-title">Column types</h4>
    <p class="data-list-example__section-desc">
      Use <code>type: 'boolean'</code> to render yes/no labels, and <code>type: 'switch'</code> to render an inline toggle.
    </p>
    <DataList
      :columns="typedColumns"
      :data="rows"
      :auto-width="false"
      :row-clickable="false"
    />

    <!-- Custom header slot -->
    <h4 class="data-list-example__section-title">Custom header &amp; cell slots</h4>
    <p class="data-list-example__section-desc">
      Use <code>#header-{key}</code> and <code>#cell-{key}</code> to fully customise any column.
    </p>
    <DataList
      :columns="slotColumns"
      :data="rows"
      :auto-width="false"
      :row-clickable="false"
    >
      <template #header-name>
        Project ↑
      </template>
      <template #cell-name="{ value, row }">
        <span class="data-list-example__name-cell">
          <span class="data-list-example__name-dot" :class="`data-list-example__name-dot--${row.status}`" />
          {{ value }}
        </span>
      </template>
      <template #cell-priority="{ value }">
        <span class="data-list-example__priority">
          <span
            v-for="n in 3"
            :key="n"
            :class="['data-list-example__priority-dot', n <= Number(value) ? 'data-list-example__priority-dot--filled' : '']"
          />
        </span>
      </template>
    </DataList>

    <!-- Empty state -->
    <h4 class="data-list-example__section-title">Empty state</h4>
    <p class="data-list-example__section-desc">
      Override the <code>#empty</code> slot to display a custom message when there is no data.
    </p>
    <DataList :columns="simpleColumns" :data="[]">
      <template #empty>No projects found — add one to get started.</template>
    </DataList>

  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import DataList from './DataList.vue'
import type { DataListColumn, DataListRow, DataListSortOrder } from './DataList.model'

// --- Controls ---

const state = reactive({
  loading: false,
  selectable: false,
  rowClickable: true,
  autoWidth: true,
  enablePagination: false,
  withContextMenu: false,
})

const controls: { key: keyof typeof state; label: string }[] = [
  { key: 'loading', label: 'loading' },
  { key: 'selectable', label: 'selectable' },
  { key: 'rowClickable', label: 'rowClickable' },
  { key: 'autoWidth', label: 'autoWidth' },
  { key: 'enablePagination', label: 'enablePagination' },
  { key: 'withContextMenu', label: 'contextMenuItems' },
]

// --- Data ---

const rows: DataListRow[] = [
  { id: '1', name: 'Design System', team: 'Platform', status: 'active',  priority: 1, progress: 72, enabled: true },
  { id: '2', name: 'Mobile App',    team: 'Mobile',   status: 'review',  priority: 2, progress: 45, enabled: false },
  { id: '3', name: 'API Gateway',   team: 'Backend',  status: 'active',  priority: 1, progress: 88, enabled: true },
  { id: '4', name: 'Auth Service',  team: 'Backend',  status: 'paused',  priority: 3, progress: 20, enabled: false },
  { id: '5', name: 'Dashboard',     team: 'Frontend', status: 'active',  priority: 2, progress: 65, enabled: true },
  { id: '6', name: 'Data Pipeline', team: 'Platform', status: 'review',  priority: 2, progress: 55, enabled: true },
  { id: '7', name: 'Search Engine', team: 'Backend',  status: 'active',  priority: 1, progress: 91, enabled: true },
  { id: '8', name: 'Analytics',     team: 'Frontend', status: 'paused',  priority: 3, progress: 15, enabled: false },
]

// --- Sort state ---

const sortProp = ref('')
const sortOrder = ref<DataListSortOrder>('')
const perPage = ref(10)
const currentPage = ref(1)

const sortedRows = computed(() => {
  if (!sortProp.value || !sortOrder.value) return rows

  return [...rows].sort((a, b) => {
    const aVal = a[sortProp.value]
    const bVal = b[sortProp.value]

    if (aVal === bVal) return 0

    const direction = sortOrder.value === 'ascending' ? 1 : -1
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * direction
    }
    return String(aVal).localeCompare(String(bVal)) * direction
  })
})

function handleSortChange(payload: { prop: string; order: DataListSortOrder }) {
  sortProp.value = payload.prop
  sortOrder.value = payload.order
}

// --- Row click ---

const lastClickedRow = ref<DataListRow | null>(null)

function handleRowClick(row: DataListRow) {
  lastClickedRow.value = row
}

// --- Context menu ---

const rowContextItems = (row: DataListRow) => [
  { type: 'item' as const, label: 'Edit',   value: 'edit',   icon: 'edit' },
  { type: 'item' as const, label: 'Duplicate', value: 'duplicate', icon: 'copy' },
  { type: 'item' as const, label: `Pause ${row.name}`, value: 'pause', icon: 'pause-circle', divider: true },
  { type: 'item' as const, label: 'Delete', value: 'delete', icon: 'trash' },
]

const bulkActions = [
  { type: 'item' as const, label: 'Export selected', value: 'export' },
  { type: 'item' as const, label: 'Delete selected', value: 'delete' },
]

// --- Column definitions ---

const mainColumns: DataListColumn[] = [
  { key: 'name',     label: 'Name',       sortable: true, minWidth: 140 },
  { key: 'team',     label: 'Team',       sortable: true },
  { key: 'status',   label: 'Status' },
  { key: 'priority', label: 'Priority',   sortable: true, align: 'right' },
  { key: 'progress', label: 'Progress',   sortable: true, align: 'right', minWidth: 120 },
]

const typedColumns: DataListColumn[] = [
  { key: 'name',          label: 'Name' },
  { key: 'team',          label: 'Team' },
  { key: 'enabled_bool',  label: 'Enabled (boolean)', type: 'boolean', valueKey: 'enabled', trueLabel: 'Yes', falseLabel: 'No' },
  { key: 'enabled_switch',label: 'Enabled (switch)',  type: 'switch',  valueKey: 'enabled' },
]

const slotColumns: DataListColumn[] = [
  { key: 'name',     label: 'Name',     minWidth: 140 },
  { key: 'team',     label: 'Team' },
  { key: 'priority', label: 'Priority', align: 'center' },
]

const simpleColumns: DataListColumn[] = [
  { key: 'name',   label: 'Name' },
  { key: 'team',   label: 'Team' },
  { key: 'status', label: 'Status' },
]
</script>

<style lang="scss">
.data-list-example {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-s);
    padding: var(--space-s) var(--space);
    background: color-mix(in srgb, var(--color-foreground), transparent 96%);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 90%);
    border-radius: var(--border-radius);
  }

  &__toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    cursor: pointer;
    font-size: var(--font-size-s);
    user-select: none;
  }

  &__log {
    margin: 0;
    font-size: var(--font-size-s);
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }

  &__section-title {
    margin: 0;
    font-size: var(--font-size);
    font-weight: 600;
  }

  &__section-desc {
    margin: calc(var(--space-xs) * -1) 0 0;
    font-size: var(--font-size-s);
    color: color-mix(in srgb, var(--color-foreground), transparent 40%);
  }

  // Status badge
  &__status {
    display: inline-flex;
    align-items: center;
    padding: 0.15em 0.6em;
    border-radius: 999px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: capitalize;

    &--active { background: color-mix(in srgb, var(--color-success), transparent 82%); color: color-mix(in srgb, var(--color-success), var(--color-foreground) 30%); }
    &--review { background: color-mix(in srgb, var(--color-warning), transparent 82%); color: color-mix(in srgb, var(--color-warning), var(--color-foreground) 30%); }
    &--paused { background: color-mix(in srgb, var(--color-error),   transparent 82%); color: color-mix(in srgb, var(--color-error),   var(--color-foreground) 30%); }
  }

  // Progress bar
  &__progress {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    width: 100%;
    min-width: 80px;
  }

  &__progress-track {
    flex: 1;
    height: 4px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary), transparent 82%);
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    border-radius: 999px;
    background: var(--color-primary);
  }

  // Custom name cell
  &__name-cell {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  &__name-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;

    &--active { background: var(--color-success); }
    &--review { background: var(--color-warning); }
    &--paused { background: var(--color-error); }
  }

  // Priority dots
  &__priority {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  &__priority-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-foreground), transparent 80%);

    &--filled {
      background: var(--color-primary);
    }
  }
}
</style>
