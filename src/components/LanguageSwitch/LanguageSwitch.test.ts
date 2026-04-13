import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import LanguageSwitch from './LanguageSwitch.vue'
import type { LanguageSwitchOption } from './LanguageSwitch.model'
import {
  findLanguageSwitchOption,
  getLanguageSwitchFlagEmoji,
  getLanguageSwitchOptionCode,
  optionHasSelectedDescendant,
} from './LanguageSwitch.utils'

const options: LanguageSwitchOption[] = [
  {
    label: 'English',
    children: [
      {
        value: 'en',
        label: 'English',
        regionCode: 'GB',
      },
      {
        value: 'en-US',
        label: 'English (United States)',
        description: 'Regional English variant.',
      },
    ],
  },
  {
    value: 'nl',
    label: 'Nederlands',
    regionCode: 'NL',
  },
]

describe('LanguageSwitch helpers', () => {
  it('finds nested locale options', () => {
    expect(findLanguageSwitchOption(options, 'en-US')?.label).toBe('English (United States)')
  })

  it('detects selected descendants for grouped options', () => {
    expect(optionHasSelectedDescendant(options[0], 'en-US')).toBe(true)
    expect(optionHasSelectedDescendant(options[1], 'en-US')).toBe(false)
  })

  it('formats codes and derives regional flag emoji', () => {
    expect(getLanguageSwitchOptionCode(options[0].children?.[1] as LanguageSwitchOption)).toBe('EN-US')
    expect(getLanguageSwitchFlagEmoji(options[1])).toBe('🇳🇱')
  })
})

describe('LanguageSwitch', () => {
  it('renders inline grouped options on the server', async () => {
    const html = await renderToString(createSSRApp({
      render: () => h(LanguageSwitch, {
        modelValue: 'en-US',
        options,
        surface: 'inline',
        title: 'Documentation language',
      }),
    }))

    expect(html).toContain('Documentation language')
    expect(html).toContain('English (United States)')
    expect(html).toContain('EN-US')
    expect(html).toContain('language-switch--inline')
  })
})
