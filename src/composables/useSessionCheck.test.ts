import { describe, expect, it, vi } from 'vitest'
import { fetchSession } from './useSessionCheck'

describe('fetchSession', () => {
  it('returns the session payload when the server responds with a user', async () => {
    const fetchImplementation = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        user: {
          id: 'usr_123',
          email: 'jane@example.com',
          name: 'Jane Doe',
        },
      }),
    })

    const session = await fetchSession({
      baseUrl: 'https://app.example.com',
    }, fetchImplementation as any)

    expect(fetchImplementation).toHaveBeenCalledWith('https://app.example.com/api/auth/get-session', {
      credentials: 'include',
    })
    expect(session?.user.email).toBe('jane@example.com')
  })

  it('returns null when the session endpoint responds with 401', async () => {
    const fetchImplementation = vi.fn().mockResolvedValue({
      status: 401,
      ok: false,
    })

    const session = await fetchSession({
      baseUrl: 'https://app.example.com',
    }, fetchImplementation as any)

    expect(session).toBeNull()
  })

  it('uses custom authPath when provided', async () => {
    const fetchImplementation = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        user: { id: '1', email: 'a@b.com' },
      }),
    })

    await fetchSession({
      baseUrl: 'https://app.example.com',
      authPath: 'v2/session',
    }, fetchImplementation as any)

    expect(fetchImplementation).toHaveBeenCalledWith('https://app.example.com/v2/session', {
      credentials: 'include',
    })
  })
})
