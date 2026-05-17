import { createContext } from 'react'
import type { ModuleId, TenantBootstrap } from '@/core/settings/types'
import type { BusinessSegmentId } from '@/modules/financial/types'

export type TenantPlatformContextValue = {
  bootstrap: TenantBootstrap
  brandName: string
  logoUrl?: string
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
  isModuleEnabled: (id: ModuleId) => boolean
  resolvedSegment: BusinessSegmentId
}

export const TenantPlatformContext = createContext<TenantPlatformContextValue | null>(null)
