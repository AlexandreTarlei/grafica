import { useAdminOrdersList } from '@/modules/admin/orders/hooks/useAdminOrdersList'
import type { RecentTableRow } from '@/modules/dashboard/types'
import { formatCurrency } from '@/modules/signage/shared/utils/format'

const statusToneMap: Record<string, RecentTableRow['statusTone']> = {
  pendente: 'warning',
  confirmado: 'info',
  em_preparacao: 'info',
  enviado: 'success',
  entregue: 'success',
  cancelado: 'danger',
}

const statusLabel: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  em_preparacao: 'Em preparação',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

export function useRecentOrders() {
  const q = useAdminOrdersList({
    page: 1,
    pageSize: 8,
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  })

  const rows: RecentTableRow[] =
    q.data?.items.map((o) => ({
      id: o.id,
      primary: o.numero,
      secondary: o.clienteNome,
      meta: formatCurrency(o.total),
      status: statusLabel[o.status] ?? o.status,
      statusTone: statusToneMap[o.status] ?? 'default',
      href: `/admin/pedidos/${o.id}`,
    })) ?? []

  return { ...q, rows }
}
