import type { ModuleId, TenantBootstrap, TenantFeatures } from '@/core/settings/types'
import { MODULE_IDS } from '@/core/settings/types'

const DEFAULT_ON: readonly ModuleId[] = [
  'core',
  'orders',
  'financial',
  'fiscal',
  'ecommerce',
  'automations',
  'reports',
  'analytics',
  'signage',
]

function allFeatures(over: Partial<TenantFeatures> = {}): TenantFeatures {
  const out = {} as TenantFeatures
  for (const id of MODULE_IDS) {
    const def = DEFAULT_ON.includes(id)
    out[id] = over[id] ?? def
  }
  return out
}

/** Quando não há tenant selecionado: comportamento próximo ao atual (módulos principais ativos). */
export function defaultBootstrapWithoutTenant(): TenantBootstrap {
  return {
    tenantId: '',
    branding: {},
    features: allFeatures(),
  }
}

export function mergeBootstrapWithDefaults(
  partial: Omit<Partial<TenantBootstrap>, 'features'> & {
    tenantId: string
    features?: Partial<TenantFeatures>
  },
): TenantBootstrap {
  return {
    tenantId: partial.tenantId,
    branding: partial.branding ?? {},
    features: allFeatures(partial.features),
    segment: partial.segment,
    menu: partial.menu,
  }
}

export function isNavIdHidden(menu: TenantBootstrap['menu'], navId: string): boolean {
  return Boolean(menu?.hiddenNavIds?.includes(navId))
}
