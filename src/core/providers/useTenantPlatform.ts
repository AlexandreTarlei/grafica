import { useContext } from 'react'
import { TenantPlatformContext } from '@/core/providers/tenant-platform-context'

export function useTenantPlatform() {
  const ctx = useContext(TenantPlatformContext)
  if (!ctx) {
    throw new Error('useTenantPlatform deve ser usado dentro de TenantPlatformProvider')
  }
  return ctx
}
