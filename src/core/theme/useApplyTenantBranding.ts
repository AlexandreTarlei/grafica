import { useLayoutEffect } from 'react'
import type { TenantBranding } from '@/core/settings/types'
import { applyTenantBrandingVars, resetTenantBrandingVars } from '@/core/theme/applyTenantBranding'

export function useApplyTenantBranding(branding: TenantBranding | undefined): void {
  useLayoutEffect(() => {
    if (!branding?.primaryOklch) {
      return () => {
        resetTenantBrandingVars()
      }
    }
    applyTenantBrandingVars(branding)
    return () => {
      resetTenantBrandingVars()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só primaryOklch altera o DOM
  }, [branding?.primaryOklch])
}
