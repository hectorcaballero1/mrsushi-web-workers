const API_URL = import.meta.env.VITE_API_URL
const AUTH_KEY = 'mrsushi_auth'

export function getAuth() {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null
  const auth = JSON.parse(raw)
  // Sesión inválida o token vencido → limpiar y tratar como no logueado
  if (!auth?.token || isTokenExpired(auth.token)) {
    clearAuth()
    return null
  }
  return auth
}

export function isTokenExpired(token) {
  const claims = decodeJwt(token)
  if (!claims.exp) return false // sin exp → no podemos saberlo, lo dejamos pasar
  return claims.exp <= Date.now() / 1000
}

export function setAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
}

export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return {}
  }
}

export async function api(path, opts = {}) {
  const auth = getAuth()
  const headers = { 'Content-Type': 'application/json', ...opts.headers }
  if (auth?.token) headers.Authorization = `Bearer ${auth.token}`

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers })
  const text = await res.text()
  let data = text ? JSON.parse(text) : null

  // API Gateway devuelve { statusCode, body } cuando el Lambda no usa proxy integration
  if (data?.body !== undefined) {
    try { data = JSON.parse(data.body) } catch { data = data.body }
  }

  if (!res.ok) {
    if (res.status === 401 && getAuth()) {
      clearAuth()
      window.location.href = '/login'
    }
    const err = new Error(data?.error || `Error ${res.status}`)
    err.status = res.status
    throw err
  }
  return data
}

export async function login(email, password, tenantId) {
  return api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role: 'worker', tenantId }),
  })
}
