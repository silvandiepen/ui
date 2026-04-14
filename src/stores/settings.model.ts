import type { DataListSortOrder } from '@/components/DataList/DataList.model'

export type SortValue = { prop: string; order: DataListSortOrder }
export type ColumnVisibility = { key: string; visible: boolean }
export type ColumnWidth = { key: string; width: number }
export type DataListRow = Record<string, unknown>

export type SettingsState = {
  sorts: Record<string, SortValue>
  columnOrder: Record<string, string[]>
  columnVisibility: Record<string, ColumnVisibility[]>
  columnWidths: Record<string, ColumnWidth[]>
  perPage: Record<string, number>
  resizableSizes: Record<string, number>
  dataListSelection: Record<string, DataListRow[]>
  dataListSelectionPanelOpen: Record<string, boolean>
  sidebarNavigationSections: Record<string, Record<string, boolean>>
  customColors: Record<string, string[]>
}

export type SettingsStorageArea = keyof SettingsState | 'all'
export type SettingsPersistenceCause = 'set' | 'clear' | 'hydrate' | 'reset'

export interface SettingsPersistenceContext {
  area: SettingsStorageArea
  cause: SettingsPersistenceCause
  value?: unknown
  valueKey?: string
}

export interface SettingsPersistenceHandlers {
  load?: () => Partial<SettingsState> | null | undefined | Promise<Partial<SettingsState> | null | undefined>
  save?: (state: SettingsState, context: SettingsPersistenceContext) => void | Promise<void>
}
