import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import LanguageSwitch from './LanguageSwitch.vue'
import type { LanguageSwitchOption } from './LanguageSwitch.model'
import {
  flattenLanguageSwitchOptions,
  findLanguageSwitchOption,
  getLanguageSwitchFlagEmoji,
  getLanguageSwitchFlagSrc,
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
        regionCode: 'US',
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

  it('formats codes without forcing uppercase and derives regional flags', () => {
    expect(getLanguageSwitchOptionCode(options[0].children?.[1] as LanguageSwitchOption)).toBe('en-US')
    expect(getLanguageSwitchFlagEmoji(options[1])).toBe('🇳🇱')
    expect(getLanguageSwitchFlagSrc(options[1])).toBe('https://arevdata.com/flags/svg/nl.svg')
  })

  it('flattens nested options for simple mode', () => {
    expect(flattenLanguageSwitchOptions(options).map((option) => option.value)).toEqual([
      'en',
      'en-US',
      'nl',
    ])
  })
})

describe('LanguageSwitch', () => {
  it('keeps locale groups collapsed until the base language is selected', async () => {
    const html = await renderToString(createSSRApp({
      render: () => h(LanguageSwitch, {
        modelValue: 'nl',
        options,
        surface: 'inline',
        title: 'Documentation language',
      }),
    }))

    expect(html).toContain('Documentation language')
    expect(html).toContain('English')
    expect(html).toContain('nl')
    expect(html).not.toContain('English (United States)')
    expect(html).not.toContain('Regional English variant.')
    expect(html).toContain('language-switch--inline')
  })

  it('reveals nested locales once the base language is selected', async () => {
    const html = await renderToString(createSSRApp({
      render: () => h(LanguageSwitch, {
        modelValue: 'en',
        options,
        surface: 'inline',
      }),
    }))

    expect(html).toContain('English (United States)')
    expect(html).toContain('en-US')
  })
})
