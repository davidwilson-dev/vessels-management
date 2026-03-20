const SESSION_KEY = 'vessels_admin_session'

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

export function readSession() {
  if (!canUseStorage()) {
    return { accessToken: null, user: null }
  }

  try {
    const rawSession = window.localStorage.getItem(SESSION_KEY)
    if (!rawSession) {
      return { accessToken: null, user: null }
    }

    const session = JSON.parse(rawSession)
    return {
      accessToken: session?.accessToken ?? null,
      user: session?.user ?? null,
    }
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return { accessToken: null, user: null }
  }
}

export function writeSession(session) {
  if (!canUseStorage()) {
    return
  }

  const nextSession = {
    accessToken: session?.accessToken ?? null,
    user: session?.user ?? null,
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
}

export function setAccessToken(accessToken) {
  const session = readSession()
  writeSession({ ...session, accessToken })
}

export function setStoredUser(user) {
  const session = readSession()
  writeSession({ ...session, user })
}

export function getAccessToken() {
  return readSession().accessToken
}

export function clearSession() {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(SESSION_KEY)
}
