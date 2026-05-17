import { StatusBadge } from '@/components/status/StatusBadge'
import type { AdminOrderStatus } from '@/modules/admin/orders/types'
import type { StatusTone } from '@/components/status/StatusBadge'
import { cn } from '@/lib/utils'

const LABELS: Record<AdminOrderStatus, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  em_preparacao: 'Em preparação',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

const TONE: Record<AdminOrderStatus, StatusTone> = {
  pendente: 'warning',
  confirmado: 'info',
  em_preparacao: 'info',
  enviado: 'success',
  entregue: 'success',
  cancelado: 'danger',
}

export function AdminOrderStatusBadge({
  status,
  className,
}: {
  status: AdminOrderStatus
  className?: string
}) {
  return <StatusBadge label={LABELS[status]} tone={TONE[status]} className={cn(className)} />
}
