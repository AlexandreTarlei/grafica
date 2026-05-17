import type { BusinessSegmentId } from '@/modules/financial/types'

/** Módulos ativáveis por tenant (plano / configuração). */
export const MODULE_IDS = [
  'core',
  'orders',
  'financial',
  'fiscal',
  'ecommerce',
  'automations',
  'reports',
  'analytics',
  'signage',
  'rentals',
  'contracts',
  'crm',
  'support',
] as const

export type ModuleId = (typeof MODULE_IDS)[number]

export type TenantFeatures = Record<ModuleId, boolean>

export type TenantBranding = {
  /** URL pública do logótipo (white-label). */
  logoUrl?: string
  faviconUrl?: string
  /** Nome curto exibido na shell admin / loja. */
  appDisplayName?: string
  /** Cor primária em OKLCH (ex.: `oklch(0.55 0.18 250)`), alinhada a `--primary` em `:root`. */
  primaryOklch?: string
}

export type TenantMenuOverride = {
  /** IDs de entradas de menu a ocultar (ver `build-admin-nav`). */
  hiddenNavIds?: readonly string[]
}

export type TenantBootstrap = {
  tenantId: string
  branding: TenantBranding
  features: TenantFeatures
  /** Segmento de negócio para widgets (ex. financeiro); fallback env se omitido. */
  segment?: BusinessSegmentId
  menu?: TenantMenuOverride
}
