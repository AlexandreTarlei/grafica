import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { getFiscalSettings } from '@/modules/admin/fiscal/services/fiscal.api'

export function fiscalSettingsQueryKey(companyId: number | null) {
  return ['admin', 'fiscal', 'settings', companyId] as const
}

export function useFiscalSettings() {
  const companyId = useCurrentCompanyId()
  return useQuery({
    queryKey: fiscalSettingsQueryKey(companyId),
    queryFn: () => getFiscalSettings(companyId as number),
    enabled: companyId != null,
    staleTime: 5 * 60_000,
  })
}
