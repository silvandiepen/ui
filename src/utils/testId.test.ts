import { describe, expect, it } from 'vitest'

import { getTestId } from './testId'

describe('getTestId', () => {
  it('returns the root test id without a part', () => {
    expect(getTestId('account-form')).toBe('account-form')
  })

  it('returns a suffixed child test id with a part', () => {
    expect(getTestId('account-form', 'control')).toBe('account-form-control')
  })

  it('returns undefined without a root test id', () => {
    expect(getTestId(undefined, 'control')).toBeUndefined()
  })
})
