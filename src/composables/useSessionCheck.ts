import { computed, onMounted, ref } from 'vue'

export interface SessionCheckUser {
  id: string
  email: string
  name?: string | null
}

export interface SessionCheckConfig {
  baseUrl: string
  authPath?: string
}

interface SessionPayload {
  user: SessionCheckUser
}

type SessionFetch = typeof fetch

export async function fetchSession(
  config: SessionCheckConfig,
  fetchImplementation: SessionFetch | null = getBrowserFetch()
): Promise<SessionPayload | null> {
  if (!fetchImplementation) {
    return null
  }

  const authUrl = buildUrl(config)

  const response = await fetchImplementation(authUrl, {
    credentials: 'include',
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to load session')
  }

  const payload = await response.json()
  return payload?.user ? payload as SessionPayload : null
}

export function useSessionCheck(
  config: SessionCheckConfig,
  fetchImplementation: SessionFetch | null = getBrowserFetch()
) {
  const user = ref<SessionCheckUser | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)
  const authUrl = computed(() => buildUrl(config))
  const dashboardUrl = computed(() => config.baseUrl)

  async function refreshSession(): Promise<SessionPayload | null> {
    try {
      const session = await fetchSession(config, fetchImplementation)
      user.value = session?.user ?? null
      return session
    } catch {
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void refreshSession()
  })

  return {
    user,
    loading,
    isAuthenticated,
    authUrl,
    dashboardUrl,
    refreshSession,
  }
}

function buildUrl(config: SessionCheckConfig): string {
  const base = config.baseUrl.replace(/\/+$/, '')
  const path = (config.authPath || 'api/auth/get-session').replace(/^\/+/, '')
  return `${base}/${path}`
}

function getBrowserFetch(): SessionFetch | null {
  if (typeof fetch === 'function') {
    return fetch.bind(globalThis)
  }

  return null
}
