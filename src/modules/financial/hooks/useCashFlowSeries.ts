import { useQuery } from '@tanstack/react-query'
import { financialPeriodQueryKey } from '@/modules/financial/hooks/useFinancialPeriod'
import { getCashFlowSeries } from '@/modules/financial/services/financial.api'
import type { FinancialPeriod } from '@/modules/financial/types'

export function useCashFlowSeries(period: FinancialPeriod) {
  return useQuery({
    queryKey: ['admin', 'financial', 'series', 'cash-flow', ...financialPeriodQueryKey(period)],
    queryFn: () => getCashFlowSeries(period),
  })
}
