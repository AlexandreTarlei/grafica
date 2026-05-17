import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/useCurrentCompanyId'
import type { AdminOrderStatus } from '@/modules/admin/orders/types'
import { patchAdminOrderStatus } from '@/modules/admin/orders/services/ordersAdmin.api'
import { adminOrderDetailQueryKey } from '@/modules/admin/orders/hooks/useAdminOrderDetail'

export function useUpdateOrderStatus() {
  const companyId = useCurrentCompanyId()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      nota,
    }: {
      id: string
      status: AdminOrderStatus
      nota?: string
    }) => patchAdminOrderStatus(companyId as number, id, { status, nota }),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: adminOrderDetailQueryKey(companyId, vars.id) })
      void qc.invalidateQueries({ queryKey: ['admin', 'orders', 'list'] })
    },
  })
}
