import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import { getAdminOrder } from '@/modules/admin/orders/services/ordersAdmin.api'

export function adminOrderDetailQueryKey(companyId: number | null, id: string) {
  return ['admin', 'orders', 'detail', companyId, id] as const
}

export function useAdminOrderDetail(orderId: string | undefined) {
  const companyId = useCurrentCompanyId()
  return useQuery({
    queryKey: adminOrderDetailQueryKey(companyId, orderId ?? ''),
    queryFn: () => getAdminOrder(companyId as number, orderId!),
    enabled: companyId != null && Boolean(orderId),
  })
}
