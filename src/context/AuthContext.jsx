import { createContext, useContext, useState } from 'react'
import { login as apiLogin, getAuth, setAuth, clearAuth, decodeJwt } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getAuth())

  async function login(email, password, tenantId) {
    const data = await apiLogin(email, password, tenantId)
    const claims = decodeJwt(data.token)
    const session = {
      token: data.token,
      userId: data.userId || claims.sub,
      role: data.role || claims.role,
      tenantId: data.tenantId || claims.tenantId,
      name: data.name || email,
    }
    setAuth(session)
    setUser(session)
    return session
  }

  function logout() {
    clearAuth()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
