import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/core/env'
import { refreshTokenApi } from '@/modules/auth/api'
import {
  notifyTokensRefreshed,
  notifyUnauthorized,
  readRefreshTokenForRequest,
  readTenantIdForRequest,
  readTokenForRequest,
} from '@/services/http/context-bridge'

export const http = axios.create({
  baseURL: env.apiUrl || undefined,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let refreshPromise: Promise<string | null> | null = null

async function tryRefreshAccessToken(): Promise<string | null> {
  const refresh = readRefreshTokenForRequest()
  if (!refresh) return null
  if (!refreshPromise) {
    refreshPromise = refreshTokenApi(refresh)
      .then((data) => {
        notifyTokensRefreshed(data.accessToken, data.refreshToken ?? refresh)
        return data.accessToken
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

http.interceptors.request.use((config) => {
  const rel = String(config.url ?? '')
  const skipBearer =
    rel.includes('/auth/login') || rel.includes('/auth/register') || rel.includes('/auth/refresh')
  if (!skipBearer) {
    const token = readTokenForRequest()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  const tenantId = readTenantIdForRequest()
  if (tenantId) {
    config.headers['X-Tenant-Id'] = tenantId
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const cfg = error.config as RetryConfig | undefined
    const url = String(cfg?.url ?? '')

    if (import.meta.env.DEV && status != null && status >= 500) {
      const base = String(cfg?.baseURL ?? '')
      const fullUrl = url.startsWith('http') ? url : `${base}${url}`
      const method = String(cfg?.method ?? 'get').toUpperCase()
      console.error(
        `[API ${status}] ${method} ${fullUrl || url}`,
        error.response?.data ?? error.message,
      )
    }

    if (
      status === 401 &&
      cfg &&
      !cfg._retry &&
      !url.includes('/auth/login') &&
      !url.includes('/auth/register') &&
      !url.includes('/auth/refresh')
    ) {
      cfg._retry = true
      const newToken = await tryRefreshAccessToken()
      if (newToken) {
        cfg.headers.Authorization = `Bearer ${newToken}`
        return http(cfg)
      }
      if (readTokenForRequest() || readRefreshTokenForRequest()) {
        notifyUnauthorized()
      }
    } else if (status === 401 && !url.includes('/auth/login')) {
      if (readTokenForRequest() || readRefreshTokenForRequest()) {
        notifyUnauthorized()
      }
    }

    return Promise.reject(error)
  },
)
