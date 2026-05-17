import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { TENANT_STORAGE_KEY } from '@/core/constants'
import { env } from '@/core/env'
import { patchHttpContextBridge } from '@/services/http/context-bridge'

export type TenantInfo = {
  id: string
  name?: string
  slug?: string
}

type TenantContextValue = {
  tenant: TenantInfo | null
  setTenant: (tenant: TenantInfo | null) => void
}

const TenantContext = createContext<TenantContextValue | null>(null)

function readStoredTenant(): TenantInfo | null {
  const raw = sessionStorage.getItem(TENANT_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as TenantInfo
    if (parsed && typeof parsed.id === 'string') return parsed
  } catch {
    /* ignore */
  }
  return null
}

function readInitialTenant(): TenantInfo | null {
  const stored = readStoredTenant()
  if (stored) return stored
  if (env.companyId != null) {
    return { id: String(env.companyId), name: String(env.companyId) }
  }
  if (env.defaultTenantId) {
    return { id: env.defaultTenantId, name: env.defaultTenantId }
  }
  return null
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenantState] = useState<TenantInfo | null>(() => readInitialTenant())

  const setTenant = useCallback((next: TenantInfo | null) => {
    setTenantState(next)
    if (next) {
      sessionStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(next))
    } else {
      sessionStorage.removeItem(TENANT_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    patchHttpContextBridge({
      getTenantId: () => tenant?.id ?? null,
    })
  }, [tenant])

  const value = useMemo(() => ({ tenant, setTenant }), [tenant, setTenant])

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext)
  if (!ctx) {
    throw new Error('useTenant deve ser usado dentro de TenantProvider')
  }
  return ctx
}
