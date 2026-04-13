// Import all styles
import './styles/index.scss'

// Export all components
export * from './components'

// Export composables
export {
  configureContent,
  configureSettings,
  registerContentSource,
  removeContentSource,
  useConfirm,
  useContent,
  useI18n,
  useId,
  useInput,
  useSearch,
  useSettings,
  useSettingsStore,
} from './composables'
export type {
  ConfirmOptions,
  ContentConfiguration,
  ContentEntry,
  ContentEntryInput,
  ContentRouteTarget,
  ContentSource,
  InputOptions as UseInputOptions,
  SearchResult,
  SettingsPersistenceContext,
  SettingsPersistenceHandlers,
  SettingsState,
  UseContentOptions,
  UseSearchOptions,
} from './composables'

// Export types
export * from './types'

// Version
export const VERSION = '0.1.0'
