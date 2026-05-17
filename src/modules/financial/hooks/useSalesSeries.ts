import { useQuery } from '@tanstack/react-query'
import { financialPeriodQueryKey } from '@/modules/financial/hooks/useFinancialPeriod'
import { getSalesSeries } from '@/modules/financial/services/financial.api'
import type { FinancialGranularity, FinancialPeriod } from '@/modules/financial/types'

export function useSalesSeries(period: FinancialPeriod, granularity: FinancialGranularity = 'day') {
  return useQuery({
    queryKey: ['admin', 'financial', 'series', 'sales', ...financialPeriodQueryKey(period), granularity],
    queryFn: () => getSalesSeries(period, granularity),
  })
}
