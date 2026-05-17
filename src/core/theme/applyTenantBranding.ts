import type { TenantBranding } from '@/core/settings/types'

const KEYS = ['--primary', '--sidebar-primary'] as const

/** Aplica variáveis CSS de marca (white-label). Não altera light/dark do utilizador. */
export function applyTenantBrandingVars(branding: TenantBranding): void {
  if (branding.primaryOklch) {
    document.documentElement.style.setProperty('--primary', branding.primaryOklch)
    document.documentElement.style.setProperty('--sidebar-primary', branding.primaryOklch)
  }
}

export function resetTenantBrandingVars(): void {
  for (const key of KEYS) {
    document.documentElement.style.removeProperty(key)
  }
}
