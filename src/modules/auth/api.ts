import { http } from '@/services/http/client'
import type { AuthUser, LoginRequest, LoginResponse } from './types'

/** Resposta OpenAPI/FastAPI (snake_case). */
type UserPublicApi = {
  id: number
  email: string
  full_name: string
  is_active: boolean
  last_login_at?: string | null
  created_at?: string
}

type LoginResponseApi = {
  access_token: string
  refresh_token: string
  token_type?: string
  expires_in: number
  refresh_expires_in: number
  user: UserPublicApi
}

function mapAuthUser(u: UserPublicApi): AuthUser {
  return {
    id: String(u.id),
    email: u.email,
    name: u.full_name,
    permissions: [],
  }
}

/**
 * POST /auth/login — normaliza o contrato FastAPI para o formato do frontend.
 */
export async function loginApi(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponseApi>('/auth/login', body)
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: mapAuthUser(data.user),
  }
}

export type RegisterRequest = {
  email: string
  password: string
  full_name: string
}

/**
 * POST /auth/register — cria utilizador (sem tokens); em seguida use loginApi para sessão.
 */
export async function registerApi(body: RegisterRequest): Promise<AuthUser> {
  const { data } = await http.post<UserPublicApi>('/auth/register', body)
  return mapAuthUser(data)
}

type RefreshResponseApi = {
  access_token: string
  refresh_token: string
  token_type?: string
  expires_in: number
  refresh_expires_in: number
}

export async function refreshTokenApi(refreshToken: string): Promise<LoginResponse> {
  const { data } = await http.post<RefreshResponseApi>('/auth/refresh', {
    refresh_token: refreshToken,
  })
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: { id: '', email: '', name: '', permissions: [] },
  }
}
