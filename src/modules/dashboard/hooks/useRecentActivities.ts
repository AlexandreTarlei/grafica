import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { subHours } from 'date-fns'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { useTenantPlatform } from '@/core/providers/useTenantPlatform'
import type { ActivityItem } from '@/modules/dashboard/types'
import {
  fetchSignageDashboard,
  signageDashboardKey,
} from '@/modules/signage/dashboard/services/signage-dashboard.api'
import { useRecentOrders } from '@/modules/dashboard/hooks/useRecentOrders'

export function useRecentActivities() {
  const companyId = useCurrentCompanyId()
  const { isModuleEnabled } = useTenantPlatform()
  const ordersQ = useRecentOrders()

  const signageQ = useQuery({
    queryKey: signageDashboardKey(companyId),
    queryFn: () => fetchSignageDashboard(companyId as number),
    enabled: companyId != null && isModuleEnabled('signage'),
    staleTime: 60_000,
  })

  const items = useMemo((): ActivityItem[] => {
    const now = new Date()
    const fromOrders: ActivityItem[] =
      ordersQ.rows.slice(0, 4).map((o, i) => ({
        id: `order-${o.id}`,
        title: `Pedido ${o.primary}`,
        description: o.secondary,
        timestamp: subHours(now, i + 1).toISOString(),
        tone: o.statusTone === 'danger' ? 'danger' : 'info',
      })) ?? []

    const fromSignage: ActivityItem[] =
      signageQ.data?.operationalStatus.map((s, i) => ({
        id: `sig-${i}`,
        title: s.label,
        timestamp: subHours(now, i + 2).toISOString(),
        tone: s.tone,
      })) ?? []

    const seed: ActivityItem[] = [
      {
        id: 'a1',
        title: 'Relatório financeiro disponível',
        description: 'Período atualizado',
        timestamp: subHours(now, 3).toISOString(),
        tone: 'success',
      },
    ]

    return [...fromOrders, ...fromSignage, ...seed].slice(0, 12)
  }, [ordersQ.rows, signageQ.data])

  return {
    items,
    isLoading: ordersQ.isLoading || signageQ.isLoading,
  }
}
