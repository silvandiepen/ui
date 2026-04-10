import { computed, onMounted, ref } from 'vue'
import { getDashboardAuthUrl, getDashboardUrl, type DashboardLocationLike } from '@lezu/core'

export interface DashboardSessionUser {
  id: string
  email: string
  name?: string | null
}

interface DashboardSessionPayload {
  user: DashboardSessionUser
}

type DashboardSessionFetch = typeof fetch

export async function fetchDashboardSession(
  locationLike: DashboardLocationLike = getBrowserLocation(),
  fetchImplementation: DashboardSessionFetch | null = getBrowserFetch()
): Promise<DashboardSessionPayload | null> {
  if (!fetchImplementation) {
    return null
  }

  const response = await fetchImplementation(getDashboardUrl('api/auth/get-session', {}, locationLike), {
    credentials: 'include',
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to load dashboard session')
  }

  const payload = await response.json()
  return payload?.user ? payload as DashboardSessionPayload : null
}

export function useDashboardSession(
  locationLike: DashboardLocationLike = getBrowserLocation(),
  fetchImplementation: DashboardSessionFetch | null = getBrowserFetch()
) {
  const user = ref<DashboardSessionUser | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)
  const dashboardAuthUrl = computed(() => getDashboardAuthUrl({}, locationLike))
  const dashboardProjectsUrl = computed(() => getDashboardUrl('projects', {}, locationLike))

  async function refreshSession(): Promise<DashboardSessionPayload | null> {
    try {
      const session = await fetchDashboardSession(locationLike, fetchImplementation)
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
    dashboardAuthUrl,
    dashboardProjectsUrl,
    refreshSession,
  }
}

function getBrowserLocation(): DashboardLocationLike {
  if (typeof window === 'undefined') {
    return {
      origin: 'http://localhost:8787',
      protocol: 'http:',
      hostname: 'localhost',
    }
  }

  return {
    origin: window.location.origin,
    protocol: window.location.protocol,
    hostname: window.location.hostname,
  }
}

function getBrowserFetch(): DashboardSessionFetch | null {
  if (typeof fetch === 'function') {
    return fetch.bind(globalThis)
  }

  return null
}
