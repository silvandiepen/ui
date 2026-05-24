import type { LanguageSwitchOption } from '../LanguageSwitch/LanguageSwitch.model'

export interface MikkiFooterLink {
  label: string
  to?: string
  href?: string
  icon?: string
}

export interface MikkiFooterProps {
  /** Short tagline shown at the start of the footer (e.g. "Paste. Transform. Leave.") */
  note?: string
  /** Navigation links (Docs, Pro, About, etc.) */
  links?: MikkiFooterLink[]
  /** Current locale code (e.g. 'en') */
  locale?: string
  /** Available locale options for the language picker */
  localeOptions?: LanguageSwitchOption[]
  /** Copyright holder name (default: "Hakobs") */
  copyrightHolder?: string
  /** Copyright holder URL (default: "https://hakobs.com") */
  copyrightUrl?: string
  /** Show language picker (default: true) */
  showLocale?: boolean
}
