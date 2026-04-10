import { describe, expect, it, vi } from 'vitest'
import { fetchDashboardSession } from './useDashboardSession'

describe('fetchDashboardSession', () => {
  it('returns the session payload when the dashboard responds with a user', async () => {
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

    const session = await fetchDashboardSession({
      origin: 'https://lezu.app',
      protocol: 'https:',
      hostname: 'lezu.app',
    }, fetchImplementation as any)

    expect(fetchImplementation).toHaveBeenCalledWith('https://app.lezu.app/api/auth/get-session', {
      credentials: 'include',
    })
    expect(session?.user.email).toBe('jane@example.com')
  })

  it('returns null when the dashboard session endpoint responds with 401', async () => {
    const fetchImplementation = vi.fn().mockResolvedValue({
      status: 401,
      ok: false,
    })

    const session = await fetchDashboardSession({
      origin: 'https://lezu.app',
      protocol: 'https:',
      hostname: 'lezu.app',
    }, fetchImplementation as any)

    expect(session).toBeNull()
  })
})
