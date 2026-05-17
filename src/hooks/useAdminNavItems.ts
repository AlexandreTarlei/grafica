import { useMemo } from 'react'
import { ADMIN_NAV_DEFINITIONS, type AdminNavItem } from '@/config/admin-nav'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { isNavIdHidden } from '@/core/settings/defaults'
import type { Permission } from '@/core/types/permissions'
import { usePermissions } from '@/hooks/usePermissions'

function itemVisible(item: AdminNavItem, canAny: (p: Permission[]) => boolean): boolean {
  if (item.permission === undefined) return true
  const perms = Array.isArray(item.permission) ? [...item.permission] : [item.permission]
  return canAny(perms)
}

export function useAdminNavItems(): AdminNavItem[] {
  const { canAny } = usePermissions()
  const { isModuleEnabled, bootstrap } = useTenantPlatform()

  return useMemo(() => {
    return ADMIN_NAV_DEFINITIONS.filter((def) => {
      if (!isModuleEnabled(def.moduleId)) return false
      if (isNavIdHidden(bootstrap.menu, def.id)) return false
      const { id, label, path, icon, permission, matchExact } = def
      return itemVisible({ id, label, path, icon, permission, matchExact }, canAny)
    }).map((def): AdminNavItem => ({
      id: def.id,
      label: def.label,
      path: def.path,
      icon: def.icon,
      permission: def.permission,
      matchExact: def.matchExact,
    }))
  }, [canAny, isModuleEnabled, bootstrap.menu])
}
