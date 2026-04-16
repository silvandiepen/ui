import { describe, expect, it } from 'vitest'

describe('FloatingHeader', () => {
  it('exports the component module', async () => {
    const mod = await import('./FloatingHeader.vue')
    expect(mod.default).toBeDefined()
    expect(mod.default.name || mod.default.__name).toBeTruthy()
  })

  it('exports types from the model', async () => {
    const mod = await import('./FloatingHeader.model')
    expect(mod).toBeDefined()
  })
})
