import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { ModuleId } from '@/core/settings/types'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'

type RequireModuleRouteProps = {
  moduleId: ModuleId
  children: ReactNode
  /** Destino quando o módulo está desativado. */
  redirectTo?: string
}

export function RequireModuleRoute({
  moduleId,
  children,
  redirectTo = '/admin/dashboard',
}: RequireModuleRouteProps) {
  const { isModuleEnabled } = useTenantPlatform()
  if (!isModuleEnabled(moduleId)) {
    return <Navigate to={redirectTo} replace />
  }
  return children
}
