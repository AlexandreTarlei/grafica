import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import type { AdminOrderListParams } from '@/modules/admin/orders/types'
import { listAdminOrders } from '@/modules/admin/orders/services/ordersAdmin.api'

export function adminOrdersListQueryKey(companyId: number | null, params: AdminOrderListParams) {
  return ['admin', 'orders', 'list', companyId, params] as const
}

export function useAdminOrdersList(params: AdminOrderListParams) {
  const companyId = useCurrentCompanyId()
  return useQuery({
    queryKey: adminOrdersListQueryKey(companyId, params),
    queryFn: () => listAdminOrders(companyId as number, params),
    enabled: companyId != null,
  })
}
