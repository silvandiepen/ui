import { describe, expect, it } from 'vitest'

describe('HeaderUser', () => {
  it('exports the component module', async () => {
    const mod = await import('./HeaderUser.vue')
    expect(mod.default).toBeDefined()
    expect(mod.default.name || mod.default.__name).toBeTruthy()
  })

  it('exports types from the model', async () => {
    const mod = await import('./HeaderUser.model')
    expect(mod).toBeDefined()
  })
})
