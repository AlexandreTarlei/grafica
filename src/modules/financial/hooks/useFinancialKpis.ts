import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { getFinancialKpis } from '@/modules/financial/services/financial.api'
import { financialPeriodQueryKey } from '@/modules/financial/hooks/useFinancialPeriod'
import type { FinancialPeriod } from '@/modules/financial/types'

export function useFinancialKpis(period: FinancialPeriod) {
  const companyId = useCurrentCompanyId()
  return useQuery({
    queryKey: ['admin', 'financial', 'kpis', companyId, ...financialPeriodQueryKey(period)],
    queryFn: () => getFinancialKpis(companyId as number, period),
    enabled: companyId != null,
  })
}
