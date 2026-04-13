import { ref, toRaw } from 'vue'
import type {
  ColumnVisibility,
  ColumnWidth,
  DataListRow,
  SettingsPersistenceContext,
  SettingsPersistenceHandlers,
  SettingsState,
  SortValue,
} from './settings.model'

const SETTINGS_STORAGE_KEY = 'sil-ui-settings'

const createDefaultState = (): SettingsState => ({
  sorts: {},
  columnOrder: {},
  columnVisibility: {},
  columnWidths: {},
  perPage: {},
  dataListSelection: {},
  dataListSelectionPanelOpen: {},
  sidebarNavigationSections: {},
  customColors: {},
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
let persistenceHandlers: SettingsPersistenceHandlers = {}
let pendingSave = Promise.resolve()

function cloneState(state: SettingsState): SettingsState {
  const rawState = toRaw(state)
  return JSON.parse(JSON.stringify(rawState)) as SettingsState
}

function saveToLocalStorage() {
  if (typeof localStorage === 'undefined') {
    return
  }

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsState.value))
}

function queueExternalSave(context: SettingsPersistenceContext) {
  if (!persistenceHandlers.save) {
    return
  }

  const snapshot = cloneState(settingsState.value)

  pendingSave = pendingSave
    .catch(() => undefined)
    .then(() => persistenceHandlers.save?.(snapshot, context))
    .catch((error) => {
      console.error('[useSettings] Failed to persist settings through configured handlers.', error)
    })
}

function persistState(context: SettingsPersistenceContext) {
  saveToLocalStorage()
  queueExternalSave(context)
}

function setMapValue<K extends keyof SettingsState>(key: K, valueKey: string, value: SettingsState[K][string]) {
  ;(settingsState.value[key] as Record<string, unknown>)[valueKey] = value
  persistState({
    area: key,
    cause: 'set',
    value,
    valueKey,
  })
}

function clearMapValue<K extends keyof SettingsState>(key: K, valueKey: string) {
  delete (settingsState.value[key] as Record<string, unknown>)[valueKey]
  persistState({
    area: key,
    cause: 'clear',
    valueKey,
  })
}

export function configureSettings(handlers?: SettingsPersistenceHandlers | null) {
  persistenceHandlers = handlers ?? {}
}

function getState() {
  return cloneState(settingsState.value)
}

async function hydrateSettings() {
  if (!persistenceHandlers.load) {
    return getState()
  }

  const loadedState = await persistenceHandlers.load()

  if (!loadedState) {
    return getState()
  }

  settingsState.value = {
    ...createDefaultState(),
    ...settingsState.value,
    ...loadedState,
  }

  persistState({
    area: 'all',
    cause: 'hydrate',
    value: loadedState,
  })

  return getState()
}

function clearAllSettings() {
  settingsState.value = createDefaultState()

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(SETTINGS_STORAGE_KEY)
  }

  queueExternalSave({
    area: 'all',
    cause: 'reset',
  })
}

async function whenSettingsSaved() {
  await pendingSave
}

export function useSettings() {
  return {
    getState,
    hydrate: hydrateSettings,
    whenSaved: whenSettingsSaved,
    clearAll: clearAllSettings,

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

    getSidebarNavigationSections: (key: string) => settingsState.value.sidebarNavigationSections[key] || null,
    setSidebarNavigationSections: (key: string, value: Record<string, boolean>) => setMapValue('sidebarNavigationSections', key, value),
    clearSidebarNavigationSections: (key: string) => clearMapValue('sidebarNavigationSections', key),

    getCustomColors: (key: string): string[] => settingsState.value.customColors[key] || [],
    addCustomColor: (key: string, hex: string) => {
      const existing = settingsState.value.customColors[key] || []
      if (!existing.includes(hex)) {
        setMapValue('customColors', key, [...existing, hex])
      }
    },
    removeCustomColor: (key: string, hex: string) => {
      const existing = settingsState.value.customColors[key] || []
      setMapValue('customColors', key, existing.filter((c) => c !== hex))
    },
  }
}

export const useSettingsStore = useSettings
