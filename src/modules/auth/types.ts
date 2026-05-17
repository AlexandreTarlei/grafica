import type { Permission } from '@/core/types/permissions'

export type AuthUser = {
  id: string
  email: string
  name?: string
  permissions: Permission[]
  roles?: string[]
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  /** Presente na API FastAPI; guardar se implementar refresh no browser. */
  refreshToken?: string
  user: AuthUser
}
