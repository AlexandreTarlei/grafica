import { useQuery } from '@tanstack/react-query'
import { financialPeriodQueryKey } from '@/modules/financial/hooks/useFinancialPeriod'
import { getRevenueSeries } from '@/modules/financial/services/financial.api'
import type { FinancialPeriod } from '@/modules/financial/types'

export function useRevenueSeries(period: FinancialPeriod) {
  return useQuery({
    queryKey: ['admin', 'financial', 'series', 'revenue', ...financialPeriodQueryKey(period)],
    queryFn: () => getRevenueSeries(period),
  })
}
