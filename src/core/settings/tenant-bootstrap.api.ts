/**
 * Contrato esperado (FastAPI) — ajuste ao backend real:
 *
 * - GET /tenants/{tenantId}/bootstrap
 *   ou GET /me/tenant-bootstrap (tenant inferido do token)
 *
 * Resposta: branding, features por módulo, segment opcional, overrides de menu.
 */
import { http } from '@/services/http/client'
import { env } from '@/core/env'
import type { TenantBootstrap } from '@/core/settings/types'
import { defaultBootstrapWithoutTenant, mergeBootstrapWithDefaults } from '@/core/settings/defaults'

const USE_MOCK = import.meta.env.VITE_USE_TENANT_BOOTSTRAP_MOCK !== 'false'

async function mockDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200))
}

function mockBootstrap(tenantId: string): TenantBootstrap {
  const signageDemo = env.commercialVertical === 'signage'
  return mergeBootstrapWithDefaults({
    tenantId,
    branding: {
      appDisplayName: signageDemo ? (env.appName !== 'SaaS' ? env.appName : 'Wrap Studio Demo') : undefined,
      primaryOklch: signageDemo
        ? 'oklch(0.58 0.24 290)'
        : tenantId.length % 2 === 0
          ? 'oklch(0.52 0.19 264)'
          : undefined,
    },
    features: {
      core: true,
      orders: true,
      financial: true,
      ecommerce: true,
      automations: true,
      reports: true,
      analytics: true,
      signage: signageDemo,
      rentals: false,
      contracts: false,
      crm: signageDemo,
      support: false,
    },
    segment: signageDemo ? 'services' : 'retail',
    menu: { hiddenNavIds: [] },
  })
}

function assertBootstrap(data: unknown, tenantId: string): TenantBootstrap {
  if (!data || typeof data !== 'object') throw new Error('Bootstrap inválido')
  const o = data as Record<string, unknown>
  const id = typeof o.tenantId === 'string' ? o.tenantId : tenantId
  const branding = (o.branding && typeof o.branding === 'object' ? o.branding : {}) as TenantBootstrap['branding']
  const features = (o.features && typeof o.features === 'object' ? o.features : {}) as Partial<
    TenantBootstrap['features']
  >
  const segment = o.segment as TenantBootstrap['segment'] | undefined
  const menu = o.menu as TenantBootstrap['menu'] | undefined
  return mergeBootstrapWithDefaults({
    tenantId: id,
    branding,
    features,
    segment,
    menu,
  })
}

export async function fetchTenantBootstrap(tenantId: string): Promise<TenantBootstrap> {
  if (!tenantId) {
    return defaultBootstrapWithoutTenant()
  }
  if (USE_MOCK) {
    await mockDelay()
    return mockBootstrap(tenantId)
  }
  const { data } = await http.get<unknown>(`/tenants/${encodeURIComponent(tenantId)}/bootstrap`)
  return assertBootstrap(data, tenantId)
}

export const tenantBootstrapQueryKey = (tenantId: string) => ['tenant', 'bootstrap', tenantId] as const
