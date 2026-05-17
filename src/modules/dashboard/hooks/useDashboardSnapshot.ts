import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { useFinancialKpis } from '@/modules/financial/hooks/useFinancialKpis'
import { getCashFlowSeries } from '@/modules/financial/services/financial.api'
import { financialPeriodQueryKey } from '@/modules/financial/hooks/useFinancialPeriod'
import type { FinancialPeriod } from '@/modules/financial/types'
import type { DashboardSnapshot } from '@/modules/dashboard/types'
import { mergeDashboardSnapshot } from '@/modules/dashboard/utils/derive-kpis'
import {
  fetchSignageDashboard,
  signageDashboardKey,
} from '@/modules/signage/dashboard/services/signage-dashboard.api'

export function useDashboardSnapshot(period: FinancialPeriod) {
  const companyId = useCurrentCompanyId()
  const { isModuleEnabled } = useTenantPlatform()
  const signageEnabled = isModuleEnabled('signage')

  const financialQ = useFinancialKpis(period)

  const signageQ = useQuery({
    queryKey: signageDashboardKey(companyId),
    queryFn: () => fetchSignageDashboard(companyId as number),
    enabled: companyId != null && signageEnabled,
    staleTime: 60_000,
  })

  const cashFlowQ = useQuery({
    queryKey: ['admin', 'dashboard', 'cashflow-tail', companyId, ...financialPeriodQueryKey(period)],
    queryFn: async () => {
      const series = await getCashFlowSeries(period)
      return series.at(-1)?.saldo ?? 0
    },
    enabled: companyId != null,
    staleTime: 60_000,
  })

  const isLoading = financialQ.isLoading || (signageEnabled && signageQ.isLoading) || cashFlowQ.isLoading
  const isError = financialQ.isError

  const data: DashboardSnapshot | undefined = financialQ.data
    ? mergeDashboardSnapshot(
        financialQ.data,
        signageEnabled ? signageQ.data : null,
        cashFlowQ.data,
      )
    : undefined

  return {
    data,
    isLoading,
    isError,
    error: financialQ.error,
    refetch: () => {
      void financialQ.refetch()
      void signageQ.refetch()
      void cashFlowQ.refetch()
    },
  }
}
