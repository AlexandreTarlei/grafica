import { useAuth } from '@/hooks/useAuth'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { DashboardChartsSection } from '@/modules/dashboard/components/DashboardChartsSection'
import { DashboardHeader } from '@/modules/dashboard/components/DashboardHeader'
import { DashboardShell } from '@/modules/dashboard/components/DashboardShell'
import { DashboardSidebarWidgets } from '@/modules/dashboard/components/DashboardSidebarWidgets'
import { DashboardTablesSection } from '@/modules/dashboard/components/DashboardTablesSection'
import { KpiStatGrid } from '@/modules/dashboard/components/KpiStatGrid'
import { useDashboardSnapshot } from '@/modules/dashboard/hooks/useDashboardSnapshot'
import { PeriodRangePicker } from '@/modules/financial/components/PeriodRangePicker'
import { useFinancialPeriod } from '@/modules/financial/hooks/useFinancialPeriod'
import { FinancialErrorState } from '@/modules/financial/widgets/FinancialErrorState'
import { SignageOperationalSection } from '@/modules/signage/dashboard/widgets/SignageOperationalSection'

export function DashboardPage() {
  const { user } = useAuth()
  const { isModuleEnabled } = useTenantPlatform()
  const signageEnabled = isModuleEnabled('signage')
  const { period, setPeriod, periodInvalid } = useFinancialPeriod()
  const snapshot = useDashboardSnapshot(period)

  return (
    <DashboardShell>
      <DashboardHeader
        userName={user?.name ?? user?.email}
        actions={
          <PeriodRangePicker
            key={`${period.from}-${period.to}`}
            period={period}
            onChange={setPeriod}
            invalid={periodInvalid}
          />
        }
      />

      {snapshot.isError ? (
        <FinancialErrorState error={snapshot.error} onRetry={() => void snapshot.refetch()} />
      ) : (
        <KpiStatGrid data={snapshot.data} loading={snapshot.isLoading} />
      )}

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-6 xl:col-span-8">
          <DashboardChartsSection period={period} />
          <DashboardTablesSection />
          {signageEnabled ? <SignageOperationalSection variant="compact" /> : null}
        </div>
        <div className="xl:col-span-4">
          <DashboardSidebarWidgets snapshot={snapshot.data} snapshotLoading={snapshot.isLoading} />
        </div>
      </div>
    </DashboardShell>
  )
}
