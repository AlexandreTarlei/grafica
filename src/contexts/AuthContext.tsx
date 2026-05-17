import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '@/core/constants'
import type { AuthUser } from '@/modules/auth/types'
import { patchHttpContextBridge } from '@/services/http/context-bridge'
import { decodeJwtPayload } from '@/utils/jwt'

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: AuthUser, refreshToken?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredAuth(): {
  token: string | null
  refreshToken: string | null
  user: AuthUser | null
} {
  const token = sessionStorage.getItem(STORAGE_KEYS.accessToken)
  const refreshToken = sessionStorage.getItem(STORAGE_KEYS.refreshToken)
  const rawUser = sessionStorage.getItem(STORAGE_KEYS.user)
  if (!token || !rawUser) return { token: null, refreshToken: null, user: null }
  try {
    const user = JSON.parse(rawUser) as AuthUser
    return { token, refreshToken, user }
  } catch {
    return { token: null, refreshToken: null, user: null }
  }
}

function mergeUserFromToken(user: AuthUser, token: string): AuthUser {
  const payload = decodeJwtPayload(token)
  if (!payload) return user
  const fromJwtPermissions = payload.permissions ?? payload.perms
  const fromJwtRoles = payload.roles
  const permissions = Array.isArray(fromJwtPermissions)
    ? (fromJwtPermissions as AuthUser['permissions'])
    : user.permissions
  const roles = Array.isArray(fromJwtRoles) ? (fromJwtRoles as string[]) : user.roles
  return { ...user, permissions, roles }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [{ token, refreshToken, user }, setAuth] = useState(() => readStoredAuth())
  const tokenRef = useRef<string | null>(token)
  const refreshRef = useRef<string | null>(refreshToken)

  useEffect(() => {
    tokenRef.current = token
  }, [token])

  useEffect(() => {
    refreshRef.current = refreshToken
  }, [refreshToken])

  const login = useCallback((nextToken: string, nextUser: AuthUser, nextRefresh?: string) => {
    const merged = mergeUserFromToken(nextUser, nextToken)
    sessionStorage.setItem(STORAGE_KEYS.accessToken, nextToken)
    sessionStorage.setItem(STORAGE_KEYS.user, JSON.stringify(merged))
    if (nextRefresh) {
      sessionStorage.setItem(STORAGE_KEYS.refreshToken, nextRefresh)
    }
    setAuth({
      token: nextToken,
      refreshToken: nextRefresh ?? refreshRef.current,
      user: merged,
    })
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.accessToken)
    sessionStorage.removeItem(STORAGE_KEYS.refreshToken)
    sessionStorage.removeItem(STORAGE_KEYS.user)
    setAuth({ token: null, refreshToken: null, user: null })
    navigate('/login', { replace: true })
  }, [navigate])

  const handleTokensRefreshed = useCallback((accessToken: string, newRefresh: string) => {
    sessionStorage.setItem(STORAGE_KEYS.accessToken, accessToken)
    sessionStorage.setItem(STORAGE_KEYS.refreshToken, newRefresh)
    tokenRef.current = accessToken
    refreshRef.current = newRefresh
    setAuth((prev) => ({
      ...prev,
      token: accessToken,
      refreshToken: newRefresh,
    }))
  }, [])

  useEffect(() => {
    patchHttpContextBridge({
      getToken: () => tokenRef.current,
      getRefreshToken: () => refreshRef.current,
      onUnauthorized: logout,
      onTokensRefreshed: handleTokensRefreshed,
    })
  }, [logout, handleTokensRefreshed])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [user, token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
