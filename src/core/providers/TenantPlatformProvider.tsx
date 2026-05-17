import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { TenantPlatformContext, type TenantPlatformContextValue } from '@/core/providers/tenant-platform-context'
import { defaultBootstrapWithoutTenant } from '@/core/settings/defaults'
import {
  fetchTenantBootstrap,
  tenantBootstrapQueryKey,
} from '@/core/settings/tenant-bootstrap.api'
import type { ModuleId, TenantBranding } from '@/core/settings/types'
import { env } from '@/core/env'
import { useApplyTenantBranding } from '@/core/theme/useApplyTenantBranding'
import { useTenant } from '@/hooks/useTenant'
import type { BusinessSegmentId } from '@/modules/financial/types'

function segmentFromEnv(): BusinessSegmentId {
  const raw = env.businessSegment.toLowerCase()
  if (raw === 'retail' || raw === 'services' || raw === 'wholesale') return raw
  return 'retail'
}

export function TenantPlatformProvider({ children }: { children: ReactNode }) {
  const { tenant } = useTenant()
  const tenantId = tenant?.id?.trim() ?? ''

  const query = useQuery({
    queryKey: tenantBootstrapQueryKey(tenantId || '__none__'),
    queryFn: () => fetchTenantBootstrap(tenantId),
    enabled: Boolean(tenantId),
    staleTime: 60_000,
  })

  const bootstrap = useMemo(() => {
    if (!tenantId) return defaultBootstrapWithoutTenant()
    if (query.data) return query.data
    return defaultBootstrapWithoutTenant()
  }, [tenantId, query.data])

  const displayBranding: TenantBranding = useMemo(
    () => ({ ...bootstrap.branding, appDisplayName: bootstrap.branding.appDisplayName ?? tenant?.name }),
    [bootstrap.branding, tenant?.name],
  )

  useApplyTenantBranding({ primaryOklch: bootstrap.branding.primaryOklch })

  useEffect(() => {
    const title = displayBranding.appDisplayName ?? env.appName
    if (title) {
      document.title = title
    }
  }, [displayBranding.appDisplayName])

  useEffect(() => {
    const href = displayBranding.faviconUrl
    if (!href) return
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    const prev = link.href
    link.href = href
    return () => {
      link.href = prev
    }
  }, [displayBranding.faviconUrl])

  const resolvedSegment: BusinessSegmentId = useMemo(() => {
    const s = bootstrap.segment
    if (s === 'retail' || s === 'services' || s === 'wholesale') return s
    return segmentFromEnv()
  }, [bootstrap.segment])

  const isModuleEnabled = useCallback(
    (id: ModuleId) => {
      return bootstrap.features[id] === true
    },
    [bootstrap.features],
  )

  const refetchBootstrap = useCallback(() => {
    void query.refetch()
  }, [query])

  const brandName = displayBranding.appDisplayName ?? env.appName

  const value = useMemo(
    (): TenantPlatformContextValue => ({
      bootstrap,
      brandName,
      logoUrl: displayBranding.logoUrl,
      isLoading: Boolean(tenantId) && query.isLoading,
      isError: query.isError,
      error: query.error instanceof Error ? query.error : query.error ? new Error(String(query.error)) : null,
      refetch: refetchBootstrap,
      isModuleEnabled,
      resolvedSegment,
    }),
    [
      bootstrap,
      brandName,
      displayBranding.logoUrl,
      tenantId,
      query.isLoading,
      query.isError,
      query.error,
      refetchBootstrap,
      isModuleEnabled,
      resolvedSegment,
    ],
  )

  return <TenantPlatformContext.Provider value={value}>{children}</TenantPlatformContext.Provider>
}
