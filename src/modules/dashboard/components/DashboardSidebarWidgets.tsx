import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import { ActivityFeed } from '@/modules/dashboard/components/ActivityFeed'
import { AlertsWidget } from '@/modules/dashboard/components/AlertsWidget'
import { GoalsWidget } from '@/modules/dashboard/components/GoalsWidget'
import { NotificationsWidget } from '@/modules/dashboard/components/NotificationsWidget'
import { QuickSummaryWidget } from '@/modules/dashboard/components/QuickSummaryWidget'
import { SystemStatusWidget } from '@/modules/dashboard/components/SystemStatusWidget'
import { useRecentActivities } from '@/modules/dashboard/hooks/useRecentActivities'
import type { DashboardSnapshot } from '@/modules/dashboard/types'
import {
  fetchSignageDashboard,
  signageDashboardKey,
} from '@/modules/signage/dashboard/services/signage-dashboard.api'

type DashboardSidebarWidgetsProps = {
  snapshot?: DashboardSnapshot | null
  snapshotLoading?: boolean
}

export function DashboardSidebarWidgets({ snapshot, snapshotLoading }: DashboardSidebarWidgetsProps) {
  const companyId = useCurrentCompanyId()
  const { isModuleEnabled } = useTenantPlatform()
  const activities = useRecentActivities()

  const signageQ = useQuery({
    queryKey: signageDashboardKey(companyId),
    queryFn: () => fetchSignageDashboard(companyId as number),
    enabled: companyId != null && isModuleEnabled('signage'),
    staleTime: 60_000,
  })

  return (
    <aside className="flex flex-col gap-4">
      <QuickSummaryWidget data={snapshot} loading={snapshotLoading} />
      <GoalsWidget data={snapshot} />
      <NotificationsWidget items={signageQ.data?.operationalStatus} />
      <AlertsWidget data={snapshot} operationalAlerts={signageQ.data?.operationalStatus} />
      <ActivityFeed items={activities.items} loading={activities.isLoading} />
      <SystemStatusWidget />
    </aside>
  )
}
