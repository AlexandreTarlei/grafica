import { useMemo } from 'react'
import type { Permission } from '@/core/types/permissions'
import { useAuth } from '@/hooks/useAuth'
import { hasAllPermissions, hasAnyPermission, hasPermission } from '@/utils/permissions'

export function usePermissions() {
  const { user } = useAuth()

  return useMemo(
    () => ({
      can: (permission: Permission) => hasPermission(user, permission),
      canAny: (permissions: Permission[]) => hasAnyPermission(user, permissions),
      canAll: (permissions: Permission[]) => hasAllPermissions(user, permissions),
    }),
    [user],
  )
}
