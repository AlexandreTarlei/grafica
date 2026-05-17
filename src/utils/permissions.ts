import type { AuthUser } from '@/modules/auth/types'
import type { Permission } from '@/core/types/permissions'

export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user?.permissions?.length) return false
  return user.permissions.includes(permission)
}

export function hasAnyPermission(user: AuthUser | null, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(user, p))
}

export function hasAllPermissions(user: AuthUser | null, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(user, p))
}
