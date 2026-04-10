import { Icons, searchIcon } from 'open-icon'

const iconValues = new Set<string>(Object.values(Icons))

const legacyIconAliases: Record<string, string> = {
  add: 'add-m',
  check: 'circled-check',
  'check-circle': 'circled-check',
  close: 'multiply-m',
  x: 'multiply-m',
  plus: 'add-m',
  'plus-circle': 'circled-add',
  minus: 'subtract-m',
  search: 'circled-search',
  user: 'user',
  users: 'user-group',
  mail: 'mail',
  'mail-open': 'mail-open',
  phone: 'microphone',
  lock: 'shield',
  unlock: 'shield-line',
  star: 'circled-star',
  heart: 'heart-m',
  home: 'home-garden',
  settings: 'settings',
  menu: 'hamburger',
  sun: 'sun',
  moon: 'moon-dark-mode',
  edit: 'edit-m',
  sparkles: 'star-m',
  database: 'server',
  folder: 'folder',
  package: 'box',
  code: 'code-brackets',
  book: 'bookcase',
  download: 'arrow-download',
  upload: 'arrow-upload',
  'upload-cloud': 'arrow-headed-upload',
  zap: 'lightning-flash',
  shield: 'shield',
  'shield-check': 'shield-line',
  globe: 'airplane',
  briefcase: 'briefcase-cross',
  award: 'crown2',
  'trending-up': 'graph-up',
  calendar: 'calendar',
  'dollar-sign': 'dollar',
  laptop: 'laptop',
  'map-pin': 'location-pin',
  key: 'key-down',
  'file-text': 'file',
  activity: 'pulse',
  eye: 'visible-m',
  'eye-off': 'invisible-m',
  'chevron-down': 'chevron-down',
  'chevron-up': 'chevron-up',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  refresh: 'arrow-reload-left-right',
  'layout-dashboard': 'board-multi-dashboard',
  'info-circle': 'circled-info',
  'alert-circle': 'circled-exclamation-mark',
  'bar-chart': 'chart-bars-squared',
  flash: 'lightning-flash',
  'light-bulb': 'bulb',
  loader: 'circular-loader',
  'open-in-new': 'link',
  'skip-forward': 'playback-forward',
}

const toEnumKey = (iconName: string) =>
  iconName
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()

const findSearchMatch = (iconName: string) => {
  const searchTokens = iconName
    .split(/[-_\s]+/)
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)

  if (searchTokens.length === 0) {
    return null
  }

  const results = searchIcon(iconName.replace(/[-_]+/g, ' '), 'name') ?? []
  const exactTokenMatch = results.find((result) => {
    const iconTokens = result.name.split('-').map((token) => token.toLowerCase())

    return searchTokens.every((token) => iconTokens.includes(token))
  })

  return exactTokenMatch?.name ?? null
}

export const resolveIconName = (iconName: string) => {
  const normalizedIconName = legacyIconAliases[iconName] ?? iconName

  if (iconValues.has(normalizedIconName)) {
    return normalizedIconName
  }

  const enumMatch = Icons[toEnumKey(normalizedIconName) as keyof typeof Icons]

  if (enumMatch) {
    return enumMatch
  }

  return findSearchMatch(normalizedIconName)
}
