import { useQuery } from '@tanstack/react-query'
import { financialPeriodQueryKey } from '@/modules/financial/hooks/useFinancialPeriod'
import { getOrdersSeries } from '@/modules/financial/services/financial.api'
import type { FinancialPeriod } from '@/modules/financial/types'

export function useOrdersSeries(period: FinancialPeriod) {
  return useQuery({
    queryKey: ['admin', 'financial', 'series', 'orders', ...financialPeriodQueryKey(period)],
    queryFn: () => getOrdersSeries(period),
  })
}
