import { KpiStatGrid } from '@/modules/dashboard/components/KpiStatGrid'
import { useDashboardSnapshot } from '@/modules/dashboard/hooks/useDashboardSnapshot'
import type { FinancialPeriod } from '@/modules/financial/types'
import { FinancialErrorState } from '@/modules/financial/widgets/FinancialErrorState'

type ExecutiveKpiStripProps = {
  period: FinancialPeriod
  /** Texto curto sob o título da secção (opcional). */
  description?: string
}

export function ExecutiveKpiStrip({ period, description }: ExecutiveKpiStripProps) {
  const { data, isLoading, isError, error, refetch } = useDashboardSnapshot(period)

  if (isError) {
    return <FinancialErrorState error={error} onRetry={() => void refetch()} />
  }

  return (
    <div className="flex flex-col gap-3">
      {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      <KpiStatGrid data={data} loading={isLoading} />
    </div>
  )
}
