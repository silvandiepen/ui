import { ref } from 'vue'
import type { DataListSortOrder } from '@/components/ui/DataList/DataList.model'

type SortValue = { prop: string; order: DataListSortOrder }
type ColumnVisibility = { key: string; visible: boolean }
type ColumnWidth = { key: string; width: number }
type DataListRow = Record<string, unknown>

const SETTINGS_STORAGE_KEY = 'sil-ui-settings'

type SettingsState = {
  sorts: Record<string, SortValue>
  columnOrder: Record<string, string[]>
  columnVisibility: Record<string, ColumnVisibility[]>
  columnWidths: Record<string, ColumnWidth[]>
  perPage: Record<string, number>
  dataListSelection: Record<string, DataListRow[]>
  dataListSelectionPanelOpen: Record<string, boolean>
}

const createDefaultState = (): SettingsState => ({
  sorts: {},
  columnOrder: {},
  columnVisibility: {},
  columnWidths: {},
  perPage: {},
  dataListSelection: {},
  dataListSelectionPanelOpen: {},
})

function loadState(): SettingsState {
  if (typeof localStorage === 'undefined') {
    return createDefaultState()
  }

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) {
      return createDefaultState()
    }

    return {
      ...createDefaultState(),
      ...JSON.parse(raw),
    }
  } catch {
    return createDefaultState()
  }
}

const settingsState = ref<SettingsState>(loadState())

function persistState() {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsState.value))
}

function setMapValue<K extends keyof SettingsState>(key: K, valueKey: string, value: SettingsState[K][string]) {
  ;(settingsState.value[key] as Record<string, unknown>)[valueKey] = value
  persistState()
}

function clearMapValue<K extends keyof SettingsState>(key: K, valueKey: string) {
  delete (settingsState.value[key] as Record<string, unknown>)[valueKey]
  persistState()
}

export function useSettingsStore() {
  return {
    getSort: (key: string) => settingsState.value.sorts[key] || null,
    setSort: (key: string, payload: SortValue) => setMapValue('sorts', key, payload),
    clearSort: (key: string) => clearMapValue('sorts', key),

    getColumnOrder: (key: string) => settingsState.value.columnOrder[key] || null,
    setColumnOrder: (key: string, value: string[]) => setMapValue('columnOrder', key, value),
    clearColumnOrder: (key: string) => clearMapValue('columnOrder', key),

    getColumnVisibility: (key: string) => settingsState.value.columnVisibility[key] || null,
    setColumnVisibility: (key: string, value: ColumnVisibility[]) => setMapValue('columnVisibility', key, value),
    clearColumnVisibility: (key: string) => clearMapValue('columnVisibility', key),

    getColumnWidths: (key: string) => settingsState.value.columnWidths[key] || null,
    setColumnWidths: (key: string, value: ColumnWidth[]) => setMapValue('columnWidths', key, value),
    clearColumnWidths: (key: string) => clearMapValue('columnWidths', key),

    getPerPage: (key: string) => settingsState.value.perPage[key] || null,
    setPerPage: (key: string, value: number) => setMapValue('perPage', key, value),
    clearPerPage: (key: string) => clearMapValue('perPage', key),

    getDataListSelection: (key: string) => settingsState.value.dataListSelection[key] || [],
    setDataListSelection: (key: string, value: DataListRow[]) => setMapValue('dataListSelection', key, value),
    clearDataListSelection: (key: string) => clearMapValue('dataListSelection', key),

    getDataListSelectionPanelOpen: (key: string) => Boolean(settingsState.value.dataListSelectionPanelOpen[key]),
    setDataListSelectionPanelOpen: (key: string, value: boolean) => setMapValue('dataListSelectionPanelOpen', key, value),
  }
}
