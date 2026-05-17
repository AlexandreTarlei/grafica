import { useQuery } from '@tanstack/react-query'
import { financialPeriodQueryKey } from '@/modules/financial/hooks/useFinancialPeriod'
import { getReportSummary } from '@/modules/financial/services/financial.api'
import type { FinancialPeriod } from '@/modules/financial/types'

export function useFinancialReport(period: FinancialPeriod) {
  return useQuery({
    queryKey: ['admin', 'financial', 'reports', 'summary', ...financialPeriodQueryKey(period)],
    queryFn: () => getReportSummary(period),
  })
}
